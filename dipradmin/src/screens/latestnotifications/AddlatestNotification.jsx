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
import { createLatestNotification } from "../../service/LatestNotification/LatestNotificationService";

const { TextArea } = Input;
const { Title, Text } = Typography;

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
        navigate("/latestnotification");
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
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f7f9",
        padding: 24,
      }}
    >
      <Card
        style={{ 
          width: 520, 
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          borderRadius: 12 
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Title level={4} style={{ marginBottom: 4 }}>
          Add New Notification
        </Title>
        <Text type="secondary">
          Create a new notification with title and link.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
          style={{ marginTop: 20 }}
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { 
                required: true, 
                message: "Please enter the notification title!" 
              },
              { 
                min: 3, 
                message: "Title must be at least 3 characters long." 
              },
              {
                max: 120,
                message: "Title must be 120 characters or less"
              }
            ]}
          >
            <Input 
              placeholder="Enter notification title" 
              size="large"
            />
          </Form.Item>

          {/* Link Preview Box */}
          <div
            style={{
              width: "100%",
              minHeight: 80,
              border: "1px dashed #d9d9d9",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
              marginBottom: 16,
              background: "#fafafa",
            }}
          >
            <Form.Item
              name="link"
              style={{ width: "100%", margin: 0 }}
              rules={[
                { 
                  required: true, 
                  message: "Please enter the link!" 
                },
                { 
                  type: "url", 
                  message: "Please enter a valid URL!" 
                },
              ]}
            >
              <Input
                placeholder="https://example.com"
                prefix={<LinkOutlined />}
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              Enter a valid URL for the notification
            </Text>
          </div>

          {/* Optional Language Fields */}
          {/* <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Optional Language Content
            </Text>
            
            <Form.Item 
              label="Hindi Content" 
              name="hindi"
              style={{ marginBottom: 12 }}
            >
              <TextArea
                placeholder="Enter Hindi text (optional)"
                rows={2}
                allowClear
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item 
              label="Kannada Content" 
              name="kannada"
              style={{ marginBottom: 12 }}
            >
              <TextArea
                placeholder="Enter Kannada text (optional)"
                rows={2}
                allowClear
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item 
              label="English Content" 
              name="English"
              style={{ marginBottom: 12 }}
            >
              <TextArea
                placeholder="Enter English text (optional)"
                rows={2}
                allowClear
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div> */}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
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