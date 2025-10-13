const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getMagazines = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine`, {
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

export const getMagazineBydid1 = async (magazineId) => {
  try {
    // console.log("Api enter")
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/magazine/getMagazineById/${magazineId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Response",response);
    
    if (!response.ok) {
      // More specific error handling
      if (response.status === 404) {
        throw new Error("Magazine not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error loading magazine:", error);
    throw error;
  }
};


export const deleteMagazine = async (magazineId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${BASE_URL}/api/magazine/delete/${magazineId}`,
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
    console.error("Error deleting magazine:", error);
    message.error(error.message || "Failed to delete magazine");
    throw error;
  }
};

export const createMagazine = async (magazineData) => {
  try {
         const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/magazine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(magazineData),
    });
    return await response.json();
  } catch (error) {
    message.error("Error creating article.");
    throw error;
  }
};

export const updateMagazine1 = async (magazineId, magazineData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/api/magazine/update/${magazineId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(magazineData),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating magazine:", error);
    throw error;
  }
};


export const approveMagazine = async (magazineId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/magazine/approveMagazine/${magazineId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`

       },
    });
    return await response.json();
  } catch (error) {
    console.error("Error approving article:", error);
    throw error;
  }
};

export const getMagazineHistory1ById = async (magazineId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine/getMagazineHistory/${magazineId}`, {
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
}

export const revertMagazine1ByversionNumber = async (magazineId, versionNumber) => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine/revertmagazine/${magazineId}/revert/${versionNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting version:", error);
    throw error;
  }
}


export const deleteVersion1 = async (magazineId, versionNumber) => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine/deleteMagazine1Version/${magazineId}/delete/${versionNumber}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting version:", error);
    throw error;
  }
};