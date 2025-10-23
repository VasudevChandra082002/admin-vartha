import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Spin,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  updateMagazine2,
  getMagazineBydid2,
  revertMagazine2ByVersionNumber,
  getMagazineHistoryById,
} from "../../service/Magazine/MagazineService2";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

function UpdateMagazinePage2() {
  const { magazineId } = useParams();
  const [searchParams] = useSearchParams();
  const versionNumber = searchParams.get("version");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [previousVersion, setPreviousVersion] = useState(null);

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchMagazineDetails();
  }, [magazineId]);

  const fetchMagazineDetails = async () => {
    try {
      const response = await getMagazineBydid2(magazineId);
      if (response.success && response.data) {
        const mag = response.data;
        form.setFieldsValue({
          title: mag.title,
          description: mag.description,
          editionNumber: mag.editionNumber,
          publishedMonth: mag.publishedMonth,
          publishedYear: mag.publishedYear,
        });
        setInitialValues(mag);
        setThumbnailPreview(mag.magazineThumbnail);
      } else {
        message.error("Magazine not found.");
        navigate("/manage-marchofkarnataka");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching magazine details.");
      navigate("/manage-marchofkarnataka");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMagazineHistoryById(magazineId);
        if (res.success) {
          const sorted = res.data.sort((a, b) => b.versionNumber - a.versionNumber);
          const current = parseInt(versionNumber);
          const prev = sorted.find(v => v.versionNumber === current - 1);
          if (prev) setPreviousVersion(prev.versionNumber);
        }
      } catch (err) {
        console.error("Error fetching version history:", err);
      }
    };
    if (versionNumber) fetchHistory();
  }, [versionNumber, magazineId]);

  const handleThumbnailBeforeUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Please upload a valid image file!");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    message.success(` "${file.name}" image uploaded successfully!`);
    return false;
  };

  const handlePdfBeforeUpload = (file) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      message.error("Please upload a valid PDF file!");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 100 * 1024 * 1024) {
      message.error("PDF must be smaller than 100MB!");
      return Upload.LIST_IGNORE;
    }
    setPdfFile(file);
    message.success(` "${file.name}" PDF uploaded successfully!`);
    return false;
  };

  const handleFormSubmit = async (values) => {
    if (!thumbnailFile && !initialValues.magazineThumbnail) {
      message.error("Please upload a thumbnail image!");
      return;
    }
    if (!pdfFile && !initialValues.magazinePdf) {
      message.error("Please upload a PDF file!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        editionNumber: values.editionNumber.toString(),
        publishedMonth: values.publishedMonth,
        publishedYear: values.publishedYear.toString(),
        magazineThumbnail: thumbnailFile || initialValues.magazineThumbnail,
        magazinePdf: pdfFile || initialValues.magazinePdf,
      };

      const response = await updateMagazine2(magazineId, payload);
      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-marchofkarnataka");
      } else {
        throw new Error(response?.message || "Failed to update magazine");
      }
    } catch (error) {
      console.error(error);
      message.error(error.message || "Error updating magazine.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    const current = parseInt(versionNumber);
    if (!previousVersion || !current) {
      message.error("Invalid version to revert.");
      return;
    }

    try {
      const res = await revertMagazine2ByVersionNumber(magazineId, current);
      if (res.success) {
        message.success(`Successfully reverted to version ${previousVersion}`);
        navigate("/manage-marchofkarnataka");
      } else {
        message.error(res.message || "Failed to revert version.");
      }
    } catch (err) {
      message.error("Unexpected error while reverting.");
    }
  };

  if (fetching) {
    return <Spin size="large" style={{ marginTop: 100 }} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Update March of Karnataka</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Thumbnail Section */}
        <Card title="Magazine Thumbnail" style={{ flex: 1, minWidth: "300px" }}>
          <Upload
            beforeUpload={handleThumbnailBeforeUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} block>
              {thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </Upload>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Preview"
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}
        </Card>

        {/* Details Form */}
        <Card title="Magazine Details" style={{ flex: 2, minWidth: "400px" }}>
          {previousVersion && (
            <Button
              type="dashed"
              danger
              onClick={handleRevert}
              style={{ marginBottom: "20px" }}
            >
              Revert to Version {previousVersion}
            </Button>
          )}

          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Edition Number"
              name="editionNumber"
              rules={[{ required: true, message: "Edition number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="publishedMonth"
              label="Published Month"
              rules={[{ required: true, message: "Please select the month" }]}
            >
              <Select placeholder="Select month">
                {monthOptions.map((month) => (
                  <Option key={month} value={month}>
                    {month}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="publishedYear"
              label="Published Year"
              rules={[
                { required: true, message: "Please enter the year!" },
                { pattern: /^[0-9]{4}$/, message: "Enter valid 4-digit year" },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item label="PDF File">
              <Upload
                beforeUpload={handlePdfBeforeUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />} block>
                  {pdfFile ? "Change PDF" : "Upload PDF"}
                </Button>
              </Upload>

              {pdfFile && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "#666" }}>
                    Selected file: <strong>{pdfFile.name}</strong>
                  </span>
                </div>
              )}
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Update Magazine
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default UpdateMagazinePage2;
