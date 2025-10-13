import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Form, message } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { createStatic } from "../../service/Static/StaticService";

function AddStaticPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  const handleFormSubmit = async (values) => {
    if (!values.staticpageLink) {
      message.error("Please enter a link before submitting.");
      return;
    }

    setLoading(true);
    try {
      const staticData = { 
        staticpageLink: values.staticpageLink,
        staticpageName: values.staticpageName || "Untitled Page"
      };
      
      const response = await createStatic(staticData);
      console.log("Static page creation response:", response);
      
      if (response && (response._id || response.success)) {
        message.success("Static page created successfully!");
        const status = response.data?.status || response.status || "pending";
        if (status === "pending") {
          message.info("Your static page is pending approval from admin.");
        }
        navigate("/website-pages");
      } else {
        message.error("Failed to create static page.");
      }
    } catch (error) {
      message.error("Error creating static page.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handlePreview = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      message.warning("Please enter a link first.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        title="Add New Static Page"
        style={{
          width: "500px",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          {/* Page Name Field */}
          <Form.Item
            label="Page Name"
            name="staticpageName"
            rules={[
              { required: true, message: "Please enter a page name!" },
              { min: 2, message: "Page name must be at least 2 characters!" }
            ]}
          >
            <Input 
              placeholder="Enter page name" 
              size="large"
            />
          </Form.Item>

          {/* Link Input Field */}
          <Form.Item
            label="Page Link"
            name="staticpageLink"
            rules={[
              { required: true, message: "Please enter a link!" },
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input 
              placeholder="https://example.com" 
              size="large"
              onChange={handleLinkChange}
              prefix={<LinkOutlined />}
            />
          </Form.Item>

          {/* Preview Area */}
          {/* <div
            style={{
              width: "100%",
              height: "100px",
              border: "1px dashed #d9d9d9",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
              backgroundColor: "#fafafa",
              padding: "16px",
            }}
           >
            {link ? (
              <div style={{ textAlign: 'center' }}>
                <Button 
                  type="link" 
                  icon={<LinkOutlined />}
                  onClick={handlePreview}
                  style={{ padding: 0, height: 'auto' }}
                >
                  {link}
                </Button>
                <div style={{ marginTop: '8px' }}>
                  <Button 
                    size="small" 
                    type="primary" 
                    ghost
                    onClick={handlePreview}
                  >
                    Preview Link
                  </Button>
                </div>
              </div>
            ) : (
              <span style={{ color: "#999" }}>No link entered</span>
            )}
          </div> */}

          {/* Submit Button */}
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={!link}
            >
              Create Static Page
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default AddStaticPage;