import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message, Select } from "antd";
import { addCategory } from "../../service/Category/CategoryService";

const { TextArea } = Input;
const { Option } = Select;

function AddCategory() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const categoryData = {
        name: values.name,
        description: values.description,
      };

      const response = await addCategory(categoryData);

      if (response?.success) {
        message.success("Category created successfully!");
        navigate("/category");
      } else {
        message.error(response?.message || "Failed to create category.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error creating category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Category</h1>

      <div
        style={{
          maxWidth: "80vw",
          margin: "auto",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE — Category Info */}
        <Card title="Category Details" style={{ width: "60%" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[{ required: true, message: "Category name is required" }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea
                rows={4}
                placeholder="Enter a short description (optional)"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ marginTop: "10px" }}
            >
              Create Category
            </Button>
          </Form>
        </Card>

        {/* RIGHT SIDE — Preview */}
        {/* <Card title="Preview" style={{ width: "40%" }}>
          <p>
            <strong>Name:</strong>{" "}
            {form.getFieldValue("name") || "Your category name will appear here"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {form.getFieldValue("description") ||
              "Your category description will appear here"}
          </p>
          <p>
            <strong>Status:</strong> Pending (default)
          </p>
        </Card> */}
      </div>
    </div>
  );
}

export default AddCategory;
