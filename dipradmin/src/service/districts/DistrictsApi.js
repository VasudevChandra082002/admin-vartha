const LLM_URL = import.meta.env.VITE_LLM_API_URL;

export const getDistricts = async () => {
  try {
    const response = await fetch(`${LLM_URL}/api/districts/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading districts:", error);
    throw error;
  }
};
