import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Select,
  message,
} from "antd";
import { UploadOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getVideoById,
  updateLongVideoById,
  revertLongVideoByVersionNumber,
  getLongVideoHistoryById, // ⬅️ import this function
} from "../../service/LongVideo/LongVideoService";
import { getCategories } from "../../service/categories/CategoriesApi";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { TextArea } = Input;
const { Option } = Select;

function EditLongVideos() {
  const { videoId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const versionParam = queryParams.get("version");

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [fetchedVideoData, setFetchedVideoData] = useState(null);
  const [previousVersion, setPreviousVersion] = useState(null);

  useEffect(() => {
    fetchVideoData();
  }, []);

  useEffect(() => {
    if (fetchedVideoData) {
      fetchCategories();
    }
  }, [fetchedVideoData]);

    useEffect(() => {
      if (versionParam) {
        fetchVersionHistory();
      }
    }, [versionParam]);

  const fetchVideoData = async () => {
    try {
      const res = await getVideoById(videoId);
      if (res.success) {
        setFetchedVideoData(res.data);
      } else {
        message.error(res.message || "Failed to load video");
      }
    } catch (err) {
      message.error("Error fetching video");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);

        const {
          title,
          description,
          category,
          Topics,
          thumbnail,
          video_url,
        } = fetchedVideoData;

        form.setFieldsValue({
          title,
          description,
          category,
          topics: Topics,
        });

        setImageUrl(thumbnail);
        setVideoUrl(video_url);
        setSelectedCategory(category);
        setSelectedTopic(Topics);
      } else {
        message.error("Failed to load categories");
      }
    } catch (error) {
      message.error("Error fetching categories");
    }
  };

  const handleImageUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `thumbnails/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      () => {
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
      () => {},
      () => {
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
    const fetchVersionHistory = async () => {
    try {
      const res = await getLongVideoHistoryById(videoId);
      if (res.success && Array.isArray(res.data)) {
        const sorted = res.data.sort((a, b) => b.versionNumber - a.versionNumber);
        const prev = sorted.find((v) => v.versionNumber === versionParam - 1);
        if (prev) setPreviousVersion(prev.versionNumber);
      }
    } catch (err) {
      console.error("Error fetching long video version history", err);
    }
  };

  const handleFormSubmit = async (values) => {
    if (!videoUrl || !imageUrl) {
      return message.error("Please upload both video and thumbnail");
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        video_url: videoUrl,
        thumbnail: imageUrl,
        category: selectedCategory,
        topics: selectedTopic,
      };

      const res = await updateLongVideoById(videoId, payload);
      if (res.success) {
        message.success("Video updated successfully!");
        navigate("/manage-LongVideo");
      } else {
        message.error(res.message || "Failed to update video");
      }
    } catch (error) {
      message.error("Error updating video");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    if (!versionParam || !previousVersion) {
      return message.warning("No version specified in URL.");
    }

    try {
      const res = await revertLongVideoByVersionNumber(videoId, versionParam);
      console.log("Revert response:", res);
      if (res.success) {
        message.success(`Reverted to version ${previousVersion}`);
        navigate("/manage-LongVideo");
        fetchVideoData(); // refresh UI
      } else {
        message.error(res.message || "Failed to revert to version");
      }
    } catch (error) {
      message.error("Error reverting version");
    }
  };

  return (
    <div>
      <div
        // style={{
        //   padding: "0 20px",
        //   display: "flex",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        // }}
      >
        <h1>Edit Long Video</h1>
        {/* {previousVersion && (
          <Button
            icon={<RollbackOutlined />}
            danger
            type="primary"
            onClick={handleRevert}
          >
            Revert to Version {previousVersion}
          </Button>
        )} */}
      </div>

      <div
        style={{
          maxWidth: "80vw",
          margin: "auto",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {/* LEFT - Video Upload */}
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
              </video>
            </div>
          )}
        </Card>

        {/* MIDDLE - Thumbnail */}
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
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select
                placeholder="Select category"
                onChange={(val) => setSelectedCategory(val)}
              >
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
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
                onChange={(val) => setSelectedTopic(val)}
              >
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Video
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default EditLongVideos;
