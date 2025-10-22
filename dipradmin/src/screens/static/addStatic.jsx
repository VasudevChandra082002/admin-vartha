import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Form,
  message,
  Upload,
  Typography,
} from "antd";
import { LinkOutlined, UploadOutlined } from "@ant-design/icons";
import { createStatic } from "../../service/Static/StaticService";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

const { Text } = Typography;

function AddStaticPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async ({ file }) => {
    if (!file.type?.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setUploading(true);
    try {
      // 👇 Upload to Azure container: website
      const res = await uploadFileToAzureStorage(file, "website");
      if (res?.blobUrl) {
        setImageUrl(res.blobUrl);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Error uploading image to Azure.");
    } finally {
      setUploading(false);
    }

    return false; // prevent AntD auto-upload
  };

  const handleFormSubmit = async (values) => {
    if (!values.staticpageLink) {
      message.error("Please enter a link before submitting.");
      return;
    }
    if (!imageUrl) {
      message.error("Please upload a page image before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        staticpageLink: values.staticpageLink,
        staticpageName: values.staticpageName || "Untitled Page",
        staticpageImage: imageUrl, // 👈 include uploaded image
      };

      const response = await createStatic(payload);

      if (response && (response._id || response.success)) {
        message.success("Website added successfully!");
        const status = response.data?.status || response.status || "pending";
        if (status === "pending") {
          message.info("Your website is pending need approval from admin.");
        }
        form.resetFields();
        setImageUrl("");
        setLink("");
        navigate("/website-pages");
      } else {
        message.error(response?.message || "Failed to add website.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error adding website.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkChange = (e) => setLink(e.target.value);

  const onReset = () => {
    form.resetFields();
    setLink("");
    setImageUrl("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card title="Add New Website" style={{ width: 520 }}>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {/* Page Name */}
          <Form.Item
            label="Page Name"
            name="staticpageName"
            rules={[
              { required: true, message: "Please enter a page name!" },
              { min: 2, message: "Page name must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Enter page name" size="large" />
          </Form.Item>

          {/* Page Link */}
          <Form.Item
            label="Page Link"
            name="staticpageLink"
            rules={[
              { required: true, message: "Please enter a link!" },
              { type: "url", message: "Please enter a valid URL!" },
            ]}
          >
            <Input
              placeholder="https://example.com"
              size="large"
              onChange={handleLinkChange}
              prefix={<LinkOutlined />}
            />
          </Form.Item>

          {/* Image Preview */}
          <div
            style={{
              width: "100%",
              height: 240,
              border: "1px dashed #d9d9d9",
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginBottom: 12,
              background: "#fafafa",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Static page"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <Text type="secondary">No image uploaded</Text>
            )}
          </div>

          {/* Image Upload */}
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
            disabled={uploading || submitting}
          >
            <Button
              icon={<UploadOutlined />}
              block
              loading={uploading}
              style={{ marginBottom: 16 }}
            >
              {uploading ? "Uploading..." : "Upload Page Image"}
            </Button>
          </Upload>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={submitting}
              disabled={!link || !imageUrl || uploading}
              style={{ flex: 1 }}
            >
              {submitting ? "Creating..." : "Add website"}
            </Button>
            <Button
              block
              size="large"
              onClick={onReset}
              disabled={uploading || submitting}
              style={{ flex: 1 }}
            >
              Reset
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddStaticPage;
