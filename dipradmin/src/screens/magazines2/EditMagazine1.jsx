import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Select,
  Space,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  updateMagazine1,
  getMagazineBydid1,
  revertMagazine1ByversionNumber,
  getMagazineHistory1ById,
} from "../../service/Magazine/MagazineService";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi";

const { TextArea } = Input;
const { Option } = Select;

function UpdateMagazinePage1() {
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [fetching, setFetching] = useState(true);
  const [versionHistory, setVersionHistory] = useState([]);
  const [previousVersion, setPreviousVersion] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchMagazineDetails();
  }, [magazineId]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        message.error("Failed to load categories.");
      }
    } catch (error) {
      message.error("Error fetching categories.");
    }
  };

  const fetchMagazineDetails = async () => {
    try {
      const response = await getMagazineBydid1(magazineId);
      if (response.success && response.data) {
        const magazine = response.data;
        setInitialValues({
          title: magazine.title || "",
          description: magazine.description || "",
          editionNumber: magazine.editionNumber || "",
        });
        setImageUrl(magazine.magazineThumbnail);
        setPdfUrl(magazine.magazinePdf);
        setSelectedCategory(magazine.category);
        form.setFieldsValue({
          title: magazine.title,
          description: magazine.description,
          editionNumber: magazine.editionNumber,
        });
      } else {
        message.error("Magazine not found.");
      }
    } catch (error) {
      message.error("Error fetching magazine details.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMagazineHistory1ById(magazineId);
        if (res.success) {
          const sorted = res.data.sort((a, b) => b.versionNumber - a.versionNumber);
          setVersionHistory(sorted);

          if (versionNumber) {
            const current = parseInt(versionNumber);
            const prev = sorted.find((v) => v.versionNumber === current - 1);
            if (prev) setPreviousVersion(prev.versionNumber);
          }
        }
      } catch (err) {
        console.error("Error fetching magazine history", err);
      }
    };

    if (versionNumber) fetchHistory();
  }, [versionNumber, magazineId]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (!imageUrl || !pdfUrl) {
        message.error("Please upload both an image and a PDF.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        magazineThumbnail: imageUrl,
        magazinePdf: pdfUrl,
        editionNumber: values.editionNumber,
      };

      const response = await updateMagazine1(magazineId, payload);
      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-magazines1");
      } else {
        message.error("Failed to update magazine.");
      }
    } catch (error) {
      message.error("Error updating magazine.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `magazineThumbnails/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      () => message.error("Image upload failed!"),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        message.success("Image uploaded successfully!");
        setImageUploading(false);
      }
    );
  };

  const handlePdfUpload = async ({ file }) => {
    setPdfUploading(true);
    const storageRef = ref(storage, `magazinePdfs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      () => message.error("PDF upload failed!"),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setPdfUrl(downloadURL);
        message.success("PDF uploaded successfully!");
        setPdfUploading(false);
      }
    );
  };

  const handleRevert = async () => {
    const current = parseInt(versionNumber);
    if (!previousVersion || !current) {
      message.error("Invalid version to revert.");
      return;
    }

    try {
      const res = await revertMagazine1ByversionNumber(magazineId, current);
      if (res.success) {
        message.success(`Successfully reverted to version ${previousVersion}`);
        navigate("/manage-magazines1");
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
    <div style={{ padding: '20px' }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <Card title="Magazine Thumbnail" style={{ width: "40%" }}>
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={imageUploading}>
              {imageUploading ? "Uploading..." : "Upload Thumbnail"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Magazine"
              style={{ width: "100%", marginTop: 10 }}
            />
          )}
        </Card>

        <Card title="General Information" style={{ width: "60%" }}>
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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={initialValues}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter magazine title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Enter magazine description" />
            </Form.Item>

            <Form.Item
              label="Edition Number"
              name="editionNumber"
              rules={[{ required: true, message: "Edition number is required" }]}
            >
              <Input placeholder="Enter edition number" />
            </Form.Item>

            <Form.Item label="Magazine PDF">
              <Upload
                customRequest={handlePdfUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />} loading={pdfUploading}>
                  {pdfUploading ? "Uploading..." : "Upload PDF"}
                </Button>
              </Upload>

              {pdfUrl && (
                <div style={{ marginTop: 10 }}>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </div>
              )}
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Magazine
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default UpdateMagazinePage1;
