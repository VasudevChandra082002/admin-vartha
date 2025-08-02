import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMagazineHistoryById,
  deleteVersion2,
} from "../../service/Magazine/MagazineService2";
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

function MagazineHistoryPage2() {
  const { magazineId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [magazineId]);

  const fetchHistory = async () => {
    try {
      const response = await getMagazineHistoryById(magazineId);
      console.log("Magazine history response", response);
      if (response.success) {
        const sorted = [...response.data].sort((a, b) => b.versionNumber - a.versionNumber);
        setHistory(sorted);
      } else {
        message.error(response.message || "Failed to load magazine history.");
      }
    } catch (error) {
      message.error("Error fetching magazine history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVersion = async (versionNumber) => {
    if (versionNumber === 1) {
      message.warning("Version 1 cannot be deleted.");
      return;
    }
    try {
      const response = await deleteVersion2(magazineId, versionNumber);
      if (response.success) {
        message.success("Version deleted successfully.");
        fetchHistory(); // Refresh
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

  const handleEditClick = (version) => {
    navigate(`/edit-magazine2/${magazineId}?version=${version.versionNumber}`);
  };

  const versionDataToTable = (snapshot) => {
    if (!snapshot) return [];

    const flatData = {
      Title: snapshot.title || "-",
      Description: snapshot.description || "-",
      Edition: snapshot.editionNumber || "-",
      Status: snapshot.status || "-",
      PDF: snapshot.magazinePdf ? (
        <a href={snapshot.magazinePdf} target="_blank" rel="noopener noreferrer">View PDF</a>
      ) : "-",
    };

    return Object.entries(flatData).map(([key, value]) => ({
      key,
      label: key,
      value,
    }));
  };

  const columns = [
    { title: "Field", dataIndex: "label", key: "label", width: "30%" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Magazine Version History</Title>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{`Version ${item.versionNumber}`}</span>
                    <div style={{ display: "flex", gap: 12 }}>
                      {/* View Icon */}
                      <Tooltip title="View Details">
                        <EyeOutlined
                          style={{ color: "#1890ff", cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewVersion(item);
                          }}
                        />
                      </Tooltip>

                      {/* Delete Icon for non-latest & non-v1 */}
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

                      {/* Edit arrow for latest */}
                      {index === 0 && (
                        <Tooltip title="Edit Version">
                          <ArrowRightOutlined
                            style={{ color: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(item);
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
                  if (index === 0) handleEditClick(item);
                }}
              >
                <Text strong>Updated By:</Text> {item?.updatedBy?.displayName || "-"} <br />
                {/* <Text strong>Edition:</Text> {item?.editionNumber || "-"} <br />
                <Text strong>Status:</Text> {item?.status || "-"} <br /> */}
                <Text strong>Updated At:</Text>{" "}
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

export default MagazineHistoryPage2;
