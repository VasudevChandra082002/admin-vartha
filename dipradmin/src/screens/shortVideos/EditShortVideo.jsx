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
  Radio,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getVideoById,
  updatevideoById,
  getHistoryOfShortVideosById,
  revertVideoVersionByversionNumber,
} from "../../service/ShortVideos/ShortVideoservice";

// 🔻 REMOVED Firebase
// import { storage } from "../../service/firebaseConfig";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// ✅ ADDED Azure
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

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
  const [magazineType, setMagazineType] = useState(null);
  const [newsType, setNewsType] = useState(null);
  const [isReverting, setIsReverting] = useState(false);

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
          magazineType: video.magazineType,
          newsType: video.newsType,
        });
        setVideoUrl(video.video_url);
        setThumbnailUrl(video.thumbnail);
        setMagazineType(video.magazineType);
        setNewsType(video.newsType);
      } else {
        message.error(res.message || "Failed to load video");
      }
    } catch (err) {
      message.error("Error fetching video");
    } finally {
      setLoading(false);
    }
  };

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
              setPreviousVersion(prev);
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

    setIsReverting(true);
    try {
      const res = await revertVideoVersionByversionNumber(
        videoId,
        versionNumber
      );

      if (res.success) {
        message.success(`Successfully reverted to version ${previousVersion.versionNumber}`);
        await fetchVideoData();
        setTimeout(() => {
          navigate("/manage-shortvideos");
        }, 1000);
      } else {
        message.error(res.message || "Revert failed");
      }
    } catch (err) {
      message.error("Unexpected error while reverting");
      console.error("Revert error:", err);
    } finally {
      setIsReverting(false);
    }
  };

  // ✅ Upload video to Azure container "shortvideos"
  const handleVideoUpload = async ({ file }) => {
    if (!file.type.startsWith("video/")) {
      message.error("Only video files are allowed!");
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      message.error("Video must be smaller than 100MB!");
      return false;
    }

    setUploadingVideo(true);
    try {
      const response = await uploadFileToAzureStorage(file, "shortvideos");
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
      setUploadingVideo(false);
    }
    return false; // Prevent AntD auto-upload
  };

  // ✅ Upload thumbnail to Azure container "shortvideoimages"
  const handleThumbnailUpload = async ({ file }) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Thumbnail must be smaller than 5MB!");
      return false;
    }

    setUploadingThumb(true);
    try {
      const response = await uploadFileToAzureStorage(file, "shortvideoimages");
      if (response?.blobUrl) {
        setThumbnailUrl(response.blobUrl);
        message.success("Thumbnail uploaded successfully!");
      } else {
        message.error("Failed to upload thumbnail.");
      }
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      message.error("Error uploading thumbnail to Azure.");
    } finally {
      setUploadingThumb(false);
    }
    return false; // Prevent AntD auto-upload
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        video_url: videoUrl,
        thumbnail: thumbnailUrl,
        magazineType: magazineType,
        newsType: newsType,
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
          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              danger
              onClick={handleRevert}
              loading={isReverting}
            >
              Revert to Version {previousVersion.versionNumber}
            </Button>
          </div>
        )}
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={24}>
            {/* Video Upload */}
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

            {/* Thumbnail Upload */}
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

            {/* General Info */}
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

              <Form.Item label="Magazine Type" name="magazineType">
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

              <Form.Item label="News Type" name="newsType">
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

              <Button type="primary" htmlType="submit" block disabled>
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