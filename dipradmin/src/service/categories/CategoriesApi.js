const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};
