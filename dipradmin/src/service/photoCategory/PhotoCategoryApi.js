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
