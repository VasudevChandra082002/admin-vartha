import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Modal, Descriptions, Popconfirm } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getPhotoCategories, deletePhotoCategory } from "../../service/photoCategory/PhotoCategoryApi";

function PhotoCategoryTable() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getPhotoCategories();

      if (response?.success && response?.data?.photo_categories && Array.isArray(response.data.photo_categories)) {
        setCategories(response.data.photo_categories);
      } else {
        message.error("Failed to load photo categories");
      }
    } catch (error) {
      message.error("Error fetching photo categories");
      console.error("Error fetching photo categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setViewModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePhotoCategory(id);
      if (response?.success || response?.message?.includes("deleted")) {
        message.success("Photo category deleted successfully!");
        setCategories(categories.filter((cat) => {
          const catId = typeof cat._id === 'object' && cat._id?.$oid ? cat._id.$oid : cat._id;
          return catId !== id;
        }));
      } else {
        message.error(response?.message || "Failed to delete photo category");
      }
    } catch (error) {
      message.error("Error deleting photo category");
      console.error("Error deleting photo category:", error);
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
      render: (text) => text || "No name",
    },
    {
      title: "English",
      dataIndex: "english",
      key: "english",
      render: (text) => text || "-",
    },
    {
      title: "Hindi",
      dataIndex: "hindi",
      key: "hindi",
      render: (text) => text || "-",
    },
    {
      title: "Kannada",
      dataIndex: "kannada",
      key: "kannada",
      render: (text) => text || "-",
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      render: (date) => {
        if (!date) return "-";
        const dateObj = date?.$date ? new Date(date.$date) : new Date(date);
        return dateObj.toLocaleString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const recordId = typeof record._id === 'object' && record._id?.$oid ? record._id.$oid : record._id;
        return (
          <Space>
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            >
              View
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/photo-category/edit/${recordId}`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this photo category?"
              onConfirm={() => handleDelete(recordId)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={categories.map((cat) => {
          const id = typeof cat._id === 'object' && cat._id?.$oid ? cat._id.$oid : cat._id;
          return { ...cat, key: id };
        })}
        loading={loading}
        rowKey={(record) => {
          const id = typeof record._id === 'object' && record._id?.$oid ? record._id.$oid : record._id;
          return id;
        }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Photo Category Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedCategory && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Category Name">
              {selectedCategory.category_name || "No name"}
            </Descriptions.Item>
            <Descriptions.Item label="English">
              {selectedCategory.english || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Hindi">
              {selectedCategory.hindi || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Kannada">
              {selectedCategory.kannada || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {selectedCategory.date_created?.$date
                ? new Date(selectedCategory.date_created.$date).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default PhotoCategoryTable;
