const LLM_URL = import.meta.env.VITE_LLM_API_URL;

export const getPhotoCategories = async () => {
  try {
    const response = await fetch(`${LLM_URL}/api/photo-category/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading photo categories:", error);
    throw error;
  }
};

export const getPhotoCategoryById = async (id) => {
  try {
    const response = await fetch(`${LLM_URL}/api/photo-category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading photo category:", error);
    throw error;
  }
};

export const createPhotoCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/photo-category/create`, {
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
    console.error("Error creating photo category:", error);
    throw error;
  }
};

export const deletePhotoCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/photo-category/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting photo category:", error);
    throw error;
  }
};

export const updatePhotoCategory = async (id, categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/photo-category/${id}`, {
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
    console.error("Error updating photo category:", error);
    throw error;
  }
};
