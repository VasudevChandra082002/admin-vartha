import React, { useState, useEffect } from "react";
import { 
  Form,
  Input,
  Button,
  Card,
  Upload,
  message,
  Typography,
  Select
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getBannerById, updateBannerById } from "../../service/Banner/BannersService";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;
const { Title } = Typography;

function EditBannerPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [bannerData, setBannerData] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      const response = await getBannerById(id);
      if (response) {
        setBannerData(response);
        setOriginalImageUrl(response.bannerImage);
        setImageUrl(response.bannerImage);
        form.setFieldsValue({
          title: response.title,
          description: response.description,
          status: response.status
        });
        
      } else {
        message.error("Failed to load banner");
        navigate("/manage-banners");
      }
    } catch (error) {
      message.error("Error loading banner");
      console.error("Error loading banner:", error);
      navigate("/manage-banners");
    }
  };

  const handleUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `banners/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress tracking if needed
      },
      (error) => {
        message.error("Image upload failed!");
        setImageUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        message.success("Image uploaded successfully!");
        setImageUploading(false);
      }
    );
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    
    try {
      if (!imageUrl) {
        message.error("Please upload an image before submitting.");
        setLoading(false);
        return;
      }

      const updatedData = {
        title: values.title,
        description: values.description,
        bannerImage: imageUrl,
        // Include status only if admin is editing
        ...(role === "admin" && { status: values.status })
      };

      const response = await updateBannerById(id, updatedData);
      if (response && response.success) {
        // Frontend success message
        message.success("Banner updated successfully!");
        navigate("/manage-banners");
      } else {
        // Frontend error message for API failure
        message.error(response?.message || "Failed to update banner");
      }
    } catch (error) {
      message.error(error.message || "Error updating banner");
      console.error("Error updating banner:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Edit Banner</Title>
      <div
        style={{
          maxWidth: "80vw",
          margin: "auto",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE - Image Upload */}
        <Card title="Banner Image" style={{ width: "40%" }}>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={imageUploading}>
              {imageUploading ? "Uploading..." : "Upload New Image"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Banner"
              style={{ width: "100%", marginTop: 10 }}
            />
          )}
        </Card>

        {/* RIGHT SIDE - Banner Details */}
        <Card title="Banner Details" style={{ width: "60%" }}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter banner title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Enter banner description" />
            </Form.Item>

            {role === "admin" && (
              <Form.Item
                label="Status"
                name="status"
              >
                <Select>
                  <Select.Option value="approved">Approved</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="rejected">Rejected</Select.Option>
                </Select>
              </Form.Item>
            )}

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading || imageUploading}
            >
              Update Banner
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default EditBannerPage;