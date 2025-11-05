import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Modal,
  Typography,
  Descriptions,
  Tooltip,
  Input,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  listNewArticles,
  deleteNewArticle,
  getNewArticleById,
} from "../../service/servicenotification/Servicenotification";
import { useNavigate } from "react-router-dom";
import { NotificationWrapper } from "./Notification.styles";

const { Title, Text } = Typography;
const { Search } = Input;

function NotificationServes() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(1, 20);
  }, []);

  // Debug: Log articles when they change
  useEffect(() => {
    console.log("Articles state updated:", articles);
    console.log("Articles length:", articles.length);
    if (Array.isArray(articles)) {
      const filtered = articles.filter((article) =>
        article.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        article.link?.toLowerCase().includes(searchText.toLowerCase())
      );
      console.log("Filtered articles length:", filtered.length);
    }
  }, [articles, searchText]);

  const fetchArticles = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      const response = await listNewArticles(page, pageSize);
      
      console.log("API Response:", response);
      
      // Ensure we always have an array
      let articlesData = [];
      
      // Handle different response formats
      if (response) {
        // Format 1: { success: true, data: { newarticles: [...] }, total: X, page: X, page_size: X }
        if (response.success && response.data !== undefined) {
          // Check if data is an array directly
          if (Array.isArray(response.data)) {
            articlesData = response.data;
          }
          // Check if data is an object with newarticles property
          else if (response.data && typeof response.data === 'object' && response.data.newarticles) {
            if (Array.isArray(response.data.newarticles)) {
              articlesData = response.data.newarticles;
            }
          }
          // Check if data is an object with other array properties
          else if (response.data && typeof response.data === 'object') {
            // Try to find any array property in the data object
            const keys = Object.keys(response.data);
            for (const key of keys) {
              if (Array.isArray(response.data[key])) {
                articlesData = response.data[key];
                break;
              }
            }
          }
          
          setArticles(articlesData);
          const newPagination = {
            current: response.page || page,
            pageSize: response.page_size || pageSize,
            total: response.total || articlesData.length,
          };
          setPagination(newPagination);
          console.log("Pagination updated:", newPagination);
        }
        // Format 2: { data: [...] } without success field
        else if (response.data !== undefined) {
          if (Array.isArray(response.data)) {
            articlesData = response.data;
          } else if (response.data && typeof response.data === 'object' && response.data.newarticles) {
            if (Array.isArray(response.data.newarticles)) {
              articlesData = response.data.newarticles;
            }
          }
          
          if (articlesData.length > 0 || Array.isArray(articlesData)) {
            setArticles(articlesData);
            const newPagination = {
              current: response.page || page,
              pageSize: response.page_size || pageSize,
              total: response.total || articlesData.length,
            };
            setPagination(newPagination);
            console.log("Pagination updated:", newPagination);
          }
        }
        // Format 3: Direct array response
        else if (Array.isArray(response)) {
          articlesData = response;
          setArticles(articlesData);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: response.length,
          });
        }
        // Format 4: Empty or unexpected format
        else {
          console.warn("Unexpected response format:", response);
          setArticles([]);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: 0,
          });
        }
      } else {
        console.warn("Empty response received");
        setArticles([]);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: 0,
        });
      }
      
      console.log("Articles data set:", articlesData);
      console.log("Articles count:", articlesData.length);
    } catch (error) {
      message.error("Error fetching articles");
      console.error("Error fetching articles:", error);
      setArticles([]);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchArticles(pagination.current, pagination.pageSize);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;

    try {
      const response = await deleteNewArticle(articleToDelete);
      if (response && (response.success || response.message?.includes("deleted"))) {
        message.success("Article deleted successfully!");
        if (Array.isArray(articles)) {
          setArticles(articles.filter((article) => {
            let id = article._id;
            if (id && typeof id === 'object' && id.$oid) {
              id = id.$oid;
            }
            return id !== articleToDelete;
          }));
        }
        setDeleteModalVisible(false);
        setArticleToDelete(null);
        // Refresh the list
        fetchArticles(pagination.current, pagination.pageSize);
      } else {
        message.error(response?.message || "Failed to delete article");
      }
    } catch (error) {
      message.error("Error deleting article");
      console.error("Error deleting article:", error);
    }
  };

  const handleView = async (article) => {
    try {
      // Handle MongoDB _id format
      let articleId = article._id;
      if (articleId && typeof articleId === 'object' && articleId.$oid) {
        articleId = articleId.$oid;
      }
      
      const response = await getNewArticleById(articleId || article._id || article);
      if (response && response.success) {
        setSelectedArticle(response.data);
      } else {
        setSelectedArticle(article);
      }
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error fetching article details:", error);
      setSelectedArticle(article);
      setViewModalVisible(true);
    }
  };

  const handleEdit = (article) => {
    // Handle MongoDB _id format
    let articleId = article._id;
    if (articleId && typeof articleId === 'object' && articleId.$oid) {
      articleId = articleId.$oid;
    }
    navigate(`/ServiceNotification/edit/${articleId || article._id}`);
  };

  const showDeleteConfirm = (articleId) => {
    setArticleToDelete(articleId);
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setArticleToDelete(null);
  };

  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredArticles = Array.isArray(articles) 
    ? articles.filter((article) =>
        article.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        article.link?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text) => <Text strong>{text || "N/A"}</Text>,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      ellipsis: true,
      render: (text) => (
        <Text
          style={{
            color: "#1890ff",
            cursor: "pointer",
            maxWidth: 300,
          }}
          onClick={() => handleLinkClick(text)}
          ellipsis
        >
          {text || "N/A"}
        </Text>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        let date = text || record.created_at || record.createdAt;
        // Handle MongoDB date format { $date: "..." }
        if (date && typeof date === 'object' && date.$date) {
          date = date.$date;
        }
        try {
          return date ? new Date(date).toLocaleDateString() : "N/A";
        } catch (e) {
          return "N/A";
        }
      },
      sorter: (a, b) => {
        let dateA = a.createdAt || a.created_at || 0;
        let dateB = b.createdAt || b.created_at || 0;
        // Handle MongoDB date format
        if (dateA && typeof dateA === 'object' && dateA.$date) {
          dateA = dateA.$date;
        }
        if (dateB && typeof dateB === 'object' && dateB.$date) {
          dateB = dateB.$date;
        }
        return new Date(dateA) - new Date(dateB);
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                let id = record._id;
                if (id && typeof id === 'object' && id.$oid) {
                  id = id.$oid;
                }
                showDeleteConfirm(id || record._id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <NotificationWrapper>
      <div className="header-section">
        <Title level={2}>Service Notifications</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/ServiceNotification/add")}
          size="large"
        >
          Add New Article
        </Button>
      </div>

      <div className="search-section">
        <Search
          placeholder="Search by title or link"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="table-section">
        <Table
          columns={columns}
          dataSource={Array.isArray(filteredArticles) 
            ? filteredArticles.map((article, index) => {
                // Handle MongoDB _id format { $oid: "..." }
                let articleId = article._id;
                if (articleId && typeof articleId === 'object' && articleId.$oid) {
                  articleId = articleId.$oid;
                }
                return {
                  ...article,
                  _id: articleId || article._id || article.id,
                  key: articleId || article._id || article.id || `article-${index}`,
                };
              })
            : []}
          loading={loading}
          rowKey={(record) => {
            let id = record._id;
            if (id && typeof id === 'object' && id.$oid) {
              id = id.$oid;
            }
            return id || record.id || record.key;
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </div>

      {/* View Article Modal */}
      <Modal
        title="Article Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedArticle(null);
        }}
        footer={null}
        width={700}
      >
        {selectedArticle && (
          <div>
            <div style={{ marginBottom: 20, textAlign: "center" }}>
              <Button
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => handleLinkClick(selectedArticle.link)}
                size="large"
              >
                Open Article Link
              </Button>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {selectedArticle.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Link">
                <Text
                  style={{
                    maxWidth: "100%",
                    wordBreak: "break-all",
                    cursor: "pointer",
                    color: "#1890ff",
                  }}
                  onClick={() => handleLinkClick(selectedArticle.link)}
                >
                  {selectedArticle.link || "N/A"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {selectedArticle.createdAt
                  ? new Date(selectedArticle.createdAt).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {selectedArticle.updatedAt
                  ? new Date(selectedArticle.updatedAt).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this article? This action cannot be
          undone.
        </p>
      </Modal>
    </NotificationWrapper>
  );
}

export default NotificationServes;
