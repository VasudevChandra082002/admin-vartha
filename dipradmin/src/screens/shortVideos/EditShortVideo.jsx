import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Spin,
  Image,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getVideoById,
  updatevideoById,
  getHistoryOfShortVideosById,
  revertVideoVersionByversionNumber,
} from "../../service/ShortVideos/ShortVideoservice";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { TextArea } = Input;

function EditShortVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const versionNumber = parseInt(searchParams.get("version"));

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [previousVersion, setPreviousVersion] = useState(null);

  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = async () => {
    try {
      const res = await getVideoById(videoId);
      if (res.success) {
        const video = res.data;
        form.setFieldsValue({
          title: video.title,
          description: video.description,
        });
        setVideoUrl(video.video_url);
        setThumbnailUrl(video.thumbnail);
      } else {
        message.error(res.message || "Failed to load video");
      }
    } catch (err) {
      message.error("Error fetching video");
    } finally {
      setLoading(false);
    }
  };

  // Fetch version history if editing a specific version
  useEffect(() => {
    if (versionNumber) {
      const fetchVersionHistory = async () => {
        try {
          const response = await getHistoryOfShortVideosById(videoId);
          if (response.success && Array.isArray(response.data)) {
            const sorted = response.data.sort(
              (a, b) => b.versionNumber - a.versionNumber
            );
            setVersionHistory(sorted);

            const prev = sorted.find(
              (v) => v.versionNumber === versionNumber - 1
            );
            if (prev) {
              setPreviousVersion(prev.versionNumber);
            }
          }
        } catch (err) {
          console.error("Error fetching version history", err);
        }
      };
      fetchVersionHistory();
    }
  }, [versionNumber, videoId]);

  const handleRevert = async () => {
    if (!previousVersion || !versionNumber) {
      message.error("Invalid version to revert.");
      return;
    }

    try {
      const res = await revertVideoVersionByversionNumber(
        videoId,
        versionNumber
      );

      // console.log("Revert response:", res);
      if (res.success) {
        message.success(`Reverted to version ${previousVersion}`);
        navigate("/manage-shortvideos");
      } else {
        message.error(res.message || "Revert failed");
      }
    } catch (err) {
      message.error("Unexpected error while reverting");
    }
  };

  const handleVideoUpload = async ({ file }) => {
    setUploadingVideo(true);
    try {
      const storageRef = ref(storage, `shortVideos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setVideoUrl(downloadURL);
      message.success("Video uploaded successfully");
    } catch {
      message.error("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async ({ file }) => {
    setUploadingThumb(true);
    try {
      const storageRef = ref(storage, `thumbnails/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setThumbnailUrl(downloadURL);
      message.success("Thumbnail uploaded successfully");
    } catch {
      message.error("Failed to upload thumbnail");
    } finally {
      setUploadingThumb(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        video_url: videoUrl,
        thumbnail: thumbnailUrl,
      };
      const res = await updatevideoById(videoId, payload);
      if (res.success) {
        message.success("Video updated successfully");
        navigate("/manage-shortvideos");
      } else {
        message.error(res.message || "Update failed");
      }
    } catch {
      message.error("Error updating video");
    }
  };

  if (loading)
    return (
      <Spin
        size="large"
        style={{ margin: "100px auto", display: "block" }}
      />
    );

  return (
    <div style={{ padding: 24 }}>
      <Card title="Edit Short Video">
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
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={24}>
            {/* Column 1: Video Upload */}
            <Col xs={24} md={8}>
              <Form.Item label="Video File">
                <Upload
                  customRequest={handleVideoUpload}
                  showUploadList={false}
                  accept="video/*"
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploadingVideo}
                    block
                  >
                    {videoUrl ? "Change Video" : "Upload Video"}
                  </Button>
                </Upload>
                {videoUrl && (
                  <video
                    width="100%"
                    style={{ marginTop: 10 }}
                    controls
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </Form.Item>
            </Col>

            {/* Column 2: Thumbnail Upload */}
            <Col xs={24} md={8}>
              <Form.Item label="Thumbnail Image">
                <Upload
                  customRequest={handleThumbnailUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploadingThumb}
                    block
                  >
                    {thumbnailUrl ? "Change Thumbnail" : "Upload Thumbnail"}
                  </Button>
                </Upload>
                {thumbnailUrl && (
                  <Image
                    src={thumbnailUrl}
                    width={"100%"}
                    style={{ marginTop: 10 }}
                  />
                )}
              </Form.Item>
            </Col>

            {/* Column 3: General Info */}
            <Col xs={24} md={8}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Update Video
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default EditShortVideo;

















