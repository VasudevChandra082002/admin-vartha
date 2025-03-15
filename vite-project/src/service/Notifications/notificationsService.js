const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllNotifications = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/`, {
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

export const createNotification = async (data) => {
  try {
    const response = await fetch(
      `${BASE_URL}/notifications/createNotification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
