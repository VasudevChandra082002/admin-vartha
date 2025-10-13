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

export const getMagazineBydid2 = async (magazineId) => {
  try {
    // console.log("Api enter");

    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/magazine2/${magazineId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      // More specific error handling
      if (response.status === 404) {
        throw new Error("Magazine not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const deleteMagazine2 = async (magazineId) => {
  try {
    const token = localStorage.getItem("token"); // Get the auth token
    const response = await fetch(
      `${BASE_URL}/api/magazine2/delete/${magazineId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add authorization header
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error deleting magazine:", error);
    throw error;
  }
};
export const createMagazine = async (magazineData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/magazine2`, {
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

export const updateMagazine2 = async (magazineId, magazineData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/api/magazine2/update/${magazineId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(magazineData),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error updating magazine.");
    throw error;
  }
};

export const approveMagazine2 = async (magazineId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/api/magazine2/approveMagazine/${magazineId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error approving article:", error);
    throw error;
  }
};


export const getMagazineHistoryById = async (magazineId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/magazine2/getHistory/${magazineId}`, {
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

export const revertMagazine2ByVersionNumber = async (magazineId, versionNumber) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/magazine2/reverMagazine2/${magazineId}/revert/${versionNumber}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error deleting version:", error);
    throw error;
  }
}

export const deleteVersion2 = async (magazineId, versionNumber) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/magazine2/deleteMagazineVersion2/${magazineId}/delete/${versionNumber}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error deleting version:", error);
    throw error;
  }
};