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
  CheckOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  getAllStatic,
  deleteStaticById,
  approveStaticById,
} from "../../service/Static/StaticService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function StaticTable() {
  const [staticPages, setStaticPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatic, setSelectedStatic] = useState(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchStaticPages();
  }, []);

  const fetchStaticPages = async () => {
    try {
      setLoading(true);
      const response = await getAllStatic();
      console.log("Static table response", response);

      if (Array.isArray(response)) {
        setStaticPages(response);
      } else if (response && Array.isArray(response.data)) {
        setStaticPages(response.data);
      } else {
        message.error("Failed to load static pages - invalid response format");
        setStaticPages([]);
      }
    } catch (error) {
      message.error("Error fetching static pages");
      console.error("Error fetching static pages:", error);
      setStaticPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteStaticById(id);
      if (
        response &&
        (response.success || response.message?.includes("deleted"))
      ) {
        message.success("Static page deleted successfully!");
        setStaticPages(
          staticPages.filter((staticPage) => staticPage._id !== id)
        );
      } else {
        message.error(response?.message || "Failed to delete static page");
      }
    } catch (error) {
      message.error("Error deleting static page");
      console.error("Error deleting static page:", error);
    }
  };

  const handleView = (staticPage) => {
    setSelectedStatic(staticPage);
    setViewModalVisible(true);
  };

  const handleEdit = (staticPage) => {
    navigate(`/static/edit/${staticPage._id}`);
  };

  const handleApproveClick = (staticPage) => {
    setSelectedStatic(staticPage);
    setApprovalModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedStatic) return;

    setApproving(true);
    try {
      const response = await approveStaticById(selectedStatic._id);

      if (response && (response.success || response._id)) {
        message.success("Static page approved successfully!");
        setStaticPages((prevStaticPages) =>
          prevStaticPages.map((staticPage) =>
            staticPage._id === selectedStatic._id
              ? { ...staticPage, status: "approved" }
              : staticPage
          )
        );
        setApprovalModalVisible(false);
        setSelectedStatic(null);
      } else {
        message.error(response?.message || "Failed to approve static page");
      }
    } catch (error) {
      message.error("Error approving static page");
      console.error("Error approving static page:", error);
    } finally {
      setApproving(false);
    }
  };

  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const columns = [
    {
      title: "Link",
      dataIndex: "staticpageLink",
      key: "staticpageLink",
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
      title: "Title",
      dataIndex: "staticpageName",
      key: "staticpageName",
      render: (text) => <span>{text}</span>,
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
              role === "admin" && status !== "approved" ? "pointer" : "default",
          }}
          onClick={() =>
            role === "admin" &&
            status !== "approved" &&
            handleApproveClick(record)
          }
        >
          {status}
          {role === "admin" && status !== "approved" && (
            <span style={{ marginLeft: 5 }}>
              <CheckOutlined />
            </span>
          )}
        </Tag>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => (
        <span>{createdBy?.displayName || createdBy?.email || "Unknown"}</span>
      ),
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.createdTime) - new Date(b.createdTime),
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
{/* 
          {(role === "admin" || role === "moderator") && (
            <Tooltip title="Edit">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )} */}

          {(role === "admin" ||
            (role === "moderator" && record.createdBy?._id === userId)) && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this static page?"
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
        <Title level={2}>Static Pages Management</Title>
      </div>

      <Table
        columns={columns}
        dataSource={staticPages.map((staticPage) => ({
          ...staticPage,
          key: staticPage._id,
        }))}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 6,
        //   showSizeChanger: true,
        //   showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 800 }}
      />

      {/* View Static Page Modal */}
      <Modal
        title="Static Page Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedStatic(null);
        }}
        footer={null}
        width={700}
      >
        {selectedStatic && (
          <div>
            {/* <div style={{ marginBottom: 20, textAlign: "center" }}>
              <Button
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => handleLinkClick(selectedStatic.staticpageLink)}
                size="large"
              >
                Open Static Page Link
              </Button>
            </div> */}

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedStatic.status === "approved"
                      ? "green"
                      : selectedStatic.status === "rejected"
                      ? "red"
                      : "orange"
                  }
                >
                  {selectedStatic.status
                    ? selectedStatic.status.toUpperCase()
                    : "UNKNOWN"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedStatic.createdBy?.displayName ||
                  selectedStatic.createdBy?.email ||
                  "Unknown"}
              </Descriptions.Item>
               <Descriptions.Item label="Website name">
                {selectedStatic.staticpageName}
              </Descriptions.Item>
              <Descriptions.Item label="Created Time">
                {selectedStatic.createdTime
                  ? new Date(selectedStatic.createdTime).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Link">
                <Text
                  style={{
                    maxWidth: "100%",
                    wordBreak: "break-all",
                    cursor: "pointer",
                    color: "#1890ff",
                  }}
                  onClick={() => handleLinkClick(selectedStatic.staticpageLink)}
                >
                  {selectedStatic.staticpageLink}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title="Approve Static Page"
        open={approvalModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApprovalModalVisible(false);
          setSelectedStatic(null);
        }}
        confirmLoading={approving}
        okText="Approve"
        cancelText="Cancel"
        okType="primary"
        width={600}
      >
        {selectedStatic && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Button
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => handleLinkClick(selectedStatic.staticpageLink)}
                size="large"
              >
                Preview Static Page
              </Button>
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Current Status">
                <Tag color="orange">PENDING</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedStatic.createdBy?.displayName ||
                  selectedStatic.createdBy?.email ||
                  "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Created Time">
                {selectedStatic.createdTime
                  ? new Date(selectedStatic.createdTime).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Link">
                <Text style={{ maxWidth: "100%", wordBreak: "break-all" }}>
                  {selectedStatic.staticpageLink}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
}

export default StaticTable;
