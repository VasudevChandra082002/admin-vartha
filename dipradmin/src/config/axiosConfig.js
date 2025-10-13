import axios from "axios";

const api = axios.create({
    baseURL: "https://vartha-janapada.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;