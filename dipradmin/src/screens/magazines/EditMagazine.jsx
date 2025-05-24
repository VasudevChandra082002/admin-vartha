import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Select,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  updateMagazine,
  getMagazineBydid,
} from "../../service/Magazine/MagazineService2";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories } from "../../service/categories/CategoriesApi";

const { TextArea } = Input;
const { Option } = Select;

function UpdateMagazinePage2() {
  const { magazineId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, magazineResponse] = await Promise.all([
          getCategories(),
          getMagazineBydid(magazineId),
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        } else {
          message.error("Failed to load categories.");
        }

        if (magazineResponse.success && magazineResponse.data) {
          const magazine = magazineResponse.data;
          setInitialValues({
            title: magazine.title || "",
            description: magazine.description || "",
            editionNumber: magazine.editionNumber || "",
          });
          setImageUrl(magazine.magazineThumbnail);
          setPdfUrl(magazine.magazinePdf);
          form.setFieldsValue({
            title: magazine.title,
            description: magazine.description,
            editionNumber: magazine.editionNumber,
          });
        } else {
          message.error("Magazine not found.");
          navigate("/manage-magazines2");
        }
      } catch (error) {
        message.error("Error loading data.");
        console.error("Error:", error);
        navigate("/manage-magazines2");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [magazineId, form, navigate]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (!imageUrl || !pdfUrl) {
        message.error("Please upload both an image and a PDF before submitting.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        magazineThumbnail: imageUrl,
        magazinePdf: pdfUrl,
      };

      const response = await updateMagazine(magazineId, payload);
      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-magazines2"); // Match your table component's route
      } else {
        message.error(response.message || "Failed to update magazine.");
      }
    } catch (error) {
      message.error("Error updating magazine.");
      console.error("Update error:", error);
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
      null,
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
      null,
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

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
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
            initialValues={initialValues}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter magazine title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Enter magazine description" />
            </Form.Item>

            <Form.Item
              label="Edition Number"
              name="editionNumber"
              rules={[
                { required: true, message: "Edition number is required" },
              ]}
            >
              <Input placeholder="Enter edition number" />
            </Form.Item>

            {/* PDF Upload */}
            <Form.Item
              label="Magazine PDF"
              name="magazinePdf"
              rules={[{ required: true, message: "PDF is required" }]}
            >
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