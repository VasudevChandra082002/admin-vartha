import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Spin,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  updateMagazine2,
  getMagazineBydid2,
  revertMagazine2ByVersionNumber,
  getMagazineHistoryById,
} from "../../service/Magazine/MagazineService2";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { TextArea } = Input;

function UpdateMagazinePage2() {
  const { magazineId } = useParams();
  const [searchParams] = useSearchParams();
  const versionNumber = searchParams.get("version");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [fetching, setFetching] = useState(true);
  const [previousVersion, setPreviousVersion] = useState(null);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        setFetching(true);
        const response = await getMagazineBydid2(magazineId);

        if (response.success && response.data) {
          const magazine = response.data;
          form.setFieldsValue({
            title: magazine.title,
            description: magazine.description,
            editionNumber: magazine.editionNumber,
          });
          setImageUrl(magazine.magazineThumbnail);
          setPdfUrl(magazine.magazinePdf);
        } else {
          message.error(response.message || "Magazine not found");
          navigate("/manage-magazines2");
        }
      } catch (error) {
        message.error("Error loading magazine data");
        navigate("/manage-magazines2");
      } finally {
        setFetching(false);
      }
    };

    fetchMagazine();
  }, [magazineId, form, navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getMagazineHistoryById(magazineId);
        if (response.success && Array.isArray(response.data)) {
          const sorted = response.data.sort((a, b) => b.versionNumber - a.versionNumber);
          const currentVer = parseInt(versionNumber);
          const prev = sorted.find(v => v.versionNumber === currentVer - 1);
          if (prev) setPreviousVersion(prev.versionNumber);
        }
      } catch (err) {
        console.error("Error fetching version history", err);
      }
    };

    if (versionNumber) {
      fetchHistory();
    }
  }, [versionNumber, magazineId]);

  const handleFormSubmit = async (values) => {
    if (!imageUrl || !pdfUrl) {
      message.error("Please upload both an image and a PDF");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        magazineThumbnail: imageUrl,
        magazinePdf: pdfUrl,
        editionNumber: values.editionNumber,
      };

      const response = await updateMagazine2(magazineId, payload);

      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-magazines1");
      } else {
        throw new Error(response.message || "Failed to update magazine");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async ({ file }) => {
    setImageUploading(true);
    try {
      const storageRef = ref(storage, `magazineThumbnails/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setImageUrl(downloadURL);
      message.success("Image uploaded successfully!");
    } catch (error) {
      message.error("Image upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const handlePdfUpload = async ({ file }) => {
    setPdfUploading(true);
    try {
      const storageRef = ref(storage, `magazinePdfs/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setPdfUrl(downloadURL);
      message.success("PDF uploaded successfully!");
    } catch (error) {
      message.error("PDF upload failed!");
    } finally {
      setPdfUploading(false);
    }
  };

  const handleRevert = async () => {
    const currentVer = parseInt(versionNumber);
    if (!previousVersion || !currentVer) {
      message.error("Invalid version to revert");
      return;
    }

    try {
      const response = await revertMagazine2ByVersionNumber(magazineId, currentVer);
      if (response.success) {
        message.success(`Reverted to version ${previousVersion}`);
        navigate("/manage-magazines1");
      } else {
        message.error(response.message || "Revert failed");
      }
    } catch (err) {
      console.error("Revert error:", err);
      message.error("Unexpected error while reverting");
    }
  };

  if (fetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Update Magazine</h1>

    

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Thumbnail Upload */}
        <Card title="Magazine Thumbnail" style={{ flex: 1, minWidth: "300px" }}>
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={imageUploading} block>
              {imageUrl ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </Upload>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Magazine Thumbnail"
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}
        </Card>

        {/* Magazine Details Form */}
        <Card title="Magazine Details" style={{ flex: 2, minWidth: "400px" }}>
            {previousVersion && (
        <Button
          type="dashed"
          danger
          onClick={handleRevert}
          style={{ marginBottom: "20px" }}
        >
          Revert to Version {previousVersion}
        </Button>
      )}
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Magazine title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={4} placeholder="Magazine description" />
            </Form.Item>

            <Form.Item
              name="editionNumber"
              label="Edition Number"
              rules={[
                { required: true, message: "Please enter edition number" },
                { pattern: /^[0-9]+$/, message: "Numbers only" }
              ]}
            >
              <Input placeholder="Edition number" />
            </Form.Item>

            <Form.Item label="PDF File">
              <Upload
                customRequest={handlePdfUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />} loading={pdfUploading} block>
                  {pdfUrl ? "Change PDF" : "Upload PDF"}
                </Button>
              </Upload>
              {pdfUrl && (
                <div style={{ marginTop: "10px" }}>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </div>
              )}
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Update Magazine
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default UpdateMagazinePage2;
