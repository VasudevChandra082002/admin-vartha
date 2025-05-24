const BASE_URL = import.meta.env.VITE_BASE_URL;
export const getAllComments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/comments`, {
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

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};
