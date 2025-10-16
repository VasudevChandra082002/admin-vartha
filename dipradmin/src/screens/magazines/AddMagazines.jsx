// import { useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   message,
//   Upload,
//   Card,
//   Modal,
//   Tag,
//   Select,
// } from "antd";
// import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// import { createMagazine } from "../../service/Magazine/MagazineService";
// import { useNavigate } from "react-router-dom";

// import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

// const { TextArea } = Input;
// const { Option } = Select;
// const { confirm } = Modal;

// function AddMagazinePage() {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [pdfUploading, setPdfUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");
//   const userRole = localStorage.getItem("role");

//   // Month options
//   const monthOptions = [
//     { value: "January", label: "January" },
//     { value: "February", label: "February" },
//     { value: "March", label: "March" },
//     { value: "April", label: "April" },
//     { value: "May", label: "May" },
//     { value: "June", label: "June" },
//     { value: "July", label: "July" },
//     { value: "August", label: "August" },
//     { value: "September", label: "September" },
//     { value: "October", label: "October" },
//     { value: "November", label: "November" },
//     { value: "December", label: "December" },
//   ];

//   const handleFormSubmit = async (values) => {
//     if (!imageUrl || !pdfUrl) {
//       message.error("Please upload both an image and a PDF before submitting.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         title: values.title,
//         description: values.description,
//         magazineThumbnail: imageUrl,
//         magazinePdf: pdfUrl,
//         editionNumber: values.editionNumber.toString(),
//         publishedMonth: values.publishedMonth,
//         publishedYear: values.publishedYear.toString(),
//       };

//       const response = await createMagazine(payload);

//       if (!response) {
//         throw new Error("No response from server");
//       }

//       if (response.success) {
//         if (userRole === "moderator") {
//           showModeratorSuccess();
//         } else {
//           message.success("Magazine published successfully!");
//           resetForm();
//           navigate("/manage-varthajanapada");
//         }
//       } else {
//         throw new Error(
//           response.message || response.error || "Failed to add magazine"
//         );
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     form.resetFields();
//     setImageUrl("");
//     setPdfUrl("");
//   };

//   const showModeratorSuccess = () => {
//     confirm({
//       title: "Magazine Submitted for Approval",
//       icon: <ExclamationCircleOutlined />,
//       content:
//         "Your magazine has been submitted and is pending admin approval.",
//       okText: "OK",
//       onOk() {
//         resetForm();
//         navigate("/manage-varthajanapada");
//       },
//     });
//   };

//   // ✅ Updated: Upload image to Azure container "varthajanapada"
//   const handleImageUpload = async ({ file }) => {
//     if (!file.type.startsWith("image/")) {
//       message.error("You can only upload image files!");
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       message.error("Image must be smaller than 5MB!");
//       return false;
//     }

//     setImageUploading(true);
//     try {
//       const response = await uploadFileToAzureStorage(
//         file,
//         "varthajanapada-image"
//       );
//       if (response?.blobUrl) {
//         setImageUrl(response.blobUrl);
//         message.success("Image uploaded successfully!");
//       } else {
//         message.error("Image upload failed.");
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//       message.error("Error uploading image to Azure.");
//     } finally {
//       setImageUploading(false);
//     }
//     return false; // Prevent AntD auto-upload
//   };

//   // ✅ Updated: Upload PDF to Azure container "varthajanapada"
//   // const handlePdfUpload = async ({ file }) => {
//   //   if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
//   //     message.error("You can only upload PDF files!");
//   //     return false;
//   //   }
//   //   // Optional: Add size limit (e.g., 100MB)
//   //   if (file.size > 100 * 1024 * 1024) {
//   //     message.error("PDF must be smaller than 100MB!");
//   //     return false;
//   //   }

//   //   setPdfUploading(true);
//   //   try {
//   //     const response = await uploadFileToAzureStorage(file, "varthajanapada-pdf");
//   //     if (response?.blobUrl) {
//   //       setPdfUrl(response.blobUrl);
//   //       message.success("PDF uploaded successfully!");
//   //     } else {
//   //       message.error("PDF upload failed.");
//   //     }
//   //   } catch (error) {
//   //     console.error("PDF upload error:", error);
//   //     message.error("Error uploading PDF to Azure.");
//   //   } finally {
//   //     setPdfUploading(false);
//   //   }
//   //   return false; // Prevent AntD auto-upload
//   // };

//   // In AddMagazinePage.jsx, replace your current handlePdfUpload with:
//   // In AddMagazinePage.jsx
//   // AddMagazinePage.jsx
//  const handlePdfUpload = async ({ file }) => {
//   if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
//     message.error("You can only upload PDF files!");
//     return false;
//   }
//   if (file.size > 100 * 1024 * 1024) {
//     message.error("PDF must be smaller than 100MB!");
//     return false;
//   }

//   const rawYear = form.getFieldValue("publishedYear");
//   const rawMonth = form.getFieldValue("publishedMonth");

//   // Convert to string and validate
//   const year = String(rawYear).trim();
//   const month = String(rawMonth).trim();

//   if (!year || year.length !== 4 || isNaN(Number(year))) {
//     message.warning("Please enter a valid 4-digit published year.");
//     return false;
//   }
//   if (!month) {
//     message.warning("Please select a published month.");
//     return false;
//   }

//   // Use exact month name as folder (e.g., "January")
//   const prefix = `${year}/${month}/`;
//   console.log("[PDF UPLOAD] Using prefix:", prefix); // 🔍 DEBUG

//   setPdfUploading(true);
//   try {
//     const resp = await uploadFileToAzureStorage(file, "magazine-pdfs", prefix);
//     if (resp?.blobUrl) {
//       setPdfUrl(resp.blobUrl);
//       message.success("PDF uploaded successfully!");
//     } else {
//       message.error("PDF upload failed.");
//     }
//   } catch (e) {
//     console.error("PDF upload error:", e);
//     message.error("Error uploading PDF.");
//   } finally {
//     setPdfUploading(false);
//   }
//   return false;
// };

//   return (
//     <div style={{ padding: "24px", maxWidth: "80vw", margin: "0 auto" }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "24px",
//         }}
//       >
//         <h1>Add Vartha janapada</h1>
//         {userRole === "moderator" && (
//           <Tag color="orange">Requires Admin Approval</Tag>
//         )}
//       </div>

//       <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
//         <Card title="Thumbnail" style={{ flex: 1, minWidth: "300px" }}>
//           <Upload
//             customRequest={handleImageUpload}
//             showUploadList={false}
//             accept="image/*"
//           >
//             <Button icon={<UploadOutlined />} loading={imageUploading} block>
//               {imageUrl ? "Change Thumbnail" : "Upload Thumbnail"}
//             </Button>
//           </Upload>
//           {imageUrl && (
//             <div style={{ marginTop: "16px", textAlign: "center" }}>
//               <img
//                 src={imageUrl}
//                 alt="Preview"
//                 style={{ maxWidth: "100%", maxHeight: "200px" }}
//               />
//             </div>
//           )}
//         </Card>

//         <Card title="Details" style={{ flex: 2, minWidth: "400px" }}>
//           <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//             <Form.Item
//               name="title"
//               label="Title"
//               rules={[{ required: true, message: "Please input the title!" }]}
//             >
//               <Input placeholder="Magazine title  Vartha janapada" />
//             </Form.Item>

//             <Form.Item
//               name="description"
//               label="Description"
//               rules={[
//                 { required: true, message: "Please input the description!" },
//               ]}
//             >
//               <TextArea rows={4} placeholder="Magazine description" />
//             </Form.Item>

//             <Form.Item
//               name="editionNumber"
//               label="Edition Number"
//               rules={[
//                 { required: true, message: "Please input the edition number!" },
//                 { pattern: /^[0-9]+$/, message: "Please input numbers only!" },
//               ]}
//             >
//               <Input placeholder="Edition number" type="number" min={1} />
//             </Form.Item>

//             <Form.Item
//               name="publishedMonth"
//               label="Published Month"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select the published month!",
//                 },
//               ]}
//             >
//               <Select placeholder="Select month" allowClear>
//                 {monthOptions.map((month) => (
//                   <Option key={month.value} value={month.value}>
//                     {month.label}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="publishedYear"
//               label="Published Year"
//               rules={[
//                 { required: true, message: "Please input the published year!" },
//                 {
//                   pattern: /^[0-9]{4}$/,
//                   message: "Please enter a valid 4-digit year!",
//                 },
//               ]}
//             >
//               <Input
//                 placeholder="Enter year (e.g., 2024)"
//                 type="number"
//                 min={1900}
//                 max={2100}
//               />
//             </Form.Item>
//             <Form.Item label="PDF File" required shouldUpdate>
//               {() => {
//                 const hasYear = !!form.getFieldValue("publishedYear");
//                 const hasMonth = !!form.getFieldValue("publishedMonth");
//                 return (
//                   <>
//                     <Upload
//                       customRequest={handlePdfUpload}
//                       showUploadList={false}
//                       accept=".pdf"
//                       disabled={!hasYear || !hasMonth} // <-- prevents early uploads
//                     >
//                       <Button
//                         icon={<UploadOutlined />}
//                         loading={pdfUploading}
//                         block
//                         disabled={!hasYear || !hasMonth}
//                       >
//                         {pdfUrl ? "Change PDF" : "Upload PDF"}
//                       </Button>
//                     </Upload>
//                     {!hasYear || !hasMonth ? (
//                       <div
//                         style={{ marginTop: 8, fontSize: 12, color: "#999" }}
//                       >
//                         Select <strong>Published Year</strong> and{" "}
//                         <strong>Month</strong> first.
//                       </div>
//                     ) : null}
//                     {pdfUrl && (
//                       <div style={{ marginTop: 8 }}>
//                         <a
//                           href={pdfUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           View Uploaded PDF
//                         </a>
//                       </div>
//                     )}
//                   </>
//                 );
//               }}
//             </Form.Item>

//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 block
//                 size="large"
//               >
//                 Add Magazine
//                 {/* {userRole === "admin" ? "Add magazine" : "Submit for Approval"} */}
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default AddMagazinePage;


import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Modal,
  Tag,
  Select,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createMagazine } from "../../service/Magazine/MagazineService";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

function AddMagazinePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const userRole = localStorage.getItem("role");

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Handle submit
  const handleFormSubmit = async (values) => {
    if (!thumbnailFile || !pdfFile) {
      message.error("Please upload both a thumbnail and a PDF file before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        editionNumber: values.editionNumber.toString(),
        publishedMonth: values.publishedMonth,
        publishedYear: values.publishedYear.toString(),
        magazineThumbnail: thumbnailFile, // File object
        magazinePdf: pdfFile, // File object
      };

      const response = await createMagazine(payload);

      if (response?.success) {
        if (userRole === "moderator") {
          confirm({
            title: "Magazine Submitted for Approval",
            icon: <ExclamationCircleOutlined />,
            content: "Your magazine has been submitted and is pending admin approval.",
            okText: "OK",
            onOk() {
              resetForm();
              navigate("/manage-varthajanapada");
            },
          });
        } else {
          message.success("Magazine created successfully!");
          resetForm();
          navigate("/manage-varthajanapada");
        }
      } else {
        throw new Error(response?.message || "Failed to create magazine");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error(error.message || "Error creating magazine.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setThumbnailFile(null);
    setPdfFile(null);
    setThumbnailPreview("");
  };

  // Handle thumbnail select
  const handleThumbnailBeforeUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Please upload an image file!");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Thumbnail must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    return false; // prevent auto-upload
  };

  // Handle PDF select
  const handlePdfBeforeUpload = (file) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      message.error("Please upload a valid PDF file!");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 100 * 1024 * 1024) {
      message.error("PDF must be smaller than 100MB!");
      return Upload.LIST_IGNORE;
    }
    setPdfFile(file);
    return false;
  };

  return (
    <div style={{ padding: "24px", maxWidth: "80vw", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h1>Add Vartha Janapada</h1>
        {userRole === "moderator" && <Tag color="orange">Requires Admin Approval</Tag>}
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Thumbnail Upload Card */}
        <Card title="Thumbnail" style={{ flex: 1, minWidth: "300px" }}>
          <Upload
            beforeUpload={handleThumbnailBeforeUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} block>
              {thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </Upload>

          {thumbnailPreview && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <img
                src={thumbnailPreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
        </Card>

        {/* Form Details Card */}
        <Card title="Details" style={{ flex: 2, minWidth: "400px" }}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input placeholder="Magazine title (e.g. MOK January 2024)" />
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
                { pattern: /^[0-9]+$/, message: "Please input numbers only!" },
              ]}
            >
              <Input placeholder="Edition number" type="number" min={1} />
            </Form.Item>

            <Form.Item
              name="publishedMonth"
              label="Published Month"
              rules={[{ required: true, message: "Please select the published month!" }]}
            >
              <Select placeholder="Select month" allowClear>
                {monthOptions.map((month) => (
                  <Option key={month} value={month}>
                    {month}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="publishedYear"
              label="Published Year"
              rules={[
                { required: true, message: "Please input the published year!" },
                {
                  pattern: /^[0-9]{4}$/,
                  message: "Please enter a valid 4-digit year!",
                },
              ]}
            >
              <Input
                placeholder="Enter year (e.g. 2024)"
                type="number"
                min={1900}
                max={2100}
              />
            </Form.Item>

            <Form.Item label="PDF File" required>
              <Upload
                beforeUpload={handlePdfBeforeUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />} block>
                  {pdfFile ? "Change PDF" : "Upload PDF"}
                </Button>
              </Upload>

              {pdfFile && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "#666" }}>
                    Selected file: <strong>{pdfFile.name}</strong>
                  </span>
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
                {userRole === "admin" ? "Add Magazine" : "Submit for Approval"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AddMagazinePage;
