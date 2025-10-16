const BASE_URL = import.meta.env.VITE_BASE_URL;
const LLM_URL = import.meta.env.VITE_LLM_API_URL;

export const createStatic = async(data) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${LLM_URL}/api/staticpages/create`, {
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
        console.error("Error creating static:", error);
        throw error;
    }
}

export const getAllStatic = async() =>
{
    try {
        const response = await fetch(`${BASE_URL}/api/static/getAllStaticPage`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting static:", error);
        throw error;
    }
}

export const getStaticById = async(id) =>
{
    try {
        const response = await fetch(`${BASE_URL}/api/static/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting static by ID:", error);
        throw error;
    }
}

export const deleteStaticById = async(id) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/static/deleteStaticPage/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting static by ID:", error);
        throw error;
    }
}

export const approveStaticById = async(id) =>
{
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/static/approveStaticPage/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error approving static by ID:", error);
        throw error;
    }
}