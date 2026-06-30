import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../style/verify.css";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("http://localhost:5000/api/verify", {
        email,
        otp,
      });

      if (response.data.success) {
        localStorage.setItem("auth_token", response.data.token);
        toast.success(response.data.message);
        navigate("/expense/from");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">

        {/* Top icon */}
        <div className="verify-icon">🔐</div>

        <h2>Verify OTP</h2>
        <p className="verify-email">{email}</p>

        <form onSubmit={verifyOtp}>
          <input
            className="verify-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="verify-btn">
            Verify OTP
          </button>
        </form>

        <p className="verify-resend">
          Didn't receive a code?{" "}
          <span onClick={() => toast.info("Resend OTP coming soon")}>
            Resend OTP
          </span>
        </p>

        {/* Decorative badge */}
        <div className="verify-badge">⚛️</div>

      </div>
    </div>
  );
}

export default VerifyOtp;