import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(
          "http://localhost:5000/logout",
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        // Clear cookie by setting it to empty with immediate expiry on client side
        document.cookie = "token=; Max-Age=0; path=/;";

        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
