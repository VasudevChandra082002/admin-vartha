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
import { createVideo } from "../../service/LongVideo/LongVideoService";
import { useNavigate } from "react-router-dom";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

const { TextArea } = Input;
const { Option } = Select;

function AddLongVideos() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [magazineType, setMagazineType] = useState(null);
  const [newsType, setNewsType] = useState(null);

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
      if (!imageUrl || !videoUrl) {
        message.error(
          "Please upload both a thumbnail and a video before submitting."
        );
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        video_url: videoUrl,
        thumbnail: imageUrl,
        category: selectedCategory,
        topics: selectedTopic,
        magazineType: magazineType, // Add magazineType to payload
        newsType: newsType, // Add newsType to payload
      };

      const response = await createVideo(payload);
      if (response.success) {
        message.success("Video added successfully!");
        form.resetFields();
        setImageUrl("");
        setVideoUrl("");
        setSelectedCategory(null);
        setSelectedTopic(null);
        setMagazineType(null); // Reset magazineType
        setNewsType(null); // Reset newsType
        navigate("/manage-LongVideo");
      } else {
        message.error("Failed to add video.");
      }
    } catch (error) {
      message.error("Error adding video.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async ({ file }) => {
  if (!file.type.startsWith("image/")) {
    message.error("Only image files are allowed for thumbnail!");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    message.error("Thumbnail must be smaller than 5MB!");
    return false;
  }

  setImageUploading(true);
  try {
    const response = await uploadFileToAzureStorage(file, "longvideoimage"); // ✅ container: longvideoimage
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

const handleVideoUpload = async ({ file }) => {
  if (!file.type.startsWith("video/")) {
    message.error("Only video files are allowed!");
    return false;
  }
  // Optional: enforce size limit (e.g., 500MB for long videos)
  if (file.size > 500 * 1024 * 1024) {
    message.error("Video must be smaller than 500MB!");
    return false;
  }

  setVideoUploading(true);
  try {
    const response = await uploadFileToAzureStorage(file, "longvideos"); // ✅ container: longvideos
    if (response?.blobUrl) {
      setVideoUrl(response.blobUrl);
      message.success("Video uploaded successfully!");
    } else {
      message.error("Failed to upload video.");
    }
  } catch (error) {
    console.error("Video upload error:", error);
    message.error("Error uploading video to Azure.");
  } finally {
    setVideoUploading(false);
  }
  return false; // Prevent Ant Design auto-upload
};

  return (
    <div>
      <h1>Add New Video</h1>
      <div
        style={{
          maxWidth: "80vw",
          margin: "auto",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE - Video Upload */}
        <Card title="Video File" style={{ width: "40%" }}>
          <Upload
            customRequest={handleVideoUpload}
            showUploadList={false}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />} loading={videoUploading}>
              {videoUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </Upload>

          {videoUrl && (
            <div style={{ marginTop: 10 }}>
              <video width="100%" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </Card>

        {/* RIGHT SIDE - Thumbnail Image Upload */}
        <Card title="Video Thumbnail" style={{ width: "40%" }}>
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
              alt="Thumbnail"
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
              <Input placeholder="Enter video title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Enter video description" />
            </Form.Item>

            {/* <Form.Item
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
            </Form.Item> */}

            {/* <Form.Item
              label="Topics"
              name="topics"
              rules={[{ required: true, message: "Topics is required" }]}
            >
              <Select
                placeholder="Select topic"
                onChange={(value) => setSelectedTopic(value)}
              >
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}

            {/* Magazine Type Radio Buttons */}
            <Form.Item
              label="Magazine Type"
              name="magazineType"
            >
              <Radio.Group 
                onChange={(e) => setMagazineType(e.target.value)}
                value={magazineType}
              >
                <Space direction="vertical">
                  <Radio value="magazine">Vartha Janapada</Radio>
                  <Radio value="magazine2">March of Karnataka</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            {/* News Type Radio Buttons */}
            <Form.Item
              label="News Type"
              name="newsType"
            >
              <Radio.Group 
                onChange={(e) => setNewsType(e.target.value)}
                value={newsType}
              >
                <Space direction="vertical">
                  <Radio value="statenews">State News</Radio>
                  <Radio value="districtnews">District News</Radio>
                  <Radio value="specialnews">Special News</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Add Video
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AddLongVideos;