// src/lib/auth.js
import Cookies from "js-cookie";

const TOKEN_KEY = "jwt_token";
const EMAIL_FALLBACK = "user_email";

/**
 * Save authentication token and optional email fallback.
 * Token is stored in cookies, email in localStorage.
 */
export function setAuth(token, emailFallback) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 90, // 90 days
    sameSite: "lax",
  });

  if (emailFallback) {
    localStorage.setItem(EMAIL_FALLBACK, emailFallback);
  }
}

/**
 * Get the JWT token from cookies.
 * @returns {string | undefined}
 */
export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

/**
 * Clear all authentication data from cookies and localStorage.
 */
export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(EMAIL_FALLBACK);
}

/**
 * Retrieve the stored fallback email from localStorage.
 * Used when decoding the token fails or when token doesn't contain email.
 * @returns {string | null}
 */
export function getEmailFromToken() {
  return localStorage.getItem(EMAIL_FALLBACK);
}
