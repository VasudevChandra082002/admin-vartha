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

export const getDistrictById = async (id) => {
  try {
    const response = await fetch(`${LLM_URL}/api/districts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading district:", error);
    throw error;
  }
};

export const createDistrict = async (districtData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/districts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(districtData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating district:", error);
    throw error;
  }
};

export const deleteDistrict = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/districts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting district:", error);
    throw error;
  }
};

export const updateDistrict = async (id, districtData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/districts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(districtData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating district:", error);
    throw error;
  }
};
