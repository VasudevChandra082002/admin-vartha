import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getHistoryById,
  deleteVersion,
} from "../../service/Article/ArticleService";
import {
  List,
  Card,
  Typography,
  message,
  Spin,
  Popconfirm,
  Modal,
  Table,
  Button,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function ArticleHistoryPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistoryById(articleId);
        // console.log("Article history response", response);
        if (response.success) {
          const sorted = [...response.data].sort(
            (a, b) => b.versionNumber - a.versionNumber
          );
          setHistory(sorted);
        } else {
          message.error("Failed to load article history.");
        }
      } catch (error) {
        message.error("Error fetching history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [articleId]);

  const handleVersionClick = (version) => {
    navigate(`/edit-Article/${articleId}?version=${version.versionNumber}`);
  };

  const handleDeleteVersion = async (versionNumber) => {
    if (versionNumber === 1) {
      message.warning("Version 1 cannot be deleted.");
      return;
    }
    try {
      const response = await deleteVersion(articleId, versionNumber);
      if (response.success) {
        message.success("Version deleted successfully.");
        const updated = history
          .filter((v) => v.versionNumber !== versionNumber)
          .map((v, i) => ({
            ...v,
            versionNumber: history.length - 1 - i, // Recalculate version numbers
          }));
        setHistory(updated);
      } else {
        message.error(response.message || "Failed to delete version.");
      }
    } catch (err) {
      message.error("Error deleting version.");
    }
  };

  const handleViewVersion = (version) => {
    setSelectedVersion(version);
    setViewModalVisible(true);
  };

  const versionDataToTable = (snapshot) => {
    if (!snapshot) return [];

    const flatData = {
      Title: snapshot.title,
      Description: snapshot.description,
      Author: snapshot.author,
      Category: snapshot?.category?.name || snapshot?.category || "",
      Tags: snapshot.tags
        ?.map((t) => (typeof t === "string" ? t : t?.name))
        .join(", "),
      PublishedAt: new Date(snapshot.publishedAt).toLocaleString(),
      Hindi_Title: snapshot?.hindi?.title,
      Hindi_Description: snapshot?.hindi?.description,
      Kannada_Title: snapshot?.kannada?.title,
      Kannada_Description: snapshot?.kannada?.description,
      English_Title: snapshot?.English?.title,
      English_Description: snapshot?.English?.description,
    };

    return Object.entries(flatData).map(([key, value]) => ({
      key,
      label: key.replaceAll("_", " "),
      value: value || "-",
    }));
  };

  const columns = [
    { title: "Field", dataIndex: "label", key: "label", width: "30%" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Article Version History</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={history}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{`Version ${item.versionNumber}`}</span>
                    <div style={{ display: "flex", gap: 12 }}>
                      {/* View Icon for all */}
                      <Tooltip title="View Details">
                        <EyeOutlined
                          style={{ color: "#1890ff", cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewVersion(item);
                          }}
                        />
                      </Tooltip>

                      {/* Delete Icon only for non-latest and not version 1 */}
                      {index !== 0 && item.versionNumber !== 1 && (
                        <Popconfirm
                          title="Are you sure you want to delete this version?"
                          onConfirm={(e) => {
                            e.stopPropagation();
                            handleDeleteVersion(item.versionNumber);
                          }}
                          onCancel={(e) => e.stopPropagation()}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Tooltip title="Delete Version">
                            <DeleteOutlined
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Tooltip>
                        </Popconfirm>
                      )}

                      {/* Arrow to edit only on latest version */}
                      {index === 0 && (
                        <Tooltip title="Edit Version">
                          <ArrowRightOutlined
                            style={{ color: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVersionClick(item);
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                }
                style={{
                  backgroundColor: index !== 0 ? "#f5f5f5" : "#ffffff",
                  cursor: index === 0 ? "pointer" : "default",
                }}
                hoverable={index === 0}
                onClick={() => {
                  if (index === 0) handleVersionClick(item);
                }}
              >
                {/* <Text strong>Title: </Text> {item.snapshot?.title} <br /> */}
                {/* <Text strong>Description: </Text> {item.snapshot?.description} <br /> */}
                            <Text strong>Updated By: </Text>{item?.updatedBy?.displayName || "-"} <br />

                <Text strong>IsLive: </Text> {item.snapshot?.isLive ? "Yes" : "No"} <br />
                <Text strong>Updated At: </Text>{" "}
                {new Date(item.updatedAt).toLocaleString()}
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Modal for Viewing Version */}
      <Modal
        title={`Version ${selectedVersion?.versionNumber} Details`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Table
          dataSource={versionDataToTable(selectedVersion?.snapshot)}
          columns={columns}
          pagination={false}
          rowKey="key"
          bordered
        />
      </Modal>
    </div>
  );
}

export default ArticleHistoryPage;
