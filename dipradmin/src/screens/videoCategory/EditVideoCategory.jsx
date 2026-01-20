import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { getVideoCategoryById, updateVideoCategory } from "../../service/videoCategory/VideoCategoryApi";

function EditVideoCategory() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setFetching(true);
        const response = await getVideoCategoryById(categoryId);
        
        let category = null;
        if (response?.success && response?.data) {
          category = response.data;
        } else if (response?.data) {
          category = response.data;
        } else if (response && !response.success) {
          category = response;
        }

        if (category) {
          form.setFieldsValue({
            category_name: category.category_name || "",
          });
        } else {
          message.error("Failed to load video category details.");
        }
      } catch (error) {
        console.error("Error fetching video category:", error);
        message.error("Error fetching video category details.");
      } finally {
        setFetching(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, form]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const categoryData = {
        category_name: values.category_name,
      };

      const response = await updateVideoCategory(categoryId, categoryData);

      if (response?.success) {
        message.success("Video category updated successfully!");
        navigate("/video-categories");
      } else {
        message.error(response?.message || "Failed to update video category.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating video category.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f7f9",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

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
        <h2 style={{ marginBottom: 20 }}>Edit Video Category</h2>

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
            <Input placeholder="Enter video category name" />
          </Form.Item>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Updating..." : "Update Category"}
            </Button>
            <Button onClick={() => navigate("/video-categories")} block style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default EditVideoCategory;
