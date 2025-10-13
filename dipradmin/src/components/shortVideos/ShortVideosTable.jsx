import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Image,
  Modal,
  Input,
  Tag,
  Descriptions,
  Typography,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  getShortVideos,
  deleteById,
  approveVideo,
  getHistoryOfShortVideosById,
} from "../../service/ShortVideos/ShortVideoservice";
import { data, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function ShortVideosTable() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await getShortVideos();
      if (response.success) {
        // Sort by createdAt in descending order (newest first)
        const sortedVideos = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setVideos(sortedVideos);
        setFilteredVideos(sortedVideos);
      } else {
        message.error("Failed to load videos");
      }
    } catch (error) {
      message.error("Error fetching videos");
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteById(id);
      if (response.success) {
        message.success("Video deleted successfully!");
        setVideos(videos.filter((video) => video._id !== id));
        setFilteredVideos(filteredVideos.filter((video) => video._id !== id));
      } else {
        message.error("Failed to delete video");
      }
    } catch (error) {
      message.error("Error deleting video");
      console.error("Error deleting video:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await getHistoryOfShortVideosById(id);
      if (res.success && Array.isArray(res.data)) {
        if (res.data.length <= 1) {
          navigate(`/edit-short-video/${id}`);
        } else {
          navigate(`/short-video-history/${id}`);
        }
      } else {
        navigate(`/edit-short-video/${id}`);
      }
    } catch (err) {
      message.warning(
        "Error checking video history. Redirecting to edit page."
      );
      navigate(`/edit-short-video/${id}`);
    }
  };

  // const handleViewInNewTab = (videoUrl) => {
  //   window.open(videoUrl, "_blank");
  // };

  // const handleViewInModal = (videoUrl) => {
  //   setCurrentVideoUrl(videoUrl);
  //   setIsModalVisible(true);
  // };

  // New function to handle viewing video details
  const handleViewDetails = (video) => {
    setSelectedVideo(video);
    setIsModalVisible(true);
  };

  const handleStatusClick = (video) => {
    if (userRole === "admin" && video.status === "pending") {
      setSelectedVideo(video);
      setIsApprovalModalVisible(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedVideo) return;

    setApproving(true);
    try {
      const response = await approveVideo(selectedVideo._id);
      if (response.success) {
        message.success("Video approved successfully!");
        const updatedVideos = videos.map((video) =>
          video._id === selectedVideo._id
            ? { ...video, status: "approved" }
            : video
        );
        setVideos(updatedVideos);
        setFilteredVideos(updatedVideos);
        setIsApprovalModalVisible(false);
      } else {
        message.error(response.message || "Failed to approve video");
      }
    } catch (error) {
      message.error("Error approving video");
      console.error("Error approving video:", error);
    } finally {
      setApproving(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(value)
    );
    setFilteredVideos(filtered);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentVideoUrl("");
    setSelectedVideo(null);
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text) => <Image width={100} src={text} alt="Thumbnail" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "No title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "No description",
    },
    {
      title: "Magazine types",
      dataIndex: "magazineType",
      key: "magazineType",
      render: (text) => {
        if (text === "magazine") {
          return "Vartha janapada";
        } else if (text === "magazine2") {
          return "March of Karnataka";
        }
        return text || "N/A";
      },
    },
    {
      title: "News type",
      dataIndex: "newsType",
      key: "newsType",
      render: (text) => {
        if (text === "specialnews") {
          return "Special news";
        } else if (text === "statenews") {
          return "State news";
        } else if (text === "districtnews") {
          return "District news";
        }
        return text || "N/A";
      },
    },
    {
      title: "Total Likes",
      dataIndex: "total_Likes",
      key: "total_Likes",
      render: (text) => text || 0,
    },
    {
      title: "Total Views",
      dataIndex: "Total_views",
      key: "Total_views",
      render: (text) => text || 0,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => record.createdBy?.displayName || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag
          color={status === "approved" ? "green" : "orange"}
          style={{
            cursor:
              userRole === "admin" && status === "pending"
                ? "pointer"
                : "default",
          }}
          onClick={() => handleStatusClick(record)}
        >
          {status.toUpperCase()}
          {userRole === "admin" && status === "pending" && <CheckOutlined />}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>

          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          />

          {(userRole === "admin" ||
            (userRole === "moderator" &&
              record.createdBy?._id === localStorage.getItem("userId"))) && (
            <Popconfirm
              title="Are you sure to delete this video?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search Bar */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Input
          placeholder="Search by Title"
          value={searchText}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 250 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredVideos}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      {/* Video Details Modal */}
      <Modal
        title="Video Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedVideo && (
          <>
            {/* Video Player */}
            <div style={{ marginBottom: 20 }}>
              <video width="100%" controls style={{ marginBottom: 10 }}>
                <source src={selectedVideo.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Thumbnail */}
            <Image
              width="100%"
              height={200}
              src={selectedVideo.thumbnail}
              alt="Video Thumbnail"
              style={{
                marginBottom: 20,
                objectFit: "cover",
              }}
            />

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Title">
                {selectedVideo.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedVideo.description || "N/A"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Category">
                {selectedVideo.category?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Topics">
                {selectedVideo.topics?.name || "N/A"}
              </Descriptions.Item> */}
              <Descriptions.Item label="Magazine Type">
                {selectedVideo.magazineType === "magazine"
                  ? "Vartha janapada"
                  : selectedVideo.magazineType === "magazine2"
                  ? "March of Karnataka"
                  : selectedVideo.magazineType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="News Type">
                {selectedVideo.newsType === "specialnews"
                  ? "Special news"
                  : selectedVideo.newsType === "statenews"
                  ? "State news"
                  : selectedVideo.newsType === "districtnews"
                  ? "District news"
                  : selectedVideo.newsType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Likes & Views">
                👍 {selectedVideo.total_Likes || 0} &nbsp;&nbsp;&nbsp; 👀{" "}
                {selectedVideo.Total_views || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedVideo.status === "approved" ? "green" : "orange"
                  }
                >
                  {selectedVideo.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedVideo.createdBy?.displayName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedVideo.createdAt).toLocaleDateString()}
              </Descriptions.Item>

              {/* Translations */}
              <Descriptions.Item label="Kannada Title">
                {selectedVideo.kannada?.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Kannada Description">
                {selectedVideo.kannada?.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Hindi Title">
                {selectedVideo.hindi?.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Hindi Description">
                {selectedVideo.hindi?.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="English Title">
                {selectedVideo.english?.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="English Description">
                {selectedVideo.english?.description || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title="Approve Video"
        visible={isApprovalModalVisible}
        onOk={handleApprove}
        onCancel={() => setIsApprovalModalVisible(false)}
        confirmLoading={approving}
        width={800}
        okText="Approve"
        cancelText="Cancel"
      >
        {selectedVideo && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {selectedVideo.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedVideo.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Magazine Type">
                {selectedVideo.magazineType === "magazine"
                  ? "Vartha janapada"
                  : selectedVideo.magazineType === "magazine2"
                  ? "March of Karnataka"
                  : selectedVideo.magazineType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedVideo.createdBy?.displayName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Likes">
                {selectedVideo.total_Likes || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedVideo.status === "approved" ? "green" : "orange"
                  }
                >
                  {selectedVideo.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thumbnail">
                <Image
                  width={200}
                  src={selectedVideo.thumbnail}
                  alt="Video Thumbnail"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Preview">
                <video width="100%" height="240" controls>
                  <source src={selectedVideo.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ShortVideosTable;
