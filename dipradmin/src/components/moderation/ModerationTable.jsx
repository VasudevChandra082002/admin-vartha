import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, message, Modal } from "antd";
import {
  getAllComments,
  deleteComment,
} from "../../service/Comments/CommentService"; // assuming the functions are in services
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

function ModerationTable() {
  const [commentsData, setCommentsData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetch comments from the API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getAllComments();
        // console.log("API response:", response);
        if (response.success) {
          const transformedData = response.data.map((comment) => ({
            key: comment._id,
            user: comment.user?.displayName,
            comment: comment.comment,
            createdTime: new Date(comment.createdTime).toLocaleString(),
            videoTitle: comment.video ? comment.video.title : "N/A",
            newsTitle: comment.news ? comment.news.title : "N/A",
          }));
          setCommentsData(transformedData);
          setFilteredData(transformedData); // Initially set all data as filtered
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  // Search function
  const handleSearch = () => {
    const filtered = commentsData.filter((comment) =>
      comment.comment.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Delete comment handler with confirmation
  const handleDelete = (commentId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await deleteComment(commentId);
          if (response.success) {
            // Remove the deleted comment from the filteredData and commentsData
            const newFilteredData = filteredData.filter(
              (comment) => comment.key !== commentId
            );
            setFilteredData(newFilteredData);

            const newCommentsData = commentsData.filter(
              (comment) => comment.key !== commentId
            );
            setCommentsData(newCommentsData);

            message.success("Comment deleted successfully!");
          } else {
            message.error("Failed to delete the comment.");
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          message.error("Error deleting comment.");
        }
      },
    });
  };

  // Columns definition for the Ant Design Table
  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
    },
    {
      title: "Video",
      dataIndex: "videoTitle",
      key: "videoTitle",
    },
    {
      title: "News",
      dataIndex: "newsTitle",
      key: "newsTitle",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.key)}
          /> */}
          <Button
          danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)} // Call delete handler
          />
        </Space>
      ),
    },
  ];

  // Edit comment handler (for demonstration)
  const handleEdit = (key) => {
    // console.log("Edit comment with key:", key);
    // Add edit functionality here
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search comments"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 10, // Display 10 items per page
        }}
        bordered
      />
    </div>
  );
}

export default ModerationTable;
