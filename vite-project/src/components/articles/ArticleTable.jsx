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
  getArticles,
  deleteArticle,
} from "../../service/Article/ArticleService";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function ArticleTable() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await getArticles();
      if (response.success) {
        setArticles(response.data);
        setFilteredArticles(response.data); // Initialize filtered articles
      } else {
        message.error("Failed to load articles");
      }
    } catch (error) {
      message.error("Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteArticle(id);
      if (response.success) {
        message.success("Article deleted successfully!");
        const updatedArticles = articles.filter(
          (article) => article._id !== id
        );
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles);
      } else {
        message.error("Failed to delete article");
      }
    } catch (error) {
      message.error("Error deleting article");
    }
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setIsModalVisible(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(value)
    );
    setFilteredArticles(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/edit-Article/${id}`); // Navigate to the edit page and pass the article ID
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "newsImage",
      key: "newsImage",
      render: (text) => <Image width={60} src={text} alt="Article" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Published Date",
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Likes",
      dataIndex: "total_Likes",
      key: "total_Likes",
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
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
            onClick={() => handleEdit(record._id)} // Pass the article ID to the edit page
          />
          <Popconfirm
            title="Are you sure to delete this article?"
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
      {/* Search Bar */}
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

      {/* Article Table */}
      <Table
        dataSource={filteredArticles}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }} // Show 10 items per page
      />

      {/* Modal for Viewing Article Details */}
      <Modal
        title="Article Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedArticle && (
          <>
            <Image
              width="100%"
              src={selectedArticle.newsImage}
              alt="Article Image"
            />
            <Title level={4}>{selectedArticle.title}</Title>
            <Text type="secondary">
              Category: {selectedArticle.category.name}
            </Text>
            <br />
            <Text type="secondary">Author: {selectedArticle.author}</Text>
            <br />
            <Text type="secondary">
              Published on:{" "}
              {new Date(selectedArticle.publishedAt).toLocaleDateString()}
            </Text>
            <br />
            <Text strong style={{ display: "block", marginTop: 10 }}>
              Description:
            </Text>
            <Text>{selectedArticle.description}</Text>
            <br />
            <Text type="secondary">
              👍 {selectedArticle.total_Likes} | 👀 {selectedArticle.views}
            </Text>
          </>
        )}
      </Modal>
    </>
  );
}

export default ArticleTable;
