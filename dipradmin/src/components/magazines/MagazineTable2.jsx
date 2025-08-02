import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Image,
  Popconfirm,
  message,
  Modal,
  Typography,
  Input,
  Space,
  Tag,
  Descriptions
} from "antd";
import {
  getMagazines,
  deleteMagazine2,
  approveMagazine2,
  getMagazineHistoryById
} from "../../service/Magazine/MagazineService2";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function MagazineTable2() {
  const [magazines, setMagazines] = useState([]);
  const [filteredMagazines, setFilteredMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      const response = await getMagazines();
      if (response.success) {
        setMagazines(response.data);
        setFilteredMagazines(response.data);
      } else {
        message.error("Failed to load magazines");
      }
    } catch (error) {
      message.error("Error fetching magazines");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMagazine2(id);
      if (response.success) {
        message.success("Magazine deleted successfully!");
        const updatedMagazines = magazines.filter(
          (magazine) => magazine._id !== id
        );
        setMagazines(updatedMagazines);
        setFilteredMagazines(updatedMagazines);
      } else {
        message.error(response.message || "Failed to delete magazine");
      }
    } catch (error) {
      message.error("Error deleting magazine");
      console.error("Delete error:", error);
    }
  };

  const handleView = (magazine) => {
    setSelectedMagazine(magazine);
    setIsModalVisible(true);
  };

  const handleStatusClick = (magazine, e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (userRole === "admin" && magazine.status === "pending") {
      setSelectedMagazine(magazine);
      setIsApprovalModalVisible(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedMagazine) return;
    
    setApproving(true);
    try {
      const response = await approveMagazine2(selectedMagazine._id);
      if (response.success) {
        message.success("Magazine approved successfully!");
        const updatedMagazines = magazines.map(magazine => 
          magazine._id === selectedMagazine._id 
            ? { ...magazine, status: "approved" } 
            : magazine
        );
        setMagazines(updatedMagazines);
        setFilteredMagazines(updatedMagazines);
        setIsApprovalModalVisible(false);
      } else {
        message.error(response.message || "Failed to approve magazine");
      }
    } catch (error) {
      message.error("Error approving magazine");
      console.error("Approval error:", error);
    } finally {
      setApproving(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = magazines.filter((magazine) =>
      magazine.title.toLowerCase().includes(value)
    );
    setFilteredMagazines(filtered);
  };

//  const handleEdit = (id) => {
//   console.log("Editing magazine with ID:", id); // Debug log
//   navigate(`/magazine2-history/${id}`);
// };

    const handleEdit = async (id) => {
      try {
        const res = await getMagazineHistoryById(id);
        if (res.success && Array.isArray(res.data)) {
          if (res.data.length <= 1) {
            navigate(`/edit-magazine2/${id}`);
          } else {
            navigate(`/magazine2-history/${id}`);
          }
        } else {
          navigate(`/edit-magazine2/${id}`);
        }
      } catch (err) {
        message.warning("Error checking magazine history. Redirecting to edit page.");
        navigate(`/edit-magazine2/${id}`);
      }
    };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "magazineThumbnail",
      key: "magazineThumbnail",
      render: (text) => (
        <Image width={60} src={text} alt="Magazine Thumbnail" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Edition",
      dataIndex: "editionNumber",
      key: "editionNumber",
    },
   
    {
      title: "Published Date",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "PDF URL",
      dataIndex: "magazinePdf",
      key: "magazinePdf",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          View PDF
        </a>
      ),
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
        <div onClick={(e) => e.stopPropagation()}>
          <Tag 
            color={status === "approved" ? "green" : "orange"}
            style={{ 
              cursor: userRole === "admin" && status === "pending" ? "pointer" : "default",
              // display: "flex",
              // alignItems: "center",
              // gap: "4px"
            }}
            onClick={(e) => handleStatusClick(record, e)}
          >
            {status.toUpperCase()}
            {userRole === "admin" && status === "pending" && <CheckOutlined />}
          </Tag>
        </div>
      ),
    },
  {
  title: "Actions",
  key: "actions",
  render: (_, record) => (
    <Space onClick={(e) => e.stopPropagation()}> {/* Add stopPropagation here */}
      <Button
        type="default"
        icon={<EyeOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          handleView(record);
        }}
      />
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(record._id);
        }}
      />
      <Popconfirm
        title="Are you sure to delete this magazine?"
        onConfirm={(e) => {
          e?.stopPropagation?.(); // Optional chaining in case e is undefined
          handleDelete(record._id);
        }}
        okText="Yes"
        cancelText="No"
        onCancel={(e) => e?.stopPropagation?.()}
      >
        <Button 
          danger 
          icon={<DeleteOutlined />} 
          onClick={(e) => e.stopPropagation()}
        />
      </Popconfirm>
    </Space>
  ),
}
  ];

  return (
    <>
      <Space
        style={{ display: "flex", justifyContent: "right", marginBottom: 16 }}
      >
        <Input
          placeholder="Search by Title"
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 250 }}
        />
      </Space>

      <Table
        dataSource={filteredMagazines}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleView(record),
        })}
      />

      {/* Magazine Details Modal */}
     <Modal
  title="Magazine Details"
  visible={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width={800}
>
  {selectedMagazine && (
    <>
      <Image
        width="100%"
        height={300}
        src={selectedMagazine.magazineThumbnail}
        alt="Magazine Thumbnail"
        style={{ marginBottom: 20 }}
      />

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Title">
          {selectedMagazine.title}
        </Descriptions.Item>
        <Descriptions.Item label="Edition Number">
          {selectedMagazine.editionNumber || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Published Date">
          {new Date(selectedMagazine.createdTime).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag
            color={selectedMagazine.status === "approved" ? "green" : "orange"}
          >
            {selectedMagazine.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {selectedMagazine.createdBy?.displayName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="PDF Link">
          <a
            href={selectedMagazine.magazinePdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {selectedMagazine.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Kannada Description">
          {selectedMagazine.kannada?.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Hindi Description">
          {selectedMagazine.hindi?.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="English Description">
          {selectedMagazine.english?.description || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </>
  )}
</Modal>


      {/* Approval Modal */}
     <Modal
  title="Approve Magazine"
  visible={isApprovalModalVisible}
  onOk={handleApprove}
  onCancel={() => setIsApprovalModalVisible(false)}
  confirmLoading={approving}
  width={800}
  okText="Approve"
  cancelText="Cancel"
>
  {selectedMagazine && (
    <>
      <Image
        width="100%"
        height={300}
        src={selectedMagazine.magazineThumbnail}
        alt="Magazine Thumbnail"
        style={{ marginBottom: 20 }}
      />

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Title">
          {selectedMagazine.title}
        </Descriptions.Item>
        <Descriptions.Item label="Edition Number">
          {selectedMagazine.editionNumber || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Published Date">
          {new Date(selectedMagazine.createdTime).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag
            color={selectedMagazine.status === "approved" ? "green" : "orange"}
          >
            {selectedMagazine.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {selectedMagazine.createdBy?.displayName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="PDF Link">
          <a
            href={selectedMagazine.magazinePdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {selectedMagazine.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Kannada Description">
          {selectedMagazine.kannada?.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Hindi Description">
          {selectedMagazine.hindi?.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="English Description">
          {selectedMagazine.english?.description || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </>
  )}
</Modal>

    </>
  );
}

export default MagazineTable2;