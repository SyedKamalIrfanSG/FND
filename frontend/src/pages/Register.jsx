import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ REGISTER FUNCTION (FIXED)
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password rule (your custom rule)
    if (!password.includes("USER135")) {
      alert("Password must contain USER135\nExample: mypasswordUSER135");
      return;
    }

    try {
      const response = await fetch("https://fnd-1.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      console.log("Server Response:", data);

      if (response.ok) {
        alert("Account Created Successfully!");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="main-container">

      {/* LEFT IMAGE */}
      <div className="left-section">
        <img src="/detective.jpeg" alt="detective" width="300" />
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">

        {/* LOGO */}
        <div className="logo-title">
          <div className="logo-box">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1>Fake News Detection System</h1>
        </div>

        <p className="subtitle">
          Create account to access AI-powered news verification
        </p>

        {/* TABS */}
        <div className="tabs">
          <Link to="/" className="tab">
            <i className="fa-solid fa-right-to-bracket"></i>
            LOGIN
          </Link>

          <Link to="/register" className="tab active">
            <i className="fa-solid fa-user-plus"></i>
            REGISTER
          </Link>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signin-btn">
            Create Account
          </button>

          <p className="password-note">
            Password must contain <strong>USER135</strong>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;

