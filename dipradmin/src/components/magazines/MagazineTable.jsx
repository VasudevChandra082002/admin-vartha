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
} from "antd";
import {
  getMagazines,
  deleteMagazine,
} from "../../service/Magazine/MagazineService"; // Import the necessary functions
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function MagazineTable() {
  const [magazines, setMagazines] = useState([]);
  const [filteredMagazines, setFilteredMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

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
      const response = await deleteMagazine(id);
      if (response.success) {
        message.success("Magazine deleted successfully!");
        const updatedMagazines = magazines.filter(
          (magazine) => magazine._id !== id
        );
        setMagazines(updatedMagazines);
        setFilteredMagazines(updatedMagazines);
      } else {
        message.error("Failed to delete magazine");
      }
    } catch (error) {
      message.error("Error deleting magazine");
    }
  };

  const handleView = (magazine) => {
    setSelectedMagazine(magazine);
    setIsModalVisible(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = magazines.filter((magazine) =>
      magazine.title.toLowerCase().includes(value)
    );
    setFilteredMagazines(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/edit-magazine2/${id}`);
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="default"
            icon={<EyeOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleView(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record._id)} // Navigate to edit page
          />
          <Popconfirm
            title="Are you sure to delete this magazine?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
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
      />

      <Modal
        title="Magazine Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedMagazine && (
          <>
            <Image
              width="100%"
              src={selectedMagazine.magazineThumbnail}
              alt="Magazine Thumbnail"
            />
            <Title level={4}>{selectedMagazine.title}</Title>
            <Text type="secondary">
              Edition: {selectedMagazine.editionNumber}
            </Text>
            <br />
            <Text type="secondary">
              Published on:{" "}
              {new Date(selectedMagazine.createdTime).toLocaleDateString()}
            </Text>
            <br />
            <Text strong style={{ display: "block", marginTop: 10 }}>
              Description:
            </Text>
            <Text>{selectedMagazine.description}</Text>
            <br />
            <Text type="secondary">
              <a
                href={selectedMagazine.magazinePdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF
              </a>
            </Text>
          </>
        )}
      </Modal>
    </>
  );
}

export default MagazineTable;
