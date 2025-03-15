import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Button, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getUsers } from "../../service/User/UserApi";
import moment from "moment";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response.success) {
          setUsers(response.data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Action handlers
  const handleEdit = (userId) => {
    console.log(`Edit user: ${userId}`);
    // Add logic to navigate to edit page or open a modal
  };

  const handleDelete = (userId) => {
    console.log(`Delete user: ${userId}`);
    // Add logic for delete functionality
  };

  // Define table columns
  const columns = [
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (profileImage) =>
        profileImage ? (
          <Avatar src={profileImage} />
        ) : (
          <Avatar style={{ backgroundColor: "#87d068" }}>U</Avatar>
        ),
    },
    {
      title: "Name",
      dataIndex: "displayName",
      key: "displayName",
    },

    {
      title: "Phone Number",
      dataIndex: "phone_Number",
      key: "phone_Number",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (time) => moment(time).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Last Logged In",
      dataIndex: "last_logged_in",
      key: "last_logged_in",
      render: (time) =>
        time ? moment(time).format("YYYY-MM-DD HH:mm") : "Never Logged In",
    },
    {
      title: "ArticleRead",
      dataIndex: "totalClickedNews",
      key: "totalClickedNews",
    },
    {
      title: "Category Preferences",
      dataIndex: "preferences",
      key: "preferences",
      render: (preferences) =>
        preferences.categories.length > 0 ? (
          preferences.categories.map((category) => (
            <Tag color="blue" key={category._id}>
              {category.name}
            </Tag>
          ))
        ) : (
          <Tag color="red">No Preferences</Tag>
        ),
    },
    // {
    //   title: "Liked Videos",
    //   dataIndex: "likedVideos",
    //   key: "likedVideos",
    //   render: (likedVideos) =>
    //     likedVideos.length > 0 ? (
    //       likedVideos.map((video) => (
    //         <Tooltip key={video.videoId._id}>
    //           <Tag color="purple"></Tag>
    //         </Tooltip>
    //       ))
    //     ) : (
    //       <Tag color="red">No Liked Videos</Tag>
    //     ),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users.map((user) => ({
        key: user._id,
        ...user,
      }))}
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
}

export default UsersTable;
