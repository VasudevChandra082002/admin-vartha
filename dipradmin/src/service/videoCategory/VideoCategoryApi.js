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
