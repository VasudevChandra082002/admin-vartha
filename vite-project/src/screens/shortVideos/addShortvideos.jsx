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
import { createVideo } from "../../service/ShortVideos/ShortVideoservice"; // Import the createVideo function
import { useNavigate } from "react-router-dom";
import { storage } from "../../service/firebaseConfig"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi"; // Import Category service

const { TextArea } = Input;
const { Option } = Select;

function AddVideoPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null); // For topics selection

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
        video_url: videoUrl, // Firebase Video URL
        thumbnail: imageUrl, // Firebase Thumbnail URL
        category: selectedCategory, // Pass category _id
        topics: selectedTopic, // Pass topics _id
      };

      const response = await createVideo(payload);
      if (response.success) {
        message.success("Video added successfully!");
        form.resetFields();
        setImageUrl("");
        setVideoUrl("");
        setSelectedCategory(null);
        setSelectedTopic(null); // Reset topic selection
        navigate("/manage-ShortVideos");
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
    setImageUploading(true);
    const storageRef = ref(storage, `thumbnails/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        message.error("Thumbnail upload failed!");
        setImageUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        message.success("Thumbnail uploaded successfully!");
        setImageUploading(false);
      }
    );
  };

  const handleVideoUpload = async ({ file }) => {
    setVideoUploading(true);
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        message.error("Video upload failed!");
        setVideoUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setVideoUrl(downloadURL);
        message.success("Video uploaded successfully!");
        setVideoUploading(false);
      }
    );
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

export default AddVideoPage;
