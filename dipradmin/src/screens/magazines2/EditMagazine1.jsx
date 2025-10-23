// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   message,
//   Upload,
//   Card,
//   Select,
//   Space,
//   Spin,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import {
//   updateMagazine1,
//   getMagazineBydid1,
//   revertMagazine1ByversionNumber,
//   getMagazineHistory1ById,
// } from "../../service/Magazine/MagazineService";
// import { storage } from "../../service/firebaseConfig";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { getCategories } from "../../service/categories/CategoriesApi";
// import { uploadFileToAzureStorage } from "../../config/azurestorageservice";

// const { TextArea } = Input;
// const { Option } = Select;

// function UpdateMagazinePage1() {
//   const { magazineId } = useParams();
//   const [searchParams] = useSearchParams();
//   const versionNumber = searchParams.get("version");

//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [pdfUploading, setPdfUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [initialValues, setInitialValues] = useState({});
//   const [fetching, setFetching] = useState(true);
//   const [versionHistory, setVersionHistory] = useState([]);
//   const [previousVersion, setPreviousVersion] = useState(null);

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

//   useEffect(() => {
//     fetchCategories();
//     fetchMagazineDetails();
//   }, [magazineId]);

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

//   const fetchMagazineDetails = async () => {
//     try {
//       const response = await getMagazineBydid1(magazineId);
//       if (response.success && response.data) {
//         const magazine = response.data;
//         setInitialValues({
//           title: magazine.title || "",
//           description: magazine.description || "",
//           editionNumber: magazine.editionNumber || "",
//           publishedMonth: magazine.publishedMonth || "",
//           publishedYear: magazine.publishedYear || "",
//         });
//         setImageUrl(magazine.magazineThumbnail);
//         setPdfUrl(magazine.magazinePdf);
//         setSelectedCategory(magazine.category);
//         form.setFieldsValue({
//           title: magazine.title,
//           description: magazine.description,
//           editionNumber: magazine.editionNumber,
//           publishedMonth: magazine.publishedMonth,
//           publishedYear: magazine.publishedYear,
//         });
//       } else {
//         message.error("Magazine not found.");
//       }
//     } catch (error) {
//       message.error("Error fetching magazine details.");
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await getMagazineHistory1ById(magazineId);
//         if (res.success) {
//           const sorted = res.data.sort(
//             (a, b) => b.versionNumber - a.versionNumber
//           );
//           setVersionHistory(sorted);

//           if (versionNumber) {
//             const current = parseInt(versionNumber);
//             const prev = sorted.find((v) => v.versionNumber === current - 1);
//             if (prev) setPreviousVersion(prev.versionNumber);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching magazine history", err);
//       }
//     };

//     if (versionNumber) fetchHistory();
//   }, [versionNumber, magazineId]);

//   const handleFormSubmit = async (values) => {
//     setLoading(true);
//     try {
//       if (!imageUrl || !pdfUrl) {
//         message.error("Please upload both an image and a PDF.");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         ...values,
//         magazineThumbnail: imageUrl,
//         magazinePdf: pdfUrl,
//         editionNumber: values.editionNumber,
//         publishedMonth: values.publishedMonth,
//         publishedYear: values.publishedYear.toString(),
//       };

//       const response = await updateMagazine1(magazineId, payload);
//       if (response.success) {
//         message.success("Magazine updated successfully!");
//         navigate("/manage-varthajanapada");
//       } else {
//         message.error("Failed to update magazine.");
//       }
//     } catch (error) {
//       message.error("Error updating magazine.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Azure: image upload → container "varthajanapada-image"
//   const handleImageUpload = async ({ file }) => {
//     if (!file.type?.startsWith("image/")) {
//       message.error("You can only upload image files!");
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       message.error("Image must be smaller than 5MB!");
//       return false;
//     }

//     setImageUploading(true);
//     try {
//       const res = await uploadFileToAzureStorage(file, "varthajanapada-image");
//       if (res?.blobUrl) {
//         setImageUrl(res.blobUrl);
//         message.success("Image uploaded successfully!");
//       } else {
//         message.error("Image upload failed.");
//       }
//     } catch (err) {
//       console.error("Azure image upload error:", err);
//       message.error("Error uploading image to Azure.");
//     } finally {
//       setImageUploading(false);
//     }

//     return false; // prevent AntD default upload
//   };

//   // ✅ Azure: PDF upload → container "varthajanapada-pdf"
//   const handlePdfUpload = async ({ file }) => {
//     const isPdf =
//       file.type === "application/pdf" ||
//       file.name?.toLowerCase().endsWith(".pdf");
//     if (!isPdf) {
//       message.error("You can only upload PDF files!");
//       return false;
//     }
//     // Optional: 100MB cap
//     if (file.size > 100 * 1024 * 1024) {
//       message.error("PDF must be smaller than 100MB!");
//       return false;
//     }

//     setPdfUploading(true);
//     try {
//       const res = await uploadFileToAzureStorage(file, "varthajanapada-pdf");
//       if (res?.blobUrl) {
//         setPdfUrl(res.blobUrl);
//         message.success("PDF uploaded successfully!");
//       } else {
//         message.error("PDF upload failed.");
//       }
//     } catch (err) {
//       console.error("Azure PDF upload error:", err);
//       message.error("Error uploading PDF to Azure.");
//     } finally {
//       setPdfUploading(false);
//     }

//     return false; // prevent AntD default upload
//   };

//   const handleRevert = async () => {
//     const current = parseInt(versionNumber);
//     if (!previousVersion || !current) {
//       message.error("Invalid version to revert.");
//       return;
//     }

//     try {
//       const res = await revertMagazine1ByversionNumber(magazineId, current);
//       if (res.success) {
//         message.success(`Successfully reverted to version ${previousVersion}`);
//         navigate("/manage-varthajanapada");
//       } else {
//         message.error(res.message || "Failed to revert version.");
//       }
//     } catch (err) {
//       message.error("Unexpected error while reverting.");
//     }
//   };

//   if (fetching) {
//     return <Spin size="large" style={{ marginTop: 100 }} />;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <div style={{ display: "flex", gap: "20px" }}>
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

//         <Card title="General Information" style={{ width: "60%" }}>
//           {previousVersion && (
//             <Button
//               type="dashed"
//               danger
//               onClick={handleRevert}
//               style={{ marginBottom: "20px" }}
//             >
//               Revert to Version {previousVersion}
//             </Button>
//           )}
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={handleFormSubmit}
//             initialValues={initialValues}
//           >
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

//             {/* Published Month Field */}
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

//             {/* Published Year Field */}
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

//             <Form.Item label="Magazine PDF">
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

//             <Button type="primary" htmlType="submit" block 
//             loading={loading}
//               disabled={imageUploading || pdfUploading}
//             >
//               Update Magazine
//             </Button>
//           </Form>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default UpdateMagazinePage1;


import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Select,
  Space,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateMagazine1,
  getMagazineBydid1,
  revertMagazine1ByversionNumber,
  getMagazineHistory1ById,
} from "../../service/Magazine/MagazineService";

const { TextArea } = Input;
const { Option } = Select;

function UpdateMagazinePage1() {
  const { magazineId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [fetching, setFetching] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    fetchMagazineDetails();
  }, [magazineId]);

  const fetchMagazineDetails = async () => {
    try {
      const response = await getMagazineBydid1(magazineId);
      if (response.success && response.data) {
        const magazine = response.data;
        form.setFieldsValue({
          title: magazine.title,
          description: magazine.description,
          editionNumber: magazine.editionNumber,
          publishedMonth: magazine.publishedMonth,
          publishedYear: magazine.publishedYear,
        });
        setThumbnailPreview(magazine.magazineThumbnail);
        setInitialValues(magazine);
      } else {
        message.error("Magazine not found.");
      }
    } catch (error) {
      message.error("Error fetching magazine details.");
    } finally {
      setFetching(false);
    }
  };

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
    return false;
  };

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

  const handleFormSubmit = async (values) => {
    if (!thumbnailFile && !initialValues.magazineThumbnail) {
      message.error("Please upload a thumbnail image!");
      return;
    }
    if (!pdfFile && !initialValues.magazinePdf) {
      message.error("Please upload a PDF file!");
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
        magazineThumbnail: thumbnailFile || initialValues.magazineThumbnail,
        magazinePdf: pdfFile || initialValues.magazinePdf,
      };

      const response = await updateMagazine1(magazineId, payload);
      if (response.success) {
        message.success("Magazine updated successfully!");
        navigate("/manage-varthajanapada");
      } else {
        throw new Error(response?.message || "Failed to update magazine");
      }
    } catch (error) {
      console.error("Error updating magazine:", error);
      message.error(error.message || "Error updating magazine.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Spin size="large" style={{ marginTop: 100 }} />;
  }

  const monthOptions = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <Card title="Magazine Thumbnail" style={{ width: "40%" }}>
          <Upload
            beforeUpload={handleThumbnailBeforeUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              {thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </Upload>

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Preview"
              style={{ width: "100%", marginTop: 10, borderRadius: "8px" }}
            />
          )}
        </Card>

        <Card title="General Information" style={{ width: "60%" }}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Edition Number"
              name="editionNumber"
              rules={[{ required: true, message: "Edition number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="publishedMonth"
              label="Published Month"
              rules={[{ required: true, message: "Please select the month" }]}
            >
              <Select placeholder="Select month">
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
                { required: true, message: "Please enter the year!" },
                { pattern: /^[0-9]{4}$/, message: "Enter valid 4-digit year" },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item label="PDF File">
              <Upload
                beforeUpload={handlePdfBeforeUpload}
                showUploadList={false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>
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

            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Magazine
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default UpdateMagazinePage1;
