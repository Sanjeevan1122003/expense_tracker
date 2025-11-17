// src/lib/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://expense-tracker-zeta-woad.vercel.app/",
    withCredentials: true, // send/receive cookies
});

export default api;
