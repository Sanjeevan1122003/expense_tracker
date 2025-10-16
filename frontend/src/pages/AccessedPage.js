import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AccessedPage = ({ children }) => {
  const token = Cookies.get("jwt_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AccessedPage;
