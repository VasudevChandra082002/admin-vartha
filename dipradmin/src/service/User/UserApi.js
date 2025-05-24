const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/users`, {
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

export const getNewUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/new-users`, {
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
