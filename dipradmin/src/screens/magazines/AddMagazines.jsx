// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   DatePicker,
//   message,
//   Upload,
//   Card,
//   Select,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { createMagazine } from "../../service/Magazine/MagazineService";
// import { useNavigate } from "react-router-dom";
// import { storage } from "../../service/firebaseConfig"; // Import Firebase storage
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { getCategories } from "../../service/categories/CategoriesApi"; // Import Category service

// const { TextArea } = Input;
// const { Option } = Select;

// function AddMagazinePage() {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [pdfUploading, setPdfUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await getCategories();
//       if (response.success) {
//         setCategories(response.data);
//       } else {
//         message.error("Failed to load categories.");
//       }
//     } catch (error) {
//       message.error("Error fetching categories.");
//     }
//   };

//   const handleFormSubmit = async (values) => {
//     setLoading(true);
//     try {
//       if (!imageUrl || !pdfUrl) {
//         message.error(
//           "Please upload both an image and a PDF before submitting."
//         );
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         ...values,
//         magazineThumbnail: imageUrl, 
//         magazinePdf: pdfUrl, 
//         editionNumber: values.editionNumber,
//       };

//       const response = await createMagazine(payload);
//       if (response.success) {
//         message.success("Magazine added successfully!");
//         form.resetFields();
//         setImageUrl("");
//         setPdfUrl("");
//         setSelectedCategory(null);
//         navigate("/manage-magazines1");
//       } else {
//         message.error("Failed to add magazine.");
//       }
//     } catch (error) {
//       message.error("Error adding magazine.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async ({ file }) => {
//     setImageUploading(true);
//     const storageRef = ref(storage, `magazineThumbnails/${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Optional: Progress tracking
//       },
//       (error) => {
//         message.error("Image upload failed!");
//         setImageUploading(false);
//       },
//       async () => {
//         // Get download URL
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         setImageUrl(downloadURL);
//         message.success("Image uploaded successfully!");
//         setImageUploading(false);
//       }
//     );
//   };

//   const handlePdfUpload = async ({ file }) => {
//     setPdfUploading(true);
//     const storageRef = ref(storage, `magazinePdfs/${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Optional: Progress tracking
//       },
//       (error) => {
//         message.error("PDF upload failed!");
//         setPdfUploading(false);
//       },
//       async () => {
//         // Get download URL
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         setPdfUrl(downloadURL);
//         message.success("PDF uploaded successfully!");
//         setPdfUploading(false);
//       }
//     );
//   };

//   return (
//     <div>
//       <h1>Add New Magazine</h1>
//       <div
//         style={{
//           maxWidth: "80vw",
//           margin: "auto",
//           padding: "20px",
//           display: "flex",
//           gap: "20px",
//         }}
//       >
//         {/* LEFT SIDE - Image Upload */}
//         <Card title="Magazine Thumbnail" style={{ width: "40%" }}>
//           <Upload
//             customRequest={handleImageUpload}
//             showUploadList={false}
//             accept="image/*"
//           >
//             <Button icon={<UploadOutlined />} loading={imageUploading}>
//               {imageUploading ? "Uploading..." : "Upload Thumbnail"}
//             </Button>
//           </Upload>

//           {imageUrl && (
//             <img
//               src={imageUrl}
//               alt="Magazine"
//               style={{ width: "100%", marginTop: 10 }}
//             />
//           )}
//         </Card>

//         {/* RIGHT SIDE - General Information */}
//         <Card title="General Information" style={{ width: "60%" }}>
//           <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//             <Form.Item
//               label="Title"
//               name="title"
//               rules={[{ required: true, message: "Title is required" }]}
//             >
//               <Input placeholder="Enter magazine title" />
//             </Form.Item>

//             <Form.Item
//               label="Description"
//               name="description"
//               rules={[{ required: true, message: "Description is required" }]}
//             >
//               <TextArea rows={4} placeholder="Enter magazine description" />
//             </Form.Item>

//             <Form.Item
//               label="Edition Number"
//               name="editionNumber"
//               rules={[
//                 { required: true, message: "Edition number is required" },
//               ]}
//             >
//               <Input placeholder="Enter edition number" />
//             </Form.Item>

//             {/* PDF Upload */}
//             <Form.Item label="Magazine PDF" name="magazinePdf">
//               <Upload
//                 customRequest={handlePdfUpload}
//                 showUploadList={false}
//                 accept=".pdf"
//               >
//                 <Button icon={<UploadOutlined />} loading={pdfUploading}>
//                   {pdfUploading ? "Uploading..." : "Upload PDF"}
//                 </Button>
//               </Upload>

//               {pdfUrl && (
//                 <div style={{ marginTop: 10 }}>
//                   <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
//                     View PDF
//                   </a>
//                 </div>
//               )}
//             </Form.Item>

//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Add Magazine
//             </Button>
//           </Form>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default AddMagazinePage;


import React, { useState } from "react";
import { Form, Input, Button, message, Upload, Card, Modal, Tag } from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { createMagazine } from "../../service/Magazine/MagazineService";
import { useNavigate } from "react-router-dom";
import { storage } from "../../service/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { TextArea } = Input;
const { confirm } = Modal;

function AddMagazinePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const userRole = localStorage.getItem("role");

  const handleFormSubmit = async (values) => {
    if (!imageUrl || !pdfUrl) {
      message.error("Please upload both an image and a PDF before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        magazineThumbnail: imageUrl,
        magazinePdf: pdfUrl,
        editionNumber: values.editionNumber.toString(), // Ensure string format
        // Add other required fields based on your model
      };

      // console.log("Submitting payload:", payload); // Debug log

      const response = await createMagazine(payload);
      
      if (!response) {
        throw new Error("No response from server");
      }

      if (response.success) {
        if (userRole === "moderator") {
          showModeratorSuccess();
        } else {
          message.success("Magazine published successfully!");
          resetForm();
          navigate("/manage-magazines1");
        }
      } else {
        throw new Error(response.message || response.error || "Failed to add magazine");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setImageUrl("");
    setPdfUrl("");
  };

  const showModeratorSuccess = () => {
    confirm({
      title: 'Magazine Submitted for Approval',
      icon: <ExclamationCircleOutlined />,
      content: 'Your magazine has been submitted and is pending admin approval.',
      okText: 'OK',
      onOk() {
        resetForm();
        navigate("/manage-magazines1");
      },
    });
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
      console.error("Image upload error:", error);
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
      console.error("PDF upload error:", error);
      message.error("PDF upload failed!");
    } finally {
      setPdfUploading(false);
    }
  };

  return (
    <div style={{ padding: "24px",   maxWidth: "80vw",margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1>Add New Magazine</h1>
        {userRole === "moderator" && <Tag color="orange">Requires Admin Approval</Tag>}
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <Card title="Thumbnail" style={{ flex: 1, minWidth: "300px" }}>
          <Upload
            customRequest={handleImageUpload}
            showUploadList={false}
            accept="image/*"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) message.error('You can only upload image files!');
              return isImage;
            }}
          >
            <Button icon={<UploadOutlined />} loading={imageUploading} block>
              {imageUrl ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </Upload>
          {imageUrl && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <img 
                src={imageUrl} 
                alt="Preview" 
                style={{ maxWidth: "100%", maxHeight: "200px" }} 
              />
            </div>
          )}
        </Card>

        <Card title="Details" style={{ flex: 2, minWidth: "400px" }}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input placeholder="Magazine title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please input the description!" }]}
            >
              <TextArea rows={4} placeholder="Magazine description" />
            </Form.Item>

            <Form.Item
              name="editionNumber"
              label="Edition Number"
              rules={[
                { required: true, message: "Please input the edition number!" },
                { pattern: /^[0-9]+$/, message: "Please input numbers only!" }
              ]}
            >
              <Input placeholder="Edition number" type="number" min={1} />
            </Form.Item>

            <Form.Item label="PDF File" required>
              <Upload
                customRequest={handlePdfUpload}
                showUploadList={false}
                accept=".pdf"
                beforeUpload={(file) => {
                  const isPdf = file.type === "application/pdf";
                  if (!isPdf) message.error("You can only upload PDF files!");
                  return isPdf;
                }}
              >
                <Button icon={<UploadOutlined />} loading={pdfUploading} block>
                  {pdfUrl ? "Change PDF" : "Upload PDF"}
                </Button>
              </Upload>
              {pdfUrl && (
                <div style={{ marginTop: "8px" }}>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    View Uploaded PDF
                  </a>
                </div>
              )}
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                {userRole === "admin" ? "Publish Now" : "Submit for Approval"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AddMagazinePage;