import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admindashboard.css";




function AdminDashboard() {
  const navigate = useNavigate();

  const [news, setNews] = useState("");

  const handleLogout = () => {
    navigate("/");
  };

  const handleAdminPanel = () => {
    navigate("/admin-panel");
  };

  const handleAnalyze = () => {
    if (!news.trim()) {
      alert("Please enter news content");
      return;
    }

    alert("News submitted successfully!");
  };

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo-section">

          <div className="logo">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <div>
            <h2>Fake News Detector</h2>
            <p>AI Powered Fake News Checking System</p>
          </div>

        </div>

        <div className="nav-buttons">

          <button
            className="admin-btn"
            onClick={handleAdminPanel}
          >
            Admin Panel
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* MAIN CONTENT */}
      <div className="main-container">

        <div className="left-panel">

          <div className="info-card">
            <h4>
              <i className="fa-solid fa-circle-info"></i>
              {" "}How It Works?
            </h4>

            <p>
              Our AI uses Machine Learning Logistic Regression
              algorithm to identify whether the news is real or fake.
            </p>
          </div>

          <div className="analyze-card">

            <h1>Analyze News Content</h1>

            <textarea
              placeholder="Enter the news here..."
              value={news}
              onChange={(e) => setNews(e.target.value)}
            />

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
            >
              Analyze Content
            </button>

          </div>

        </div>

        <div className="right-panel">

          <div className="stats-card">

            <h2>
              <i className="fa-solid fa-chart-line"></i>
              {" "}Quick Stats
            </h2>

            <div className="stats-content">
              <p>Analyses Today</p>
              <span>0</span>

              <p>Fake Content</p>
              <span className="red">0</span>

              <p>Verified Content</p>
              <span className="green">0</span>
            </div>

          </div>

          <div className="recent-card">

            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i>
              {" "}Recent Analyses
            </h2>

            <p className="empty-text">
              No analyses yet... Start by checking some content.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;

