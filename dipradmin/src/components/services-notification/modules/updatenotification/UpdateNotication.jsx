import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Form,
  message,
  Typography,
  Spin,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import {
  getNewArticleById,
  updateNewArticle,
} from "../../../../service/servicenotification/Servicenotification";
import { UpdateNotificationWrapper } from "./UpdateNotication.styles";

const { Title, Text } = Typography;

function UpdateNotication() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { notificationId } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [notificationId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await getNewArticleById(notificationId);

      if (response && response.success) {
        const data = response.data;
        setInitialData(data);
        form.setFieldsValue({
          title: data.title || "",
          link: data.link || "",
        });
      } else {
        message.error("Failed to fetch article details.");
        navigate("/ServiceNotification");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      message.error("Error fetching article details.");
      navigate("/ServiceNotification");
    } finally {
      setLoading(false);
    }
  };

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

      const response = await updateNewArticle(notificationId, payload);

      if (response && (response._id || response.success)) {
        message.success("Article updated successfully!");
        navigate("/ServiceNotification");
      } else {
        message.error(response?.message || "Failed to update article.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating article.");
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title || "",
        link: initialData.link || "",
      });
    }
  };

  if (loading) {
    return (
      <UpdateNotificationWrapper>
        <div className="loading-container">
          <Spin size="large" />
          <Text>Loading article details...</Text>
        </div>
      </UpdateNotificationWrapper>
    );
  }

  return (
    <UpdateNotificationWrapper>
      <Card className="form-card">
        <Title level={4} className="form-title">
          Update Article
        </Title>
        <Text type="secondary" className="form-subtitle">
          Update the article title and link.
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
              {submitting ? "Updating..." : "Update Article"}
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
            <Button
              onClick={() => navigate("/ServiceNotification")}
              block
              size="large"
              className="cancel-button"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </UpdateNotificationWrapper>
  );
}

export default UpdateNotication;
