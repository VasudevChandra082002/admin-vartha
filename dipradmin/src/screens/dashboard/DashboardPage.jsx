import React, { useEffect, useState } from "react";
import { DashboardWrapper } from "./DashboardPage.styles";
import StatsCard from "../../components/dashboard/statsCard/StatsCard";
import DailyUserCard from "../../components/dailyUserCard/dailyUserCard";
import KeyStats from "../../components/keyStats/KeyStats";
import {
  getUserProfile,
  updateUserProfileById,
} from "../../service/Dashboard/Dashboardapi";
import { Modal, Input, Button, message, Upload, Form } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice"; // ✅ use your Azure upload helper

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    profileImage: "",
  });
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch user profile on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUser();
  }, []);

  // ✅ Open edit modal
  const handleEdit = () => {
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
    });
    setEditVisible(true);
  };

  // ✅ Upload image to Azure Storage
  const handleImageUpload = async ({ file }) => {
    try {
      setUploading(true);
      const res = await uploadFileToAzureStorage(file, "profileImages"); // 👈 use Azure container name
      if (res?.blobUrl) {
        setFormData((prev) => ({ ...prev, profileImage: res.blobUrl }));
        message.success("Profile image uploaded successfully!");
      } else {
        message.error("Failed to upload to Azure Storage.");
      }
    } catch (error) {
      console.error("Azure upload error:", error);
      message.error("Error uploading image to Azure.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit Profile Update
  const handleSubmit = async () => {
    try {
      setUpdating(true);
      const res = await updateUserProfileById(user._id, formData);
      if (res.success) {
        message.success("Profile updated successfully!");
        setUser((prev) => ({ ...prev, ...formData }));
        setEditVisible(false);
      } else {
        message.error(res.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      message.error("Something went wrong while updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="block-title">Dashboard</div>

      {/* ✅ Profile Card */}
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "20px 0",
            padding: "20px",
            borderRadius: "12px",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={user.profileImage}
              alt="Profile"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #4caf50",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div>
              <h3
                style={{ marginBottom: "8px", fontSize: "20px", color: "#333" }}
              >
                {user.displayName}
              </h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone_Number}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span
                  style={{
                    padding: "2px 10px",
                    background: "#e8f5e9",
                    color: "#388e3c",
                    borderRadius: "4px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  {user.role}
                </span>
              </p>
            </div>
          </div>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>
        </div>
      )}

      {/* ✅ Edit Modal */}
      <Modal
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
        title={
          <div style={{ textAlign: "center", fontSize: "20px", fontWeight: 600 }}>
            Edit Profile
          </div>
        }
      >
        <Form
          layout="horizontal"
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          onFinish={handleSubmit}
          colon={false}
        >
          <Form.Item label="Name" style={{ marginBottom: 16 }}>
            <Input
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Email" style={{ marginBottom: 16 }}>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Profile Image" style={{ marginBottom: 16 }}>
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          {formData.profileImage && (
            <Form.Item label="Preview" style={{ marginBottom: 16 }}>
              <img
                src={formData.profileImage}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                  objectFit: "cover",
                }}
              />
            </Form.Item>
          )}

          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ textAlign: "right", marginTop: 24 }}
          >
            <Button
              onClick={() => setEditVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Dashboard Widgets */}
      <div className="stats-card">
        <StatsCard />
      </div>
      <div className="key-stats">
        <KeyStats />
      </div>
      <div className="daily-user">
        <DailyUserCard />
      </div>
    </DashboardWrapper>
  );
}

export default DashboardPage;
