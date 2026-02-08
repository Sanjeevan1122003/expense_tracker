// src/lib/auth.js
import Cookies from "js-cookie";

const TOKEN_KEY = "etk";

export function setAuth(token) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 90, // 90 days
    sameSite: "lax",
    path: "/",
  });
}

export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
}

const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export function getEmailFromToken() {
  const payload = decodeToken(getToken());
  return payload?.email || null;
}
