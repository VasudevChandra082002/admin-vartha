import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice"; // ✅ Azure service
import { createBanner } from "../../service/Banner/BannersService";

const { TextArea } = Input;

function AddBannerPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFormSubmit = async (values) => {
    setLoading(true);
    
    try {
      if (!imageUrl) {
        message.error("Please upload an image before submitting.");
        setLoading(false);
        return;
      }

      const bannerData = {
        title: values.title,
        description: values.description,
        bannerImage: imageUrl,
        // Add any additional fields you need
      };

      const response = await createBanner(bannerData);
      
      if (response && response._id) {
        message.success("Banner created successfully!");
        navigate("/manage-banners");
      } else {
        message.error("Failed to create banner.");
      }
    } catch (error) {
      message.error("Error creating banner.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file }) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }

    // Optional: Limit file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setImageUploading(true);
    try {
      // Upload to Azure container "banners"
      const response = await uploadFileToAzureStorage(file, "banners");
      if (response?.blobUrl) {
        setImageUrl(response.blobUrl);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Banner image upload error:", error);
      message.error("Error uploading image to Azure.");
    } finally {
      setImageUploading(false);
    }

    return false; // Prevent Ant Design's default upload behavior
  };

  return (
    <div>
      <h1>Add New Banner</h1>
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
        <Card title="Banner Image" style={{ width: "40%" }}>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={imageUploading}>
              {imageUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Banner"
              style={{ width: "100%", marginTop: 10, objectFit: "cover" }}
            />
          )}
        </Card>

        {/* RIGHT SIDE - Banner Details */}
        <Card title="Banner Details" style={{ width: "60%" }}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter banner title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Enter banner description" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={imageUploading} // Optional: disable while uploading
            >
              Create Banner
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AddBannerPage;