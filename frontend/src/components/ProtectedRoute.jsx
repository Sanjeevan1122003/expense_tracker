// src/ProtectedRoute.jsx
import { useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = Cookies.get("jwt_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/", { replace: true });
  }, [token]);

  if (!token) return null;

  return <>{children}</>;
}
