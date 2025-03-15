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
import { useNavigate, useParams } from "react-router-dom";
import {
  getArticleById,
  updateArticle,
} from "../../service/Article/ArticleService";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from "moment";
import { getCategories } from "../../service/categories/CategoriesApi";

const { TextArea } = Input;
const { Option } = Select;

function EditArticlesPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [initialValues, setInitialValues] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch article data for editing
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticleById(articleId);
        if (response.success) {
          const data = response.data;
          setInitialValues({
            ...data,
            publishedAt: moment(data.publishedAt),
            hindiTitle: data.hindi.title,
            hindiDescription: data.hindi.description,
            kannadaTitle: data.kannada.title,
            kannadaDescription: data.kannada.description,
            englishTitle: data.English.title,
            englishDescription: data.English.description,
          });
          setImageUrl(data.newsImage);
        } else {
          message.error("Failed to fetch article details.");
        }
      } catch (error) {
        message.error("Error fetching article details.");
      }
    };

    fetchArticle();
  }, [articleId]);

  // Fetch categories for the dropdown
  useEffect(() => {
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

    fetchCategories();
  }, []);

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
        newsImage: imageUrl,
      };

      const response = await updateArticle(articleId, payload);
      if (response.success) {
        message.success("Article updated successfully!");
        form.resetFields();
        setImageUrl("");
        navigate("/manage-Articles");
      } else {
        message.error("Failed to update article.");
      }
    } catch (error) {
      message.error("Error updating article.");
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
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        message.success("Image uploaded successfully!");
        setImageUploading(false);
      }
    );
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
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
            <Input placeholder="Enter article title" />
          </Form.Item>

          {/* Hindi Title and Description */}
          <Form.Item
            label="Hindi Title"
            name="hindiTitle"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter Hindi article title" />
          </Form.Item>

          <Form.Item
            label="Hindi Description"
            name="hindiDescription"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea rows={4} placeholder="Enter Hindi article description" />
          </Form.Item>

          {/* Kannada Title and Description */}
          <Form.Item
            label="Kannada Title"
            name="kannadaTitle"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter Kannada article title" />
          </Form.Item>

          <Form.Item
            label="Kannada Description"
            name="kannadaDescription"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter Kannada article description"
            />
          </Form.Item>

          {/* English Title and Description */}
          <Form.Item
            label="English Title"
            name="englishTitle"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter English article title" />
          </Form.Item>

          <Form.Item
            label="English Description"
            name="englishDescription"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter English article description"
            />
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

          <Button type="primary" htmlType="submit" block loading={loading}>
            Update Article
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default EditArticlesPage;
