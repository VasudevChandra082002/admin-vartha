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
import { createNewArticle } from "../../../../service/servicenotification/Servicenotification";
import { AddNotificationWrapper } from "./AddNotication.styles";

const { Title, Text } = Typography;

function AddNotication() {
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
        link: values.link.trim(),
      };

      const response = await createNewArticle(payload);

      if (response && (response._id || response.success)) {
        message.success("Article added successfully!");
        form.resetFields();
        navigate("/ServiceNotification");
      } else {
        message.error(response?.message || "Failed to add article.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error creating article.");
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <AddNotificationWrapper>
      <Card className="form-card">
        <Title level={4} className="form-title">
          Add New Article
        </Title>
        <Text type="secondary" className="form-subtitle">
          Create a new article with title and link.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
          className="notification-form"
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please enter the article title!",
              },
              {
                min: 3,
                message: "Title must be at least 3 characters long.",
              },
              {
                max: 200,
                message: "Title must be 200 characters or less",
              },
            ]}
          >
            <Input
              placeholder="Enter article title"
              size="large"
            />
          </Form.Item>

          {/* Link */}
          <div className="link-preview-box">
            <Form.Item
              name="link"
              style={{ width: "100%", margin: 0 }}
              rules={[
                {
                  required: true,
                  message: "Please enter the link!",
                },
                {
                  type: "url",
                  message: "Please enter a valid URL!",
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
            <Text type="secondary" className="link-hint">
              Enter a valid URL for the article
            </Text>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
              block
              size="large"
              className="submit-button"
            >
              {submitting ? "Creating..." : "Create Article"}
            </Button>
            <Button
              onClick={onReset}
              disabled={submitting}
              block
              size="large"
              className="reset-button"
            >
              Reset
            </Button>
          </div>
        </Form>
      </Card>
    </AddNotificationWrapper>
  );
}

export default AddNotication;
