// src/lib/api.js
import axios from "axios";
<<<<<<< HEAD

const api = axios.create({
    baseURL: "https://expense-tracker-zeta-woad.vercel.app/",
    withCredentials: true, // send/receive cookies
});

=======
import { toast } from "../components/ui/use-toast";

const api = axios.create({
    baseURL: "https://expense-tracker-zeta-woad.vercel.app/",
    // baseURL: "http://localhost:5000/",
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

>>>>>>> f8564ef (New updates)
export default api;
