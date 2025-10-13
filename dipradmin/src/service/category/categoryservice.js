const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/category`, {
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

export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/category/${categoryId}`, {
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

export const addCategory = async (category) => {
  try {
     const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/category/createCategory`, {
     method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Proper authorization
      },
      body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const updateCategory = async (category, categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/category/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const approveCategory = async (categoryId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/category/approveCategory/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },

    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};