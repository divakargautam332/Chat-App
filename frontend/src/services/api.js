import axios from "axios";

// Create Axios instance
const API = axios.create({
    baseURL: "http://localhost:5000/api", // Replace with your backend URL
});

// Automatically attach JWT token from localStorage
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Token saved during login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Export API instance
export default API;