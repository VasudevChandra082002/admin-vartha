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
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  createArticle,
  updateArticle,
} from "../../service/Article/ArticleService";
import { useNavigate } from "react-router-dom";
import { storage } from "../../service/firebaseConfig"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi"; // Import Category service
// import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

function AddArticlePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false); // For Modal visibility
  const [articleData, setArticleData] = useState(null); // For storing article preview data

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
      if (!imageUrl) {
        message.error("Please upload an image before submitting.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        publishedAt: values.publishedAt.toISOString(),
        newsImage: imageUrl, // Firebase Image URL
        category: selectedCategory, // Pass category _id
      };
      console.log("Payload of adding article", payload);
      const response = await createArticle(payload);
      if (response.success) {
        message.success("Article added successfully!");
        setArticleData(response.data); // Set the data to preview modal
        setPreviewVisible(true); // Show the preview modal
        form.resetFields();
        setImageUrl("");
        setSelectedCategory(null);
      } else {
        message.error("Failed to add article.");
      }
    } catch (error) {
      message.error("Error adding article.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `newsImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Progress tracking
      },
      (error) => {
        message.error("Image upload failed!");
        setImageUploading(false);
      },
      async () => {
        // Get download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        message.success("Image uploaded successfully!");
        setImageUploading(false);
      }
    );
  };

  const handlePreviewUpdate = async () => {
    const updatedData = form.getFieldsValue(); // Get all form values

    try {
      const payload = {
        ...updatedData,
        isLive: true, // Ensure isLive is always true
      };

      const response = await updateArticle(articleData._id, payload);
      if (response.success) {
        message.success("Article updated successfully!");
        setPreviewVisible(false); // Close the modal
        setArticleData(response.data); // Update preview data
      } else {
        message.error("Failed to update article.");
      }
    } catch (error) {
      message.error("Error updating article.");
    }
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
          >
            <Button icon={<UploadOutlined />} loading={imageUploading}>
              {imageUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Article"
              style={{ width: "100%", marginTop: 10 }}
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
              <Select
                placeholder="Select category"
                onChange={(value) => setSelectedCategory(value)}
              >
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
              rules={[
                { required: true, message: "Published date is required" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Preview
            </Button>
          </Form>
        </Card>
      </div>

      {/* Preview Modal */}
      <Modal
        title="Preview Article"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        onOk={handlePreviewUpdate}
        okText="Confirm"
      >
        <Form layout="vertical" initialValues={articleData}>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Hindi Title" name={["hindi", "title"]}>
            <Input />
          </Form.Item>

          <Form.Item label="Hindi Description" name={["hindi", "description"]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Kannada Title" name={["kannada", "title"]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Kannada Description"
            name={["kannada", "description"]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="English Title" name={["English", "title"]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="English Description"
            name={["English", "description"]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select>
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Author" name="author">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddArticlePage;
