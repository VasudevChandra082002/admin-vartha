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
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getArticleById,
  getHistoryById,
  updateArticle,
  revertNewsByVersionNumber,
} from "../../service/Article/ArticleService";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi";
// import moment from "moment";
// import moment from "moment/moment";
import moment from "moment/moment";
const { TextArea } = Input;
const { Option } = Select;

function EditArticlesPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [searchParams] = useSearchParams();
  const versionNumber = searchParams.get("version");

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [initialValues, setInitialValues] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [versionHistory, setVersionHistory] = useState([]);
const [previousVersion, setPreviousVersion] = useState(null);


  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticleById(articleId);
        console.log("edit article page article id", response);
        if (response.success) {
          const data = response.data;
          const formattedValues = {
            ...data,
            publishedAt: moment(data.publishedAt),
            hindi: {
              title: data.hindi?.title || "",
              description: data.hindi?.description || "",
            },
            kannada: {
              title: data.kannada?.title || "",
              description: data.kannada?.description || "",
            },
            English: {
              title: data.English?.title || "",
              description: data.English?.description || "",
            },
          };

          setInitialValues(formattedValues);
          setImageUrl(data.newsImage);
          form.setFieldsValue(formattedValues);
        } else {
          message.error("Failed to fetch article details.");
        }
      } catch (error) {
        message.error("Error fetching article details.");
      } finally {
        setFetching(false);
      }
    };

    fetchArticle();
  }, [articleId, form]);

  useEffect(() => {
  const fetchVersionHistory = async () => {
    try {
      const response = await getHistoryById(articleId);
      if (response.success && Array.isArray(response.data)) {
        const sorted = response.data.sort((a, b) => b.versionNumber - a.versionNumber);
        setVersionHistory(sorted);

        if (versionNumber) {
          const currentVer = parseInt(versionNumber);
          const prev = sorted.find((v) => v.versionNumber === currentVer - 1);
          if (prev) {
            setPreviousVersion(prev.versionNumber);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching version history", err);
    }
  };

  if (versionNumber) {
    fetchVersionHistory();
  }
}, [versionNumber, articleId]);


  // Fetch categories
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

  // Submit form
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
        hindi: {
          title: values.hindi?.title || "",
          description: values.hindi?.description || "",
        },
        kannada: {
          title: values.kannada?.title || "",
          description: values.kannada?.description || "",
        },
        English: {
          title: values.English?.title || "",
          description: values.English?.description || "",
        },
      };

      const response = await updateArticle(articleId, payload);
      if (response.success) {
        message.success("Article updated successfully!");
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

  // Upload image
  const handleUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `newsImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
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

  // Handle revert
const handleRevert = async () => {
  const currentVer = parseInt(versionNumber);
  if (!previousVersion || !currentVer) {
    message.error("Invalid version to revert.");
    return;
  }

  try {
    console.log("Reverting to version:", previousVersion);
    const res = await revertNewsByVersionNumber(articleId, currentVer);
    if (res.success) {
      message.success(`Successfully reverted to version ${previousVersion}.`);
      navigate("/manage-Articles");
    } else {
      message.error(res.message || "Failed to revert version.");
    }
  } catch (err) {
    console.error("Revert error:", err);
    message.error("Unexpected error while reverting.");
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
    <div
      style={{
        maxWidth: "80vw",
        margin: "auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
      }}
    >
      {/* LEFT - Image Upload */}
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

      {/* RIGHT - Form */}
      <Card title="General Information" style={{ width: "60%" }}>
       {previousVersion && (
  <Button
    type="dashed"
    danger
    onClick={handleRevert}
    style={{ marginBottom: 16 }}
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Hindi */}
          <Form.Item
            label="Hindi Title"
            name={["hindi", "title"]}
            rules={[{ required: true, message: "Hindi title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Hindi Description"
            name={["hindi", "description"]}
            rules={[{ required: true, message: "Hindi description is required" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Kannada */}
          <Form.Item
            label="Kannada Title"
            name={["kannada", "title"]}
            rules={[{ required: true, message: "Kannada title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kannada Description"
            name={["kannada", "description"]}
            rules={[{ required: true, message: "Kannada description is required" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* English */}
          <Form.Item
            label="English Title"
            name={["English", "title"]}
            rules={[{ required: true, message: "English title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="English Description"
            name={["English", "description"]}
            rules={[{ required: true, message: "English description is required" }]}
          >
            <TextArea rows={4} />
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
            <Input />
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
