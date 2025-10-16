const BASE_URL = import.meta.env.VITE_BASE_URL;
const LLM_URL = import.meta.env.VITE_LLM_API_URL; 

export const getShortVideos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/video`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const deleteById = async (videoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/video/${videoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

export const createVideo = async (videoData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/shortvideos/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify(videoData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
};

export const approveVideo = async (videoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/video/approveVideo/${videoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error approving video:", error);
    throw error;
  }
};


export const getVideoById = async (videoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/video/${videoId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading video:", error);
    throw error;
  }
};

export const updatevideoById = async (videoId, videoData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/shortvideos/${videoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify(videoData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
};

export const getHistoryOfShortVideosById = async (videoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/video/getVideoHistory/${videoId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading history:", error);
    throw error;
  }
}

export const deleteVideoVersionByversionNumber = async (videoId, versionNumber) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/video/deleteVideoVersion/${videoId}/delete/${versionNumber}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting video version:", error);
    throw error;
  }
}

export const revertVideoVersionByversionNumber = async (videoId, versionNumber) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/video/revertVideo/${videoId}/revert/${versionNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reverting video version:", error);
    throw error;
  }
}