import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/pagesstyle.css";
import userFromBg from "../assets/user-from-background.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setEmail }) => {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://expense-tracker-wheat-six-61.vercel.app/login", {
        email: emailInput,
        password,
      });

      const { jwt_token } = response.data;

      if (jwt_token) {
        Cookies.set("jwt_token", jwt_token);
        setEmail(emailInput);
        navigate("/dashboard");
      } else {
        setError("Invalid server response");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="card-content">
      <div className="card-container" style={{ "--user-bg": `url(${userFromBg})` }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
        {error && <p className="error" style={{ color: "white" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
