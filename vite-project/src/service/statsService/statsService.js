const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getSessionTime = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sessions/average-time`, {
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

export const getTotalVisitors = async () => {
  try {
    const response = await fetch(`${BASE_URL}/visitors/total`, {
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
