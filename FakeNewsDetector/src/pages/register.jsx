import { Link } from "react-router-dom";
import "../styles/register.css";

function Register() {
  return (
    <div className="main-container">

      {/* LEFT IMAGE */}
      <div className="left-section">
        <img
          src="/detective.jpeg"
          alt="detective"
          width="300"></img>
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
        <form>

          <input
            type="text"
            placeholder="Full Name"
            required
          />

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

          <button
            type="submit"
            className="signin-btn"
          >
            Create Account
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;