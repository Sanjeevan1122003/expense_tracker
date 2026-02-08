import api from "../lib/api";
import { clearAuth, setAuth } from "../lib/auth";

export const login = async (credentials) => {
  const res = await api.post("/login", credentials);
  const token = res?.data?.token;
  if (token) setAuth(token);
  return res;
};

export const registerUser = (payload) => api.post("/register", payload);

export const logout = async () => {
  try {
    await api.post("/logout");
  } finally {
    clearAuth();
  }
};
