import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import { baseUrl } from "../../constant";
import { useStore } from "../../context/StoreContext";
// import logo from "../../assets/images/logo.svg"; // Make sure to add your logo file

const AdminLoginPage = ({ onLogin }) => {
  const { user, setUser } = useStore();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create FormData object
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", email);
      formData.append("password", password);
      formData.append("scope", "");
      formData.append("client_id", "");
      formData.append("client_secret", "");

      const response = await fetch(`${baseUrl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "ngrok-skip-browser-warning": "69420",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Handle successful login
      if (data.access_token) {
        localStorage.setItem("user", data);
        setUser(data);
        // You might want to store other data from the response
        onLogin && onLogin(data);
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Top Navigation Bar */}
      <nav className="admin-navbar">
        <div className="logo-container">
          {/* <img src={logo} alt="Company Logo" className="logo-image" /> */}
        </div>
      </nav>

      {/* Main Container */}
      <div className="admin-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome</h1>
            <p>Please log in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Username</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className="form-footer">
              <p>
                Need an account?{" "}
                <a href="/signup" className="signup-link">
                  Sign up here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
