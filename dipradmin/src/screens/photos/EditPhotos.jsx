import React, { useState, useEffect } from "react";
import { Button, Card, Upload, message, Input, Form, Typography, Spin, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";
import { getPhotosById, updatePhotos } from "../../service/Photos/photosService";
import { getPhotoCategories } from "../../service/photoCategory/PhotoCategoryApi";

const { Title, Text } = Typography;
const { Option } = Select;

function EditPhotos() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { photoId } = useParams();

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [photoCategories, setPhotoCategories] = useState([]);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setFetching(true);
        const response = await getPhotosById(photoId);
        console.log("Photo response:", response); // Debug log
        
        let photo = null;
        
        // Handle different response structures
        if (response?.success && response?.data) {
          photo = response.data;
        } else if (response?.data) {
          photo = response.data;
        } else if (response && !response.success) {
          // Response might be the photo object directly
          photo = response;
        } else {
          message.error("Failed to load photo details.");
          setFetching(false);
          return;
        }
        
        if (photo) {
          // Extract category ID if it's an object
          const categoryId = photo.category 
            ? (typeof photo.category === 'object' && photo.category?.$oid 
                ? photo.category.$oid 
                : photo.category)
            : undefined;
          
          form.setFieldsValue({
            title: photo.title || "",
            category: categoryId,
          });
          setImageUrl(photo.photoImage || "");
        } else {
          message.error("Photo data not found in response.");
        }
      } catch (error) {
        console.error("Error fetching photo:", error);
        message.error("Error fetching photo details: " + (error.message || "Unknown error"));
      } finally {
        setFetching(false);
      }
    };

    if (photoId) {
      fetchPhoto();
    }
  }, [photoId, form]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPhotoCategories();
        if (response?.success && response?.data?.photo_categories && Array.isArray(response.data.photo_categories)) {
          setPhotoCategories(response.data.photo_categories);
        } else {
          message.error("Failed to load photo categories.");
        }
      } catch (error) {
        console.error("Error fetching photo categories:", error);
        message.error("Error fetching photo categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleUpload = async ({ file }) => {
    if (!file.type?.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setUploading(true);
    try {
      const response = await uploadFileToAzureStorage(file, "photos");
      if (response?.blobUrl) {
        setImageUrl(response.blobUrl);
        message.success("Image uploaded to Azure successfully!");
      } else {
        message.error("Failed to upload image to Azure!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Error uploading image to Azure.");
    } finally {
      setUploading(false);
    }
    return false; // prevent AntD auto-upload
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const payload = {
        title: values.title,
        category: values.category, // photo category ID
      };

      // Only include photoImage if a new image was uploaded
      if (imageUrl) {
        payload.photoImage = imageUrl;
      }

      const response = await updatePhotos(photoId, payload);

      if (response?.success) {
        message.success("Photo updated successfully!");
        navigate("/manage-photos");
      } else {
        message.error(response?.message || "Failed to update photo.");
      }
    } catch (err) {
      console.error("Error updating photo:", err);
      message.error("Error updating photo.");
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    // Don't reset imageUrl on reset, keep the current image
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
        <Title level={4} style={{ marginBottom: 4 }}>
          Edit Photo
        </Title>
        <Text type="secondary">Update the photo title and image.</Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Title is required" },
              { max: 120, message: "Title must be 120 characters or less" },
            ]}
          >
            <Input placeholder="Enter a title for this photo" />
          </Form.Item>

          <Form.Item
            label="Photo Category"
            name="category"
          >
            <Select placeholder="Select photo category">
              {photoCategories.map((category) => {
                const categoryId = typeof category._id === 'object' && category._id?.$oid 
                  ? category._id.$oid 
                  : category._id;
                return (
                  <Option key={categoryId} value={categoryId}>
                    {category.category_name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* Preview Box */}
          <div
            style={{
              width: "100%",
              height: 280,
              border: "1px dashed #d9d9d9",
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginBottom: 12,
              background: "#fafafa",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded preview"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <Text type="secondary">No image uploaded</Text>
            )}
          </div>

          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
            disabled={uploading || saving}
          >
            <Button
              icon={<UploadOutlined />}
              block
              loading={uploading}
              style={{ marginBottom: 16 }}
            >
              {uploading ? "Uploading..." : imageUrl ? "Change Image" : "Upload Image"}
            </Button>
          </Upload>

          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={uploading}
              loading={saving}
              style={{ flex: 1 }}
            >
              {saving ? "Updating..." : "Update Photo"}
            </Button>
            <Button onClick={onReset} block disabled={uploading || saving} style={{ flex: 1 }}>
              Reset
            </Button>
            <Button
              onClick={() => navigate("/manage-photos")}
              block
              disabled={uploading || saving}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default EditPhotos;
