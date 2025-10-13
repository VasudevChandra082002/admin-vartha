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
  Descriptions,
} from "antd";
import {
  getArticles,
  deleteArticle,
  approveNews,
  getHistoryById, // ✅ Import history API
} from "../../service/Article/ArticleService";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function ArticleTable() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await getArticles();
      // console.log("Article table response", response);
      if (response.success) {
        setArticles(response.data);
        setFilteredArticles(response.data);
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

  const handleStatusClick = (article, e) => {
    e.stopPropagation();
    if (userRole === "admin" && article.status === "pending") {
      setSelectedArticle(article);
      setIsApprovalModalVisible(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedArticle) return;

    setApproving(true);
    try {
      const response = await approveNews(selectedArticle._id);
      if (response.success) {
        message.success("Article approved successfully!");
        const updatedArticles = articles.map((article) =>
          article._id === selectedArticle._id
            ? { ...article, status: "approved" }
            : article
        );
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles);
        setIsApprovalModalVisible(false);
      } else {
        message.error(response.message || "Failed to approve article");
      }
    } catch (error) {
      message.error("Error approving article");
    } finally {
      setApproving(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(value)
    );
    setFilteredArticles(filtered);
  };

  // ✅ Updated to check version history before navigation
  const handleEdit = async (id) => {
    try {
      const res = await getHistoryById(id);
      if (res.success && Array.isArray(res.data)) {
        if (res.data.length <= 1) {
          navigate(`/edit-Article/${id}`);
        } else {
          navigate(`/article-history/${id}`);
        }
      } else {
        navigate(`/edit-Article/${id}`);
      }
    } catch (err) {
      message.warning(
        "Error checking article history. Redirecting to edit page."
      );
      navigate(`/edit-Article/${id}`);
    }
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
      title: "Magazine types",
      dataIndex: "magazineType",
      key: "magazineType",
      render: (text) => {
        if (text === "magazine") {
          return "Vartha janapada";
        } else if (text === "magazine2") {
          return "March of Karnataka";
        }
        return text || "N/A";
      },
    },
    {
      title: "News type",
      dataIndex: "newsType",
      key: "newsType",
      render: (text) => {
        if (text === "specialnews") {
          return "Special news";
        } else if (text === "statenews") {
          return "State news";
        } else if (text === "districtnews") {
          return "District news";
        }
        return text || "N/A";
      },
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   ellipsis: true,
    // },
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
    // {
    //   title: "Likes",
    //   dataIndex: "total_Likes",
    //   key: "total_Likes",
    // },
    // {
    //   title: "Views",
    //   dataIndex: "views",
    //   key: "views",
    // },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => record.createdBy?.displayName,
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
              cursor:
                userRole === "admin" && status === "pending"
                  ? "pointer"
                  : "default",
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
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          />
          {/* <Popconfirm
            title="Are you sure to delete this article?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm> */}

          {(userRole === "admin" ||
            (userRole === "moderator" &&
              record.createdBy?._id === localStorage.getItem("userId"))) && (
            <Popconfirm
              title="Are you sure to delete this article?"
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
        dataSource={filteredArticles}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      {/* Article View Modal */}
      <Modal
        title="Article Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedArticle && (
          <>
            <Image
              width="100%"
              height={300}
              src={selectedArticle.newsImage}
              alt="Article Image"
              style={{ marginBottom: 20 }}
            />

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Title">
                {selectedArticle.title}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedArticle.category?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Author">
                {selectedArticle.author || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Magazine Type">
                {selectedArticle.magazineType === "magazine"
                  ? "Vartha janapada"
                  : selectedArticle.magazineType === "magazine2"
                  ? "March of Karnataka"
                  : selectedArticle.magazineType || "N/A"}
              </Descriptions.Item>

            <Descriptions.Item label="News Type">
                            {selectedArticle.newsType === "specialnews"
                              ? "Special news"
                              : selectedArticle.newsType === "statenews"
                              ? "State news"
                              : selectedArticle.newsType === "districtnews"
                              ? "District news"
                              : selectedArticle.newsType || "N/A"}
                          </Descriptions.Item>
              <Descriptions.Item label="Published Date">
                {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Likes & Views">
                👍 {selectedArticle.total_Likes || 0} &nbsp;&nbsp;&nbsp; 👀{" "}
                {selectedArticle.views || 0}
              </Descriptions.Item> */}
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedArticle.status === "approved" ? "green" : "orange"
                  }
                >
                  {selectedArticle.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedArticle.createdBy?.displayName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Main Description">
                {selectedArticle.description || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Kannada Description">
                {selectedArticle.kannada?.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Hindi Description">
                {selectedArticle.hindi?.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="English Description">
                {selectedArticle.English?.description || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title="Approve Article"
        visible={isApprovalModalVisible}
        onOk={handleApprove}
        onCancel={() => setIsApprovalModalVisible(false)}
        confirmLoading={approving}
        width={700}
        okText="Approve"
        cancelText="Cancel"
      >
        {selectedArticle && (
          <>
            <Image
              width="100%"
              height={300}
              src={selectedArticle.newsImage}
              alt="Article Image"
              style={{ marginBottom: 20 }}
            />

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Title">
                {selectedArticle.title}
              </Descriptions.Item>
              <Descriptions.Item label="Magazine type">
                {selectedArticle.magazineType}
              </Descriptions.Item>
              <Descriptions.Item label="News type">
                {selectedArticle.newsType}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedArticle.category?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Author">
                {selectedArticle.author || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Published Date">
                {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Likes & Views">
          👍 {selectedArticle.total_Likes || 0} &nbsp;&nbsp;&nbsp; 👀 {selectedArticle.views || 0}
        </Descriptions.Item> */}
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedArticle.status === "approved" ? "green" : "orange"
                  }
                >
                  {selectedArticle.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedArticle.createdBy?.displayName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Main Description">
                {selectedArticle.description || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Kannada Description">
                {selectedArticle.kannada?.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Hindi Description">
                {selectedArticle.hindi?.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="English Description">
                {selectedArticle.English?.description || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
}

export default ArticleTable;
