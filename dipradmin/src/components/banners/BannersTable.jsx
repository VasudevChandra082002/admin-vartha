import React, { useEffect, useState } from "react";
import { 
  Table, 
  Button, 
  Popconfirm, 
  message, 
  Image, 
  Space, 
  Tag, 
  Modal,
  Typography,
  Descriptions 
} from "antd";
import { EyeOutlined, DeleteOutlined, CheckOutlined, EditOutlined } from "@ant-design/icons";
import { getBanners, deleteBanner, approveBanner } from "../../service/Banner/BannersService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function BannersTable() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      // console.log("Banner table response get all banners", response);

      if (response && Array.isArray(response)) {
        setBanners(response);
      } else {
        message.error("Failed to load banners");
      }
    } catch (error) {
      message.error("Error fetching banners");
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteBanner(id);
      if (response && response.message === "Banner deleted successfully") {
        message.success("Banner deleted successfully!");
        setBanners(banners.filter((banner) => banner._id !== id));
      } else {
        message.error("Failed to delete banner");
      }
    } catch (error) {
      message.error("Error deleting banner");
      console.error("Error deleting banner:", error);
    }
  };

  const handleView = (banner) => {
    setSelectedBanner(banner);
    setViewModalVisible(true);
  };

  const handleEdit = (banner) => {
    navigate(`/banners/edit/${banner._id}`);
  };

  const handleApproveClick = (banner) => {
    setSelectedBanner(banner);
    setApprovalModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedBanner) return;
    
    setApproving(true);
    try {
      const response = await approveBanner({
        id: selectedBanner._id,
        createdBy: selectedBanner.createdBy?._id || localStorage.getItem("userId")
      });
      
      if (response && response.success) {
        message.success("Banner approved successfully!");
        setBanners(banners.map(banner => 
          banner._id === selectedBanner._id ? { ...banner, status: "approved" } : banner
        ));
        setApprovalModalVisible(false);
      } else {
        message.error(response?.message || "Failed to approve banner");
      }
    } catch (error) {
      message.error("Error approving banner");
      console.error("Error approving banner:", error);
    } finally {
      setApproving(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "bannerImage",
      key: "bannerImage",
      render: (text) => <Image width={100} src={text} alt="Banner" />,
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
      ellipsis: true,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => (
        <span>{record.createdBy?.displayName || "Unknown"}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag 
          color={status === "approved" ? "green" : "orange"}
          style={{ cursor: role === "admin" && status !== "approved" ? "pointer" : "default" }}
          onClick={() => role === "admin" && status !== "approved" && handleApproveClick(record)}
        >
          {status}
          {role === "admin" && status !== "approved" && (
            <span style={{ marginLeft: 5 }}><CheckOutlined /></span>
          )}
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
            onClick={() => handleView(record)}
          />
          {(role === "admin" || role === "moderator") && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          )}
          {(role === "admin" || (role === "moderator" && record.createdBy?._id === localStorage.getItem("userId"))) && (
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
      <Table
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      {/* View Banner Modal */}
      <Modal
        title="Banner Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedBanner && (
          <div>
            <Image
              width="100%"
              src={selectedBanner.bannerImage}
              alt="Banner"
              style={{ marginBottom: 20 }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {selectedBanner.title || "No title"}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedBanner.description || "No description"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBanner.status === "approved" ? "green" : "orange"}>
                  {selectedBanner.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedBanner.createdBy?.displayName || "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedBanner.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title="Approve Banner"
        visible={approvalModalVisible}
        onOk={handleApprove}
        onCancel={() => setApprovalModalVisible(false)}
        confirmLoading={approving}
        okText="Approve"
        cancelText="Cancel"
        width={700}
      >
        {selectedBanner && (
          <>
            <Image
              width="100%"
              src={selectedBanner.bannerImage}
              alt="Banner to approve"
              style={{ marginBottom: 20 }}
            />

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Title">
                {selectedBanner.title || "No title"}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedBanner.description || "No description"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBanner.status === "approved" ? "green" : "orange"}>
                  {selectedBanner.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedBanner.createdBy?.displayName || "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedBanner.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
}

export default BannersTable;