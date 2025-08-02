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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../service/firebaseConfig";

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

  // Fetch user on load
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

  // Open modal
  const handleEdit = () => {
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
    });
    setEditVisible(true);
  };

  // Firebase Image Upload
  const handleImageUpload = async ({ file }) => {
    setUploading(true);
    const fileRef = ref(storage, `profileImages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        message.error("Image upload failed");
        console.error(error);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, profileImage: url }));
        message.success("Image uploaded");
        setUploading(false);
      }
    );
  };

  // Submit Profile Update
  const handleSubmit = async () => {
    try {
      setUpdating(true);
      const res = await updateUserProfileById(user._id, formData);
      if (res.success) {
        message.success("Profile updated!");
        setUser((prev) => ({ ...prev, ...formData }));
        setEditVisible(false);
      } else {
        message.error(res.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating profile", err);
      message.error("Something went wrong");
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

          <Button icon={<EditOutlined />} onClick={handleEdit} />
        </div>
      )}

      {/* 🛠 Modal for Edit */}
      <Modal
        // title="Edit Profile"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null} // Using buttons inside the form
        //i wnat to increate the font sioz enad i want to center title
        // style={{ textAlign: "center",fontSize:"24px" }}
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
                Upload
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

      {/* 📊 Dashboard Widgets */}
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
