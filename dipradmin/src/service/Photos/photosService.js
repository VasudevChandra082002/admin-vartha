const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createPhotos = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/photos/createphotos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data), // { photoImage: "<blobUrl>" }
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating photo:", error);
    throw error;
  }
};


export const getAllPhotos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/photos/getAllPhotos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error getting photos:", error);
    throw error;
  }
};

export const getPhotosById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/photos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error getting photo by ID:", error);
    throw error;
  }
};

export const deletePhotosById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/photos/deletePhotos/${id}`, {
      method: "DELETE",
  
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting photo by ID:", error);
    throw error;
  }
};

export const approvePhotosById = async (data) => {
  try {
    const { id, createdBy } = data;
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/photos/approvePhotos/${id}`, {
      method: "PATCH",
  
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
   
      body: JSON.stringify({ createdBy }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error approving photo by ID:", error);
    throw error;
  }
};
