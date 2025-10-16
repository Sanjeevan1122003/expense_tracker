import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import "./App.css";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login setEmail={setEmail} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard email={email} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
