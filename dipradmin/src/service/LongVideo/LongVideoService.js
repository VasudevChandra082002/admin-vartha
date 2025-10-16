const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const LLM_URL = import.meta.env.VITE_LLM_API_URL; 

export const getShortVideos = async () => {
  try {
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo`, {
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
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/${videoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
    const response = await fetch(`${LLM_URL}/api/longvideos/create`, {
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
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/approveVideo/${videoId}`, {
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

export const updateLongVideoById = async (videoId, videoData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/longvideos/${videoId}`, {
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

export const getVideoById = async (videoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/${videoId}`, {
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

export const getLongVideoHistoryById = async (videoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/longVideoHistory/${videoId}`, {
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

export const revertLongVideoByVersionNumber = async (videoId, versionNumber) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/revertLongVideo/${videoId}/revert/${versionNumber}`, {
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

export const deleteVersionOfLongVideoByVersionNumber = async (videoId, versionNumber) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/deleteLongVideoVersion/${videoId}/delete/${versionNumber}`, {
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