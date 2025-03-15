import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Select,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  updateMagazine,
  getMagazineBydid,
} from "../../service/Magazine/MagazineService2";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../service/firebaseConfig"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi"; // Import Category service

const { TextArea } = Input;
const { Option } = Select;

function UpdateMagazinePage2() {
  const { magazineId } = useParams(); // Get the magazine ID from the route params
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchMagazineDetails();
  }, [magazineId]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        message.error("Failed to load categories.");
      }
    } catch (error) {
      message.error("Error fetching categories.");
    }
  };

  const fetchMagazineDetails = async () => {
    try {
      const response = await getMagazineBydid(magazineId); // Use getMagazineBydid to fetch the magazine by its ID
      if (response.success && response.data) {
        const magazine = response.data;
        setInitialValues({
          title: magazine.title || "", // Making fields optional by default
          description: magazine.description || "",
          editionNumber: magazine.editionNumber || "",
        });
        setImageUrl(magazine.magazineThumbnail);
        setPdfUrl(magazine.magazinePdf);
        setSelectedCategory(magazine.category);
      } else {
        message.error("Magazine not found.");
      }
    } catch (error) {
      message.error("Error fetching magazine details.");
      console.error("Error fetching magazine details:", error.message);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (!imageUrl || !pdfUrl) {
        message.error(
          "Please upload both an image and a PDF before submitting."
        );
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        magazineThumbnail: imageUrl, // Firebase Image URL
        magazinePdf: pdfUrl, // Firebase PDF URL
        editionNumber: values.editionNumber,
      };

      const response = await updateMagazine(magazineId, payload);
      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-magazine");
      } else {
        message.error("Failed to update magazine.");
      }
    } catch (error) {
      message.error("Error updating magazine.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async ({ file }) => {
    setImageUploading(true);
    const storageRef = ref(storage, `magazineThumbnails/${file.name}`);
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
        setImageUrl(downloadURL);
        message.success("Image uploaded successfully!");
        setImageUploading(false);
      }
    );
  };

  const handlePdfUpload = async ({ file }) => {
    setPdfUploading(true);
    const storageRef = ref(storage, `magazinePdfs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Progress tracking
      },
      (error) => {
        message.error("PDF upload failed!");
        setPdfUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setPdfUrl(downloadURL);
        message.success("PDF uploaded successfully!");
        setPdfUploading(false);
      }
    );
  };

  if (!initialValues.title) {
    return <div>Loading...</div>; // Show a loading state until initialValues are set
  }

  return (
    <div>
      <h1>Update Magazine</h1>
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
        <Card title="Magazine Thumbnail" style={{ width: "40%" }}>
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={imageUploading}>
              {imageUploading ? "Uploading..." : "Upload Thumbnail"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Magazine"
              style={{ width: "100%", marginTop: 10 }}
            />
          )}
        </Card>

        {/* RIGHT SIDE - General Information */}
        <Card title="General Information" style={{ width: "60%" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={initialValues} // Use initialValues to pre-populate fields
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: false, message: "Title is required" }]} // Make title optional
            >
              <Input placeholder="Enter magazine title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: false, message: "Description is required" }]} // Make description optional
            >
              <TextArea rows={4} placeholder="Enter magazine description" />
            </Form.Item>

            <Form.Item
              label="Edition Number"
              name="editionNumber"
              rules={[
                { required: false, message: "Edition number is required" },
              ]} // Make editionNumber optional
            >
              <Input placeholder="Enter edition number" />
            </Form.Item>

            {/* PDF Upload */}
            <Form.Item label="Magazine PDF" name="magazinePdf">
              <Upload
                customRequest={handlePdfUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />} loading={pdfUploading}>
                  {pdfUploading ? "Uploading..." : "Upload PDF"}
                </Button>
              </Upload>

              {pdfUrl && (
                <div style={{ marginTop: 10 }}>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </div>
              )}
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Magazine
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default UpdateMagazinePage2;
