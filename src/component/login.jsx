import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../style/login.css";
import { ENV } from "../config/env";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        `${ENV.Backend_API}/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {

        toast.success(response.data.message);

        navigate("/verify", {
          state: {
            email: response.data.email
          }
        });

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="login-wrapper">
    

      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="field">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Send OTP</button>
          <p className="footer-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;