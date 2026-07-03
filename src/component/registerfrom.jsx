import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../style/Form.css"
import { useNavigate } from "react-router-dom";

function Form() {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    contact: "",
    profile: null,
  });

  const token = localStorage.getItem("auth_token");

  // ================= GET USERS =================
  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user", {
      });

      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      setFormData({
        ...formData,
        profile: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("contact", formData.contact);

    if (formData.profile) {
      data.append("profile", formData.profile);
    }

    try {
      if (isEditing) {
        data.append("_id", formData._id);

        const response = await axios.put("http://localhost:5000/api/user", data, {

        });

        toast.success(response.data.message || "User updated successfully");
        setIsEditing(false);
      } else {
        const response = await axios.post("http://localhost:5000/api/user", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data.message || "User registered successfully");
      }

      setFormData({
        _id: "",
        name: "",
        email: "",
        password: "",
        contact: "",
        profile: null,
      });
      getUsers();
      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  // ================= DELETE =================
  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete("http://localhost:5000/api/user", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       data: {
  //         _id: id,
  //       },
  //     });

  //     getUsers();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // // ================= EDIT =================
  // const handleEdit = (user) => {
  //   setIsEditing(true);

  //   setFormData({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     password: "",
  //     contact: user.contact,
  //     profile: null,
  //   });
  // };

  return (
    <div className="form-page-wrapper">
      {/* Floating badges - positioned absolutely to corners */}
      <div className="form-badge">📋</div>
      <div className="badge-bottom-left">⚛️</div>

      <div className="form-card">
        <h2>Register User</h2>

        <form onSubmit={handleSubmit}>
          <div className="field-wrap">
            <span className="field-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrap">
            <span className="field-icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrap">
            <span className="field-icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrap">
            <span className="field-icon">📞</span>
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <div className="file-area">
            <input type="file" name="profile" onChange={handleChange} />
            <span className="file-area-icon">🖼️</span>
            <span className="file-area-text">Upload Profile Picture</span>
          </div>

          <button type="submit" className="submit-btn" >
            {isEditing ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;