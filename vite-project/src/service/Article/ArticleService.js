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
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },  
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const createArticle = async (articleData) => {
  try {
    const response = await fetch(`http:localhost:7000/api/news/createNews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleData),
    });
    return await response.json();
  } catch (error) {
    message.error("Error updating article.");
    throw error;
  }
};
