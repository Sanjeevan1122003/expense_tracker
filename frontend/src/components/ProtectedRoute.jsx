// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/", { replace: true });
  }, [navigate, token]);

  if (!token) return null;

  return <>{children}</>;
}
