import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Tag,
  Button,
  Space,
  Tooltip,
  Tabs,
  Modal,
  Form,
  Input,
  message,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getUsers,
  createModerator,
  createAdmin, // ✅ new API function for admin creation
  getUserById,
  deleteUser,
} from "../../service/User/UserApi";

const moment = window.moment;
const { TabPane } = Tabs;

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false); // ✅ new admin modal
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form] = Form.useForm();
  const [adminForm] = Form.useForm(); // ✅ separate form for admin creation
  const currentUserRole = localStorage.getItem("role");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsersByRole();
  }, [users, activeTab]);

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

  const filterUsersByRole = () => {
    let filtered = [];
    switch (activeTab) {
      case "users":
        filtered = users.filter((user) => user.role === "content");
        break;
      case "moderators":
        if (currentUserRole !== "moderator") {
          filtered = users.filter((user) => user.role === "moderator");
        }
        break;
      case "admins":
        if (currentUserRole === "admin") {
          filtered = users.filter((user) => user.role === "admin");
        }
        break;
      default:
        filtered = users;
    }
    setFilteredUsers(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 🔹 Modal open/close
  const handleCreateModerator = () => setIsModalVisible(true);
  const handleCreateAdmin = () => setIsAdminModalVisible(true); // ✅ open admin modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleAdminModalCancel = () => {
    setIsAdminModalVisible(false);
    adminForm.resetFields();
  };
  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setCurrentUser(null);
  };

  // 🔹 Fetch single user
  const handleViewUser = async (userId) => {
    try {
      const response = await getUserById(userId);
      if (response.success) {
        setCurrentUser(response.data);
        setIsViewModalVisible(true);
      } else {
        message.error(response.message || "Failed to fetch user details");
      }
    } catch (error) {
      message.error("Error fetching user details");
    }
  };

  // 🔹 Create moderator
  const handleSubmit = async (values) => {
    try {
      const response = await createModerator(values);
      if (response.success) {
        message.success("Moderator created successfully!");
        fetchUsers();
        handleModalCancel();
      } else {
        message.error(response.message || "Failed to create moderator");
      }
    } catch (error) {
      message.error(error.message || "Error creating moderator");
    }
  };

  // ✅ Create admin
  const handleAdminSubmit = async (values) => {
    try {
      const response = await createAdmin(values);
      if (response.success) {
        message.success("Admin created successfully!");
        fetchUsers();
        handleAdminModalCancel();
      } else {
        message.error(response.message || "Failed to create admin");
      }
    } catch (error) {
      message.error(error.message || "Error creating admin");
    }
  };

  const showDeleteConfirm = (userId) => {
    setUserToDelete(userId);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteUser(userToDelete);
      if (response.success) {
        message.success("User deleted successfully!");
        fetchUsers();
      } else {
        message.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      message.error("Error deleting user");
    } finally {
      setDeleteConfirmVisible(false);
      setUserToDelete(null);
    }
  };

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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_Number",
      key: "phone_Number",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const displayRole = role === "content" ? "user" : role;
        return (
          <Tag
            color={
              displayRole === "admin"
                ? "red"
                : displayRole === "moderator"
                ? "blue"
                : "green"
            }
          >
            {displayRole.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View User">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(record._id)}
            />
          </Tooltip>
          {currentUserRole === "admin" && (
            <>
              <Tooltip title="Edit User">
                <Button icon={<EditOutlined />} />
              </Tooltip>
              <Tooltip title="Delete User">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => showDeleteConfirm(record._id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const getTabs = () => {
    if (currentUserRole === "moderator") {
      return [<TabPane tab="Users" key="users" />];
    } else if (currentUserRole === "admin") {
      return [
        <TabPane tab="Users" key="users" />,
        <TabPane tab="Moderators" key="moderators" />,
        <TabPane tab="Admins" key="admins" />,
      ];
    }
    return [<TabPane tab="Users" key="users" />];
  };

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabBarExtraContent={
          currentUserRole === "admin" && (
            <>
              {activeTab === "moderators" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateModerator}
                >
                  Create Moderator
                </Button>
              )}
              {activeTab === "admins" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateAdmin}
                >
                  Add Admin
                </Button>
              )}
            </>
          )
        }
      >
        {getTabs()}
      </Tabs>

      <Table
        columns={columns}
        dataSource={filteredUsers.map((user) => ({
          key: user._id,
          ...user,
        }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* ✅ Create Moderator Modal */}
      <Modal
        title="Create New Moderator"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input the password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true, message: "Please input the display name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_Number"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Moderator
          </Button>
        </Form>
      </Modal>

      {/* ✅ Add Admin Modal */}
      <Modal
        title="Add New Admin"
        open={isAdminModalVisible}
        onCancel={handleAdminModalCancel}
        footer={null}
      >
        <Form form={adminForm} layout="vertical" onFinish={handleAdminSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input the password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true, message: "Please input the display name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_Number"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Admin
          </Button>
        </Form>
      </Modal>

      {/* Existing View + Delete modals remain unchanged */}
    </div>
  );
}

export default UsersTable;
