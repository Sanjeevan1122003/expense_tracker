import api from "../lib/api";

export const fetchDashboard = (params) =>
  api.get("/dashboard", { params });
