import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (password.includes("USER135")) {
      navigate("/user-dashboard");
    }
    else if (password.includes("ADMIN690")) {
      navigate("/admin-dashboard");
    }
    else {
      alert(
        "Invalid Password!\n\nUser Password Format:\nYourPasswordUSER135\n\nAdmin Password Format:\nYourPasswordADMIN690"
      );
    }
  };

  return (
    <div className="main-container">

      {/* LEFT PART */}
      <div className="left-section">
        <img
          src="/detective.jpeg"
          alt="detective"
          width="300"
        />
      </div>

      {/* RIGHT PART */}
      <div className="right-section">

        {/* LOGO */}
        <div className="logo-title">
          <div className="logo-box">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <h1>Fake News Detection System</h1>
        </div>

        <p className="subtitle">
          Sign in to access AI-powered news verification
        </p>

        {/* TABS */}
        <div className="tabs">

          <Link to="/" className="tab active">
            <i className="fa-solid fa-right-to-bracket"></i>
            LOGIN
          </Link>

          <Link to="/register" className="tab">
            <i className="fa-solid fa-user-plus"></i>
            REGISTER
          </Link>

        </div>

        {/* FORM */}
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
              <p className="password-note">
            Password must contain <strong>USER135</strong>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;