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
} from "antd";
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getShortVideos,
  deleteById,
} from "../../service/LongVideo/LongVideoService"; // Assuming getShortVideos is imported
import { useNavigate } from "react-router-dom";

function LongVideosTable() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]); // To store the filtered videos
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [currentVideoUrl, setCurrentVideoUrl] = useState(""); // Video URL for modal
  const [searchText, setSearchText] = useState(""); // State to hold the search input
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  // Fetch videos from the API
  const fetchVideos = async () => {
    try {
      const response = await getShortVideos();
      if (response.success) {
        setVideos(response.data); // Assuming the response is an object containing a "data" field
        setFilteredVideos(response.data); // Set the filtered videos initially to all videos
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

  // Handle the delete action
  const handleDelete = async (id) => {
    try {
      const response = await deleteById(id); // Assuming deleteShortVideo function exists
      if (response.success) {
        message.success("Video deleted successfully!");
        setVideos(videos.filter((video) => video._id !== id)); // Remove the deleted video from the state
        setFilteredVideos(filteredVideos.filter((video) => video._id !== id)); // Update the filtered videos state
      } else {
        message.error("Failed to delete video");
      }
    } catch (error) {
      message.error("Error deleting video");
      console.error("Error deleting video:", error);
    }
  };

  // Open video in a new tab
  const handleViewInNewTab = (videoUrl) => {
    window.open(videoUrl, "_blank"); // Opens the video in a new tab
  };

  // Open video in a modal
  const handleViewInModal = (videoUrl) => {
    setCurrentVideoUrl(videoUrl); // Set the current video URL
    setIsModalVisible(true); // Show the modal
  };

  // Modal close handler
  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentVideoUrl(""); // Reset the video URL when closing the modal
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value); // Update searchText state

    // Filter videos by title
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(value)
    );
    setFilteredVideos(filtered); // Update the filtered videos
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
      render: (text) => text || "No title", // Default text if title is empty
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "No description", // Default text if description is empty
    },
    {
      title: "Total Likes",
      dataIndex: "total_Likes",
      key: "total_Likes",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewInModal(record.video_url)} // Open in modal
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewInNewTab(record.video_url)} // Open in new tab
          >
            View in New Tab
          </Button>
          <Popconfirm
            title="Are you sure to delete this video?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
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
        pagination={{ pageSize: 10 }} // You can adjust the number of items per page
      />

      {/* Modal for Video Viewing */}
      <Modal
        title="Video"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <video width="100%" controls>
          <source src={currentVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Modal>
    </div>
  );
}

export default LongVideosTable;
