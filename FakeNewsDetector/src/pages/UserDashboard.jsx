import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userdashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [news, setNews] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    fake: 0,
    verified: 0,
  });

  const handleLogout = () => {
    navigate("/");
  };

  const handleAnalyze = () => {
    if (!news.trim()) {
      alert("Please enter news content");
      return;
    }

    alert(
      "Backend connection pending.\nNews submitted successfully."
    );

    setStats({
      ...stats,
      total: stats.total + 1,
    });
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
            <p>
              AI Powered Fake News Checking System
            </p>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      {/* MAIN CONTENT */}
      <div className="main-container">

        {/* LEFT SIDE */}
        <div className="left-panel">

          <div className="info-card">

            <h4>
              <i className="fa-solid fa-circle-info"></i>
              {" "}How It Works?
            </h4>

            <p>
              Our AI uses Machine Learning Logistic
              Regression algorithm to identify whether
              the news is real or fake.
            </p>

          </div>

          <div className="analyze-card">

            <h1>Analyze News Content</h1>

            <textarea
              placeholder="Enter the news here..."
              value={news}
              onChange={(e) =>
                setNews(e.target.value)
              }
            ></textarea>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
            >
              Analyze Content
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">

          <div className="stats-card">

            <h2>
              <i className="fa-solid fa-chart-line"></i>
              {" "}Quick Stats
            </h2>

            <div className="stats-content">

              <div className="stat-row">
                <p>Analyses Today</p>
                <span>{stats.total}</span>
              </div>

              <div className="stat-row">
                <p>Fake Content</p>
                <span className="red">
                  {stats.fake}
                </span>
              </div>

              <div className="stat-row">
                <p>Verified Content</p>
                <span className="green">
                  {stats.verified}
                </span>
              </div>

            </div>

          </div>

          <div className="recent-card">

            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i>
              {" "}Recent Analyses
            </h2>

            <p className="empty-text">
              No analyses yet...
              Start by checking some content.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;