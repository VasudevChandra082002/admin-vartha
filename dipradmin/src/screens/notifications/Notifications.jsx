import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  getAllNotifications,
  createNotification,
} from "../../service/Notifications/notificationsService";
import { getUsers } from "../../service/User/UserApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]); // State to store users

  // Fetch notifications and users
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getAllNotifications();
        setNotifications(data.notifications); // Assuming 'notifications' is an array
      } catch (error) {
        message.error("Failed to fetch notifications");
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(); // Fetching users' data
        if (Array.isArray(usersData.data)) {
          setUsers(usersData.data); // Storing users data only if it's an array
        } else {
          throw new Error("Users data is not an array");
        }
      } catch (error) {
        message.error("Failed to fetch users");
        console.error(error);
      }
    };

    fetchNotifications();
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Table columns
  const columns = [
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => showNotificationModal(record)}>
          View Details
        </Button>
      ),
    },
  ];

  // Show modal function
  const showNotificationModal = (notification) => {
    setIsModalVisible(true);
    form.setFieldsValue({
      title: notification.title,
      description: notification.description,
    });
  };

  // Handle modal submit
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { title, description } = values;

      // Check if users is an array before proceeding
      if (!Array.isArray(users) || users.length === 0) {
        message.error("No users found to send the notification to.");
        return;
      }

      // Collect all FCM tokens from the users
      const fcmTokens = users.map((user) => user.fcmToken).filter(Boolean); // Ensure fcmToken exists

      if (fcmTokens.length === 0) {
        message.error("No FCM tokens found for the users.");
        return;
      }

      // Call the API to create a notification for all users
      const response = await createNotification({
        title,
        description,
        fcmTokens, // Pass the list of FCM tokens to the backend
      });

      if (response.success) {
        message.success("Notification sent successfully!");
        setIsModalVisible(false);
        form.resetFields();
        // Optionally refetch notifications here
      } else {
        message.error("Failed to send notification.");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <h2>Notifications</h2>

      {/* Table to display notifications */}
      <Table
        dataSource={notifications}
        columns={columns}
        rowKey="_id" // Adjust to your data's unique identifier
      />

      {/* Modal to create new notification */}
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginTop: 16 }}
      >
        Create Notification
      </Button>

      <Modal
        title="Create Notification"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Send"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="notificationForm">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Notifications;
