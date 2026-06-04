import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!password.includes("USER135")) {
      alert(
        "Password must contain USER135\n\nExample:\nmypasswordUSER135"
      );
      return;
    }

    alert("Account Created Successfully!");

    navigate("/");
  };

  return (
    <div className="main-container">

      {/* LEFT IMAGE */}
      <div className="left-section">
        <img
          src="/detective.jpeg"
          alt="detective"
          width="300"
        />
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

          <Link
            to="/register"
            className="tab active"
          >
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
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

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