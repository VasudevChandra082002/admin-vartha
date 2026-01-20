import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { createPhotoCategory } from "../../service/photoCategory/PhotoCategoryApi";

function AddPhotoCategory() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const categoryData = {
        category_name: values.category_name,
      };

      const response = await createPhotoCategory(categoryData);

      if (response?.success) {
        message.success("Photo category created successfully!");
        form.resetFields();
        navigate("/photo-categories");
      } else {
        message.error(response?.message || "Failed to create photo category.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error creating photo category.");
    } finally {
      setLoading(false);
    }
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
        style={{ width: 520, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
        styles={{ body: { padding: 24 } }}
      >
        <h2 style={{ marginBottom: 20 }}>Add New Photo Category</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Category Name"
            name="category_name"
            rules={[{ required: true, message: "Category name is required" }]}
          >
            <Input placeholder="Enter photo category name" />
          </Form.Item>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Creating..." : "Create Category"}
            </Button>
            <Button onClick={() => navigate(-1)} block style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddPhotoCategory;
