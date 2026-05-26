import { Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
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

        <form>

          <input
            type="email"
            placeholder="Email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <Link
            to="/user-dashboard"
            className="signin-btn"
          >
            Sign In
          </Link>

        </form>

      </div>

    </div>
  );
}

export default Login;
