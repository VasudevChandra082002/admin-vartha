const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getArticles = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/news`, {
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

export const deleteArticle = async (articleId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`

       },  
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const createArticle = async (articleData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/news/createNews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });
    return await response.json();
  } catch (error) {
    message.error("Error creating article.");
    throw error;
  }
};

export const getArticleById = async (articleId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
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


export const updateArticle = async (articleId, articleData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });
    return await response.json();
  } catch (error) {
    message.error("Error updating article.");
    throw error;
  }
};


export const approveNews = async (articleId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/news/approveNews/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    });
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-undef
    message.error("Error approving article.");
    throw error;
  }
};

export const getHistoryById = async (articleId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/news/getNewsHistory/${articleId}`, {
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

export const revertNewsByVersionNumber = async (articleId, currentVersion) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/news/revertNews/${articleId}/revert/${currentVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error reverting and deleting:", error);
    throw error;
  }
};


export const deleteVersion = async (articleId, versionNumber) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/news/deleteVersion/${articleId}/delete/${versionNumber}`,
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
