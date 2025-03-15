import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Input, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { BannersWrapper } from "./BannersPage.styles";
import BannersTable from "../../components/banners/BannersTable";
import { storage } from "../../service/firebaseConfig"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createBanner } from "../../service/Banner/BannersService"; // Import the createBanner function

function BannersPage() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [imageUploading, setImageUploading] = useState(false); // Image uploading state
  const [imageUrl, setImageUrl] = useState(""); // Store image URL after upload
  const [form] = Form.useForm(); // Form instance

  const handleAddBannerClick = () => {
    setIsModalVisible(true); // Show modal when "Add Banner" is clicked
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close modal
    form.resetFields(); // Reset the form fields
    setImageUrl(""); // Reset the image URL
  };

  const handleImageUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `banners/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Progress tracking
      },
      (error) => {
        message.error("Image upload failed!");
        setImageUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL); // Set the uploaded image URL
        message.success("Image uploaded successfully!");
        setImageUploading(false);
      }
    );
  };
  const handleFormSubmit = async (values) => {
    // Ensure an image is uploaded before submitting
    if (!imageUrl) {
      message.error("Please upload an image before submitting.");
      return;
    }

    const bannerData = {
      title: values.title,
      description: values.description,
      bannerImage: imageUrl, // Set the uploaded image URL
    };

    try {
      // Create the banner by calling the API
      const response = await createBanner(bannerData);

      // Ensure the response has the correct data
      if (response && response._id) {
        message.success("Banner created successfully!");

        // Reset the form, image URL, and close the modal after submission
        form.resetFields();
        setImageUrl(""); // Clear the image URL
        setIsModalVisible(false); // Close the modal

        // Update the banners state with the newly created banner
        setBanners((prevBanners) => [...prevBanners, response]);
      } else {
        // If response does not have _id, show error message
        message.error("Failed to create banner.");
      }
    } catch (error) {
      // Handle any errors during the banner creation process
      //   message.error("Error creating banner.");
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <BannersWrapper>
      <div className="header-section">
        <div className="block-title">Banners</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddBannerClick}
        >
          Add Banner
        </Button>
      </div>

      {/* Modal for Creating Banner */}
      <Modal
        title="Create Banner"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
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
            <Input.TextArea placeholder="Enter banner description" rows={4} />
          </Form.Item>

          <Form.Item
            label="Banner Image"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={imageUploading}>
                {imageUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Upload>

            {imageUrl && (
              <div style={{ marginTop: 10 }}>
                <img src={imageUrl} alt="Banner" style={{ width: "100%" }} />
              </div>
            )}
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={imageUploading}
          >
            Create Banner
          </Button>
        </Form>
      </Modal>

      {/* Banners Table */}
      <div className="block-Table">
        <BannersTable />
      </div>
    </BannersWrapper>
  );
}

export default BannersPage;
