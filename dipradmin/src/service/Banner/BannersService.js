const BASE_URL = import.meta.env.VITE_BASE_URL;
export const getBanners = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/banner`, {
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
export const createBanner = async (bannerData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found. Please log in again.");
    }

    const response = await fetch(`${BASE_URL}/api/banner/createBanner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Proper authorization
      },
      body: JSON.stringify(bannerData),
    });

    const result = await response.json();

    if (response.status === 201) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to create banner.");
    }
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};

export const approveBanner = async (data) => {
  try {
    const { id, createdBy } = data;
    const response = await fetch(`${BASE_URL}/api/banner/approveBanner/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ createdBy }) // Include createdBy in the request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Full error approving banner:", error);
    throw error;
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/banner/deleteBanner/${bannerId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
       },
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};


export const updateBannerById = async (bannerId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/banner/updateBanner/${bannerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
       },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};


export const getBannerById = async (bannerId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/banner/getBannerById/${bannerId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};