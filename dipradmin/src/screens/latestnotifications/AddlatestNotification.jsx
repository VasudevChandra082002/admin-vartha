import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Form,
  message,
  Typography,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { createLatestNotification } from "../../service/LatestNotification/LatestNotificationService"; // ✅ adjust import path as per your structure

const { TextArea } = Input;
const { Text } = Typography;

function AddLatestNotification() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (values) => {
    if (!values.title || !values.link) {
      message.error("Please fill all required fields!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: values.title.trim(),
        hindi: values.hindi?.trim() || "",
        kannada: values.kannada?.trim() || "",
        English: values.English?.trim() || "",
        link: values.link.trim(),
      };

      const response = await createLatestNotification(payload);

      if (response && (response._id || response.success)) {
        message.success("Notification added successfully!");
        form.resetFields();
        navigate("/latestnotification"); // ✅ redirect to your listing page
      } else {
        message.error(response?.message || "Failed to add notification.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error creating notification.");
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        title="Add Latest Notification"
        style={{
          width: 600,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please enter the notification title!" },
              { min: 3, message: "Title must be at least 3 characters long." },
            ]}
          >
            <Input placeholder="Enter notification title" size="large" />
          </Form.Item>

          {/* Hindi Field */}
          {/* <Form.Item label="Hindi Content" name="hindi">
            <TextArea
              placeholder="Enter Hindi text (optional)"
              rows={3}
              allowClear
            />
          </Form.Item> */}

          {/* Kannada Field */}
          {/* <Form.Item label="Kannada Content" name="kannada">
            <TextArea
              placeholder="Enter Kannada text (optional)"
              rows={3}
              allowClear
            />
          </Form.Item>

          {/* English Field */}
          {/* <Form.Item label="English Content" name="English">
            <TextArea
              placeholder="Enter English text (optional)"
              rows={3}
              allowClear
            />
          </Form.Item> */}
           
          {/* Link */}
          <Form.Item
            label="Notification Link"
            name="link"
            rules={[
              { required: true, message: "Please enter the link!" },
              { type: "url", message: "Please enter a valid URL!" },
            ]}
          >
            <Input
              placeholder="https://example.com"
              prefix={<LinkOutlined />}
              size="large"
            />
          </Form.Item>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              block
              size="large"
              style={{ flex: 1 }}
            >
              {submitting ? "Creating..." : "Create Notification"}
            </Button>
            <Button
              onClick={onReset}
              disabled={submitting}
              block
              size="large"
              style={{ flex: 1 }}
            >
              Reset
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddLatestNotification;
