// src/lib/api.js
import axios from "axios";
import { toast } from "../components/ui/use-toast";
import { getToken } from "./auth";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
    withCredentials: true, // send/receive cookies
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            toast({
                title: "Network error",
                description: "Please check your internet connection and try again.",
                className: "bg-red-600 text-white",
            });
        }
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});
export default api;
