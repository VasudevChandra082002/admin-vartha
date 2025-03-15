const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

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
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/${videoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`${VITE_BASE_URL}/api/longVideo/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videoData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
};
