import { message } from "antd";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const LLM_URL = import.meta.env.VITE_LLM_API_URL;
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

    // Build FormData object for multipart upload
    const formData = new FormData();
    formData.append("title", magazineData.title);
    formData.append("description", magazineData.description);
    formData.append("editionNumber", magazineData.editionNumber);
    formData.append("publishedMonth", magazineData.publishedMonth);
    formData.append("publishedYear", magazineData.publishedYear);

    // Append files directly (NOT URLs)
    formData.append("magazineThumbnail", magazineData.magazineThumbnail);
    formData.append("magazinePdf", magazineData.magazinePdf);

    const response = await fetch(`${LLM_URL}/api/magazine2/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // no need for Content-Type manually
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating magazine:", error);
    throw error;
  }
};


export const updateMagazine2 = async (magazineId, magazineData) => {
  try {
    const token = localStorage.getItem("token");

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append("title", magazineData.title);
    formData.append("description", magazineData.description);
    formData.append("editionNumber", magazineData.editionNumber);
    formData.append("publishedMonth", magazineData.publishedMonth);
    formData.append("publishedYear", magazineData.publishedYear);

    // Append files or URLs depending on what’s passed
    if (magazineData.magazineThumbnail instanceof File) {
      formData.append("magazineThumbnail", magazineData.magazineThumbnail);
    } else if (typeof magazineData.magazineThumbnail === "string") {
      formData.append("magazineThumbnailUrl", magazineData.magazineThumbnail);
    }

    if (magazineData.magazinePdf instanceof File) {
      formData.append("magazinePdf", magazineData.magazinePdf);
    } else if (typeof magazineData.magazinePdf === "string") {
      formData.append("magazinePdfUrl", magazineData.magazinePdf);
    }

    const response = await fetch(`${LLM_URL}/api/magazine2/${magazineId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // no need for Content-Type here
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating magazine:", error);
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