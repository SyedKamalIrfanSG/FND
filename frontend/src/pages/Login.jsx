import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://fnd-1.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login Successful!");

        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="main-container">

      <div className="left-section">
        <img
          src="/detective.jpeg"
          alt="detective"
          width="300"
        />
      </div>

      <div className="right-section">

        <div className="logo-title">
          <div className="logo-box">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <h1>Fake News Detection System</h1>
        </div>

        <p className="subtitle">
          Sign in to access AI-powered news verification
        </p>

        <div className="tabs">

          <Link
            to="/"
            className="tab active"
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            LOGIN
          </Link>

          <Link
            to="/register"
            className="tab"
          >
            <i className="fa-solid fa-user-plus"></i>
            REGISTER
          </Link>

        </div>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="signin-btn"
          >
            Sign In
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;

