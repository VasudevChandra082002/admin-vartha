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
  Tooltip,
  Descriptions
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getShortVideos, deleteById, approveVideo, getLongVideoHistoryById } from "../../service/LongVideo/LongVideoService";
import { useNavigate } from "react-router-dom";

function LongVideoTable() {
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

      console.log("Video table response", response);
      if (response.success) {
        setVideos(response.data);
        setFilteredVideos(response.data);
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
        const updated = videos.filter((video) => video._id !== id);
        setVideos(updated);
        setFilteredVideos(updated);
      } else {
        message.error("Failed to delete video");
      }
    } catch (error) {
      message.error("Error deleting video");
    }
  };

  const handleApprove = async () => {
    if (!selectedVideo) return;
    setApproving(true);
    try {
      const response = await approveVideo(selectedVideo._id);
      if (response.success) {
        message.success("Video approved successfully!");
        const updated = videos.map((v) =>
          v._id === selectedVideo._id ? { ...v, status: "approved" } : v
        );
        setVideos(updated);
        setFilteredVideos(updated);
        setIsApprovalModalVisible(false);
      } else {
        message.error(response.message || "Failed to approve video");
      }
    } catch (error) {
      message.error("Error approving video");
    } finally {
      setApproving(false);
    }
  };

  const handleViewInNewTab = (url) => {
    window.open(url, "_blank");
  };

  const handleViewInModal = (url) => {
    setCurrentVideoUrl(url);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentVideoUrl("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = videos.filter((v) =>
      v.title?.toLowerCase().includes(value)
    );
    setFilteredVideos(filtered);
  };

  const handleStatusClick = (video) => {
    if (userRole === "admin" && video.status === "pending") {
      setSelectedVideo(video);
      setIsApprovalModalVisible(true);
    }
  };

  // const handleEdit = (id) => {
  //   navigate(`/edit-long-video/${id}`);
  // };

   const handleEdit = async (id) => {
      try {
        const res = await getLongVideoHistoryById(id);
        if (res.success && Array.isArray(res.data)) {
          if (res.data.length <= 1) {
            navigate(`/edit-long-video/${id}`);
          } else {
            navigate(`/long-video-history/${id}`);
          }
        } else {
          navigate(`/edit-long-video/${id}`);
        }
      } catch (err) {
        message.warning("Error checking video history. Redirecting to edit page.");
        navigate(`/edit-long-video/${id}`);
      }
    };
  

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumb) => <Image width={100} src={thumb} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Likes",
      dataIndex: "total_Likes",
      key: "total_Likes",
    },
     {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => record.createdBy?.displayName
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
          {userRole === "admin" && status === "pending" && (
            <CheckOutlined style={{ marginLeft: 5 }} />
          )}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View in Modal">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewInModal(record.video_url)}
            >View </Button>
          </Tooltip>
          <Tooltip title="View in New Tab">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewInNewTab(record.video_url)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record._id)}
            />
          </Tooltip>
          {(userRole === "admin" || (userRole === "moderator" && record.createdBy?._id === localStorage.getItem("userId"))) && (
                         <Popconfirm
                           title="Are you sure to delete this banner?"
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
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
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

      <Modal
        title="Video Preview"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <video width="100%" controls>
          <source src={currentVideoUrl} type="video/mp4" />
        </video>
      </Modal>

    <Modal
  title="Approve Video"
  open={isApprovalModalVisible}
  onOk={handleApprove}
  onCancel={() => setIsApprovalModalVisible(false)}
  confirmLoading={approving}
  okText="Approve"
  cancelText="Cancel"
  width={800}
>
  {selectedVideo && (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Title">
        {selectedVideo.title || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Description">
        {selectedVideo.description || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Created By">
        {selectedVideo.createdBy?.displayName || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Total Likes">
        {selectedVideo.total_Likes || 0}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <Tag color={selectedVideo.status === "approved" ? "green" : "orange"}>
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
  )}
</Modal>

    </div>
  );
}

export default LongVideoTable;
