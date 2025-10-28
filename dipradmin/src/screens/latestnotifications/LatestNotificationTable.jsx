import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Tag,
  Modal,
  Typography,
  Descriptions,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  getLatestNotifications,
  deleteLatestNotification,
} from "../../service/LatestNotification/LatestNotificationService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function LatestNotificationTable() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getLatestNotifications();

      if (Array.isArray(response)) {
        setNotifications(response);
      } else if (response && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        message.error("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteLatestNotification(id);
      if (response && (response.success || response.message?.includes("deleted"))) {
        message.success("Notification deleted successfully!");
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else {
        message.error(response?.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      message.error("Error deleting notification");
    }
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setViewModalVisible(true);
  };

  const handleLinkClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <Button
          type="link"
          icon={<LinkOutlined />}
          onClick={() => handleLinkClick(text)}
          style={{ padding: 0 }}
        >
          View Link
        </Button>
      ),
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>

          {role === "admin" && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this notification?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <Title level={2}>Latest Notifications</Title> */}
        {/* {role === "admin" && (
          <Button
            type="primary"
            onClick={() => navigate("/add-latest-notification")}
          >
            Add Notification
          </Button>
        )} */}
      </div>

      <Table
        columns={columns}
        dataSource={notifications.map((n) => ({ ...n, key: n._id }))}
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 800 }}
      />

      {/* View Modal */}
      <Modal
        title="Notification Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedNotification(null);
        }}
        footer={null}
        width={700}
      >
        {selectedNotification && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              {selectedNotification.title}
            </Descriptions.Item>
            <Descriptions.Item label="Link">
              <Text
                style={{
                  wordBreak: "break-all",
                  color: "#1890ff",
                  cursor: "pointer",
                }}
                onClick={() => handleLinkClick(selectedNotification.link)}
              >
                {selectedNotification.link}
              </Text>
            </Descriptions.Item>
            {selectedNotification.hindi && (
              <Descriptions.Item label="Hindi">
                {selectedNotification.hindi}
              </Descriptions.Item>
            )}
            {selectedNotification.kannada && (
              <Descriptions.Item label="Kannada">
                {selectedNotification.kannada}
              </Descriptions.Item>
            )}
            {selectedNotification.English && (
              <Descriptions.Item label="English">
                {selectedNotification.English}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Created Time">
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default LatestNotificationTable;
