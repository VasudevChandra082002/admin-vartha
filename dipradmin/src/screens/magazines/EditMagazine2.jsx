import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Spin,
  Image,
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
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

const { TextArea } = Input;
const { Option } = Select;

function UpdateMagazinePage2() {
  const { magazineId } = useParams();
  const [searchParams] = useSearchParams();
  const versionNumber = searchParams.get("version");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [fetching, setFetching] = useState(true);
  const [previousVersion, setPreviousVersion] = useState(null);

  // Month options
  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        setFetching(true);
        const response = await getMagazineBydid2(magazineId);

        if (response.success && response.data) {
          const magazine = response.data;
          form.setFieldsValue({
            title: magazine.title,
            description: magazine.description,
            editionNumber: magazine.editionNumber,
            publishedMonth: magazine.publishedMonth,
            publishedYear: magazine.publishedYear,
          });
          setImageUrl(magazine.magazineThumbnail);
          setPdfUrl(magazine.magazinePdf);
        } else {
          message.error(response.message || "Magazine not found");
          navigate("/manage-marchofkarnataka");
        }
      } catch (error) {
        message.error("Error loading magazine data");
        navigate("/manage-marchofkarnataka");
      } finally {
        setFetching(false);
      }
    };

    fetchMagazine();
  }, [magazineId, form, navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getMagazineHistoryById(magazineId);
        if (response.success && Array.isArray(response.data)) {
          const sorted = response.data.sort((a, b) => b.versionNumber - a.versionNumber);
          const currentVer = parseInt(versionNumber);
          const prev = sorted.find(v => v.versionNumber === currentVer - 1);
          if (prev) setPreviousVersion(prev.versionNumber);
        }
      } catch (err) {
        console.error("Error fetching version history", err);
      }
    };

    if (versionNumber) {
      fetchHistory();
    }
  }, [versionNumber, magazineId]);

  const handleFormSubmit = async (values) => {
    if (!imageUrl || !pdfUrl) {
      message.error("Please upload both an image and a PDF");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        magazineThumbnail: imageUrl,
        magazinePdf: pdfUrl,
        editionNumber: values.editionNumber,
        publishedMonth: values.publishedMonth,
        publishedYear: values.publishedYear.toString(),
      };

      const response = await updateMagazine2(magazineId, payload);

      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-marchofkarnataka");
      } else {
        throw new Error(response.message || "Failed to update magazine");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

// ✅ Azure: thumbnail → container "marchofkarnataka-image"
const handleImageUpload = async ({ file }) => {
  if (!file.type?.startsWith("image/")) {
    message.error("Only image files are allowed!");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    message.error("Image must be smaller than 5MB!");
    return false;
  }

  setImageUploading(true);
  try {
    const res = await uploadFileToAzureStorage(file, "marchofkarnataka-image");
    if (res?.blobUrl) {
      setImageUrl(res.blobUrl);
      message.success("Image uploaded successfully!");
    } else {
      message.error("Failed to upload image.");
    }
  } catch (err) {
    console.error("Azure image upload error:", err);
    message.error("Error uploading image to Azure.");
  } finally {
    setImageUploading(false);
  }
  return false; // prevent AntD default upload
};

// ✅ Azure: PDF → container "marchofkarnataka-pdf"
const handlePdfUpload = async ({ file }) => {
  const isPdf = file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    message.error("Only PDF files are allowed!");
    return false;
  }
  if (file.size > 100 * 1024 * 1024) {
    message.error("PDF must be smaller than 100MB!");
    return false;
  }

  setPdfUploading(true);
  try {
    const res = await uploadFileToAzureStorage(file, "marchofkarnataka-pdf");
    if (res?.blobUrl) {
      setPdfUrl(res.blobUrl);
      message.success("PDF uploaded successfully!");
    } else {
      message.error("Failed to upload PDF.");
    }
  } catch (err) {
    console.error("Azure PDF upload error:", err);
    message.error("Error uploading PDF to Azure.");
  } finally {
    setPdfUploading(false);
  }
  return false; // prevent AntD default upload
};


  const handleRevert = async () => {
    const currentVer = parseInt(versionNumber);
    if (!previousVersion || !currentVer) {
      message.error("Invalid version to revert");
      return;
    }

    try {
      const response = await revertMagazine2ByVersionNumber(magazineId, currentVer);
      if (response.success) {
        message.success(`Reverted to version ${previousVersion}`);
        navigate("/manage-marchofkarnataka");
      } else {
        message.error(response.message || "Revert failed");
      }
    } catch (err) {
      console.error("Revert error:", err);
      message.error("Unexpected error while reverting");
    }
  };

  if (fetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Update Magazine</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Thumbnail Upload */}
        <Card title="Magazine Thumbnail" style={{ flex: 1, minWidth: "300px" }}>
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={imageUploading} block>
              {imageUrl ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </Upload>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Magazine Thumbnail"
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}
        </Card>

        {/* Magazine Details Form */}
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
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Magazine title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={4} placeholder="Magazine description" />
            </Form.Item>

            <Form.Item
              name="editionNumber"
              label="Edition Number"
              rules={[
                { required: true, message: "Please enter edition number" },
                { pattern: /^[0-9]+$/, message: "Numbers only" }
              ]}
            >
              <Input placeholder="Edition number" />
            </Form.Item>

            {/* Published Month Field */}
            <Form.Item
              name="publishedMonth"
              label="Published Month"
              rules={[{ required: true, message: "Please select the published month!" }]}
            >
              <Select placeholder="Select month" allowClear>
                {monthOptions.map(month => (
                  <Option key={month.value} value={month.value}>
                    {month.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Published Year Field */}
            <Form.Item
              name="publishedYear"
              label="Published Year"
              rules={[
                { required: true, message: "Please input the published year!" },
                { pattern: /^[0-9]{4}$/, message: "Please enter a valid 4-digit year!" }
              ]}
            >
              <Input 
                placeholder="Enter year (e.g., 2024)" 
                type="number"
                min={1900}
                max={2100}
              />
            </Form.Item>

            <Form.Item label="PDF File">
              <Upload
                customRequest={handlePdfUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />} loading={pdfUploading} block>
                  {pdfUrl ? "Change PDF" : "Upload PDF"}
                </Button>
              </Upload>
              {pdfUrl && (
                <div style={{ marginTop: "10px" }}>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </div>
              )}
            </Form.Item>

          <Button
  type="primary"
  htmlType="submit"
  loading={loading}
  disabled={imageUploading || pdfUploading}
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