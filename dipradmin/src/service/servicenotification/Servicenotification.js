const LLM_URL = import.meta.env.VITE_LLM_API_URL;

// Create New Article
export const createNewArticle = async(data) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${LLM_URL}/api/newarticles/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating new article:", error);
        throw error;
    }
}

// List New Articles with pagination
export const listNewArticles = async(page = 1, page_size = 20) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${LLM_URL}/api/newarticles/list?page=${page}&page_size=${page_size}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error listing new articles:", error);
        throw error;
    }
}

// Get New Article by ID
export const getNewArticleById = async(newarticle_id) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${LLM_URL}/api/newarticles/${newarticle_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting new article by ID:", error);
        throw error;
    }
}

// Update New Article
export const updateNewArticle = async(newarticle_id, data) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${LLM_URL}/api/newarticles/${newarticle_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating new article:", error);
        throw error;
    }
}

// Delete New Article
export const deleteNewArticle = async(newarticle_id) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${LLM_URL}/api/newarticles/${newarticle_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting new article:", error);
        throw error;
    }
}

