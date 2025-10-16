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
  Radio,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createArticle } from "../../service/Article/ArticleService";
import { useNavigate } from "react-router-dom";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";
import { getCategories } from "../../service/categories/CategoriesApi";

const { TextArea } = Input;
const { Option } = Select;

function AddArticlePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCategories();
        if (response?.success && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          setCategories(response);
        } else {
          message.error("Failed to load categories.");
        }
      } catch {
        message.error("Error fetching categories.");
      }
    })();
  }, []);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (!imageUrl) {
        message.error("Please upload an image before submitting.");
        setLoading(false);
        return;
      }
      if (!values.publishedAt) {
        message.error("Please select a published date.");
        setLoading(false);
        return;
      }

      const payload = {
        title: values.title,
        description: values.description,
        author: values.author,
        publishedAt: values.publishedAt.toISOString(),
        newsImage: imageUrl,
        category: values.category,      
        magazineType: values.magazineType,  // "magazine" | "magazine2"
        newsType: values.newsType,          // "statenews" | "districtnews" | "specialnews"
      };

      const response = await createArticle(payload);
      console.log("Create article response:", response);

      if (response?.success) {
        message.success("Article created successfully!");
        navigate("/manage-articles");
        form.resetFields();
        setImageUrl("");
        // Navigate to a list page if you have one (optional)
        // navigate("/manage-articles");
      } else {
        message.error(response?.message || "Failed to create article.");
      }
    } catch (err) {
      console.error("Error creating article:", err);
      message.error("Error creating article.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file }) => {
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
      const response = await uploadFileToAzureStorage(file, "newsarticles");
      if (response?.blobUrl) {
        setImageUrl(response.blobUrl);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Article image upload error:", error);
      message.error("Error uploading image to Azure.");
    } finally {
      setImageUploading(false);
    }
    return false;
  };

  return (
    <div>
      <h1>Add New Article</h1>
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
        <Card title="Article Image" style={{ width: "40%" }}>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
            disabled={imageUploading}
          >
            <Button icon={<UploadOutlined />} loading={imageUploading}>
              {imageUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Article"
              style={{ width: "100%", marginTop: 10, objectFit: "cover" }}
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
              <Input placeholder="Enter article title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Enter article description" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select placeholder="Select category">
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Author"
              name="author"
              rules={[{ required: true, message: "Author is required" }]}
            >
              <Input placeholder="Enter author name" />
            </Form.Item>

            <Form.Item
              label="Published Date"
              name="publishedAt"
              rules={[{ required: true, message: "Published date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Magazine Type"
              name="magazineType"
              rules={[
                { required: true, message: "Please select a magazine type" },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="magazine">Vartha Janapada</Radio>
                  <Radio value="magazine2">March Of Karnataka</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="News Type"
              name="newsType"
              rules={[{ required: true, message: "Please select a news type" }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="statenews">State News</Radio>
                  <Radio value="districtnews">District News</Radio>
                  <Radio value="specialnews">Special News</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={imageUploading}
            >
              Create Article
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AddArticlePage;
