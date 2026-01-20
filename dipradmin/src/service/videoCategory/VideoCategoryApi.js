const LLM_URL = import.meta.env.VITE_LLM_API_URL;

export const getVideoCategories = async () => {
  try {
    const response = await fetch(`${LLM_URL}/api/video-category/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading video categories:", error);
    throw error;
  }
};

export const getVideoCategoryById = async (id) => {
  try {
    const response = await fetch(`${LLM_URL}/api/video-category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading video category:", error);
    throw error;
  }
};

export const createVideoCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/video-category/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating video category:", error);
    throw error;
  }
};

export const deleteVideoCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/video-category/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting video category:", error);
    throw error;
  }
};

export const updateVideoCategory = async (id, categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/video-category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating video category:", error);
    throw error;
  }
};
