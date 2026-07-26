import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {

    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const res = await api.post(
        "accounts/login/",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      localStorage.setItem(
        "access",
        res.data.access
      );

      localStorage.setItem(
        "refresh",
        res.data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/");

    } catch (err) {
      
      alert(
        err.response?.data?.detail ||
        "Login Failed"
      );

    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#fff",
          padding: "45px 35px",
          borderRadius: "18px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Login
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #999",
            borderRadius: "8px",
            padding: "0 10px",
          }}
        >
          <FaUser color="#666" />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={{
              flex: 1,
              height: "38px",
              border: "none",
              outline: "none",
              marginLeft: "10px",
            }}
          />
        </div>

        {errors.username && (
          <p style={{ color: "red", fontSize: "12px" }}>
            {errors.username}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #999",
            borderRadius: "8px",
            padding: "0 10px",
          }}
        >
          <FaLock color="#666" style={{
    minWidth: "18px",
    fontSize: "16px",
    flexShrink: 0,
  }} />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              flex: 1,
              height: "38px",
              border: "none",
              outline: "none",
              marginLeft: "10px",
            }}
          />

          <span
            onClick={() =>
              setShowPassword(!showPassword)
            }
            style={{
              cursor: "pointer",
            }}
          >
            {showPassword
              ? <FaEyeSlash />
              : <FaEye />}
          </span>
        </div>

        {errors.password && (
          <p style={{ color: "red", fontSize: "12px" }}>
            {errors.password}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            alignSelf: "center",
            width: "100px",
            height: "38px",
            marginTop: "10px",
            border: "none",
            borderRadius: "20px",
            background: "#1d5fa8",
            color: "#fff",
            cursor: "pointer",
            boxShadow:
              "0 4px 12px rgba(29,95,168,0.4)",
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;