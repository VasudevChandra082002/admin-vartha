import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Upload,
  Card,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createMagazine } from "../../service/Magazine/MagazineService2";
import { useNavigate } from "react-router-dom";
// 🔻 REMOVED Firebase imports
// import { storage } from "../../service/firebaseConfig";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// ✅ ADDED Azure upload utility
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

import { getCategories } from "../../service/categories/CategoriesApi";

const { TextArea } = Input;
const { Option } = Select;

function AddMagazinePage2() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    fetchCategories();
  }, []);

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

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (!imageUrl || !pdfUrl) {
        message.error("Please upload both an image and a PDF before submitting.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        magazineThumbnail: imageUrl,
        magazinePdf: pdfUrl,
        editionNumber: values.editionNumber,
        publishedMonth: values.publishedMonth,
        publishedYear: values.publishedYear.toString(),
      };

      const response = await createMagazine(payload);
      if (response.success) {
        message.success("Magazine added successfully!");
        form.resetFields();
        setImageUrl("");
        setPdfUrl("");
        setSelectedCategory(null);
        navigate("/manage-marchofkarnataka");
      } else {
        message.error("Failed to add magazine.");
      }
    } catch (error) {
      message.error("Error adding magazine.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload thumbnail to Azure container "marchofkarnataka"
  const handleImageUpload = async ({ file }) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setImageUploading(true);
    try {
      const response = await uploadFileToAzureStorage(file, "marchofkarnataka-image");
      if (response?.blobUrl) {
        setImageUrl(response.blobUrl);
        message.success("Thumbnail uploaded successfully!");
      } else {
        message.error("Failed to upload thumbnail.");
      }
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      message.error("Error uploading thumbnail to Azure.");
    } finally {
      setImageUploading(false);
    }
    return false; // Prevent Ant Design auto-upload
  };

  // ✅ Upload PDF to Azure container "marchofkarnataka"
  const handlePdfUpload = async ({ file }) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      message.error("Only PDF files are allowed!");
      return false;
    }
    // Optional: limit PDF size (e.g., 100MB)
    if (file.size > 100 * 1024 * 1024) {
      message.error("PDF must be smaller than 100MB!");
      return false;
    }

    setPdfUploading(true);
    try {
      const response = await uploadFileToAzureStorage(file, "marchofkarnataka-pdf");
      if (response?.blobUrl) {
        setPdfUrl(response.blobUrl);
        message.success("PDF uploaded successfully!");
      } else {
        message.error("Failed to upload PDF.");
      }
    } catch (error) {
      console.error("PDF upload error:", error);
      message.error("Error uploading PDF to Azure.");
    } finally {
      setPdfUploading(false);
    }
    return false; // Prevent Ant Design auto-upload
  };

  return (
    <div>
      <h1>Add New Magazine</h1>
      <div
        style={{
          maxWidth: "80vw",
          margin: "auto",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE - Image Upload */}
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
              style={{ width: "100%", marginTop: 10, objectFit: "contain" }}
            />
          )}
        </Card>

        {/* RIGHT SIDE - General Information */}
        <Card title="General Information" style={{ width: "60%" }}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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
              rules={[
                { required: true, message: "Edition number is required" },
              ]}
            >
              <Input placeholder="Enter edition number" />
            </Form.Item>

            {/* Published Month Field */}
            <Form.Item
              name="publishedMonth"
              label="Published Month"
              rules={[{ required: true, message: "Please select the published month!" }]}
            >
              <Select placeholder="Select month" allowClear>
                {monthOptions.map((month) => (
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

            {/* PDF Upload */}
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
              Add Magazine
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AddMagazinePage2;