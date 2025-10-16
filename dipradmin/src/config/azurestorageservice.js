import api from "../config/axiosConfig";


export const uploadFileToAzureStorage = async (file, containerName = "photos", prefix = "") => {
  const formData = new FormData();
  formData.append("file", file);                 // field name must be 'file'
  formData.append("containerName", containerName); // dynamic container
  if (prefix) formData.append("prefix", prefix);   // optional: e.g., "1970/"

  const res = await api.post("/api/photos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


export const uploadVideoToAzureStorage = async (file, containerName = "photos") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("containerName", containerName);

  try {
    const response = await api.post("/api/photos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const pct = Math.round((e.loaded * 100) / (e.total || 1));
        console.log(`Video upload progress: ${pct}%`);
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading video to Azure Storage:", error);
    throw error;
  }
};
