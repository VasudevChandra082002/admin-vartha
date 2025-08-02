import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getHistoryOfShortVideosById,
  deleteVideoVersionByversionNumber,
  revertVideoVersionByversionNumber,
} from "../../service/ShortVideos/ShortVideoservice";
import {
  List,
  Card,
  Typography,
  message,
  Spin,
  Popconfirm,
  Modal,
  Button,
  Table,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function ShortVideoHistoryPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [videoId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getHistoryOfShortVideosById(videoId);
      if (response.success) {
        const sorted = [...response.data].sort(
          (a, b) => b.versionNumber - a.versionNumber
        );
        setHistory(sorted);
      } else {
        message.error("Failed to load video version history.");
      }
    } catch (error) {
      message.error("Error fetching video version history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVersion = async (versionNumber) => {
    try {
      const response = await deleteVideoVersionByversionNumber(
        videoId,
        versionNumber
      );
      if (response.success) {
        message.success("Version deleted successfully.");
        fetchHistory();
      } else {
        message.error(response.message || "Failed to delete version.");
      }
    } catch (err) {
      message.error("Error deleting version.");
    }
  };

  const handleRevert = async (versionNumber) => {
    try {
      const response = await revertVideoVersionByversionNumber(
        videoId,
        versionNumber
      );
      if (response.success) {
        message.success(`Reverted to version ${versionNumber}`);
        navigate("/manage-shortvideos");
      } else {
        message.error(response.message || "Failed to revert version.");
      }
    } catch (err) {
      message.error("Error reverting version.");
    }
  };

  const handleViewVersion = (version) => {
    setSelectedVersion(version);
    setViewModalVisible(true);
  };

  const handleVersionClick = (version) => {
    navigate(`/edit-short-video/${videoId}?version=${version.versionNumber}`);
  };

  const versionDataToTable = (snapshot) => {
    if (!snapshot) return [];

    const flatData = {
      Title: snapshot.title,
      Description: snapshot.description,
      VideoURL: snapshot.video_url,
      Thumbnail: snapshot.thumbnail,
    };

    return Object.entries(flatData).map(([key, value]) => ({
      key,
      label: key.replaceAll("_", " "),
      value:
        key === "VideoURL" ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            View Video
          </a>
        ) : key === "Thumbnail" ? (
          <img src={value} alt="thumbnail" width={200} />
        ) : (
          value || "-"
        ),
    }));
  };

  const columns = [
    { title: "Field", dataIndex: "label", key: "label", width: "30%" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Short Video Version History</Title>

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
                      {index !== 0 && (
                        <Tooltip title="View Details">
                          <EyeOutlined
                            style={{ color: "#1890ff", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewVersion(item);
                            }}
                          />
                        </Tooltip>
                      )}

                      {index !== 0 && (
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
                <Text strong>Updated By: </Text>
                {item?.updatedBy?.displayName || "-"} <br />
                <Text strong>Updated At: </Text>
                {new Date(item.updatedAt).toLocaleString()}
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* View Modal */}
      <Modal
        title={`Version ${selectedVersion?.versionNumber} Details`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        //   <Button
        //     key="revert"
        //     danger
        //     onClick={() => handleRevert(selectedVersion.versionNumber)}
        //   >
        //     Revert to this Version
        //   </Button>,
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

export default ShortVideoHistoryPage;
