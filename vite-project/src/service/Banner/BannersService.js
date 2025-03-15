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
    const response = await fetch(`${BASE_URL}/api/banner/createBanner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bannerData),
    });

    // Ensure the response status is 201 (created)
    if (response.status === 201) {
      return await response.json(); // Return the response body containing the banner
    } else {
      throw new Error("Failed to create banner");
    }
  } catch (error) {
    message.error("Error creating banner.");
    console.error(error); // Log the error for debugging
    throw error;
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/banner/${bannerId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};
