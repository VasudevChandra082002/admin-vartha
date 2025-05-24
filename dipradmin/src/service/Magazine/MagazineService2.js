const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getMagazines = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine2`, {
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

export const getMagazineBydid = async (magazineId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine2/${magazineId}`, {
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

export const deleteMagazine = async (magazineId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/magazine2/delete/${magazineId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const createMagazine = async (magazineData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(magazineData),
    });
    return await response.json();
  } catch (error) {
    message.error("Error creating article.");
    throw error;
  }
};

export const updateMagazine = async (magazineId, magazineData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/magazine2/update/${magazineId}`,
      {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(magazineData),
      }
    );
    return await response.json();
    
  } catch (error) {
    message.error("Error updating magazine.");
    throw error;
  }
};
