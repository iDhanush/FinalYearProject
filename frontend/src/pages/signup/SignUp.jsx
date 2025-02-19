import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";
// import logo from "../../assets/images/logo.svg"; // Make sure to add your logo file

const SignUpPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (email === admin?.[0]?.email && password === admin?.[0]?.pass) {
        navigate("/admin/users");
        localStorage.setItem("isAdmin", "true");
        onLogin?.(); // Call onLogin callback if provided
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
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
            <p>Sign up with email and Password</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
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

            <div className="form-group">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="text"
                id="password"
                value={cpass}
                onChange={(e) => setCpass(e.target.value)}
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
                Having an account?{" "}
                <a href="/login" className="signup-link">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
