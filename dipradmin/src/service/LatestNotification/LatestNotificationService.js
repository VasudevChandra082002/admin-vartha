import { message } from "antd";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const LLM_URL = import.meta.env.VITE_LLM_API_URL;

export const createLatestNotification = async (notificationData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/latestnotifications/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating latest notification:", error);
    throw error;
  }
};

export const getLatestNotifications = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/latestnotifications/getAlllatestNotification`, {
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

export const deleteLatestNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${BASE_URL}/api/latestnotifications/deletelatestNotification/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting latest notification:", error);
    message.error(error.message || "Failed to delete latest notification");
    throw error;
  }
};

export const getNotificationById = async(id) =>
{
    try {
        const response = await fetch(`${BASE_URL}/api/latestnotifications/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting notification by ID:", error);
        throw error;
    }
}