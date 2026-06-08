import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admindashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [news, setNews] = useState("");

  const [stats, setStats] = useState({
    total_users: 0,
    total_analyses: 0,
    fake_count: 0,
    real_count: 0,
  });

  const [recent, setRecent] = useState([]);

  // ==========================
  // FETCH ADMIN DASHBOARD DATA
  // ==========================
  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "https://fnd-1.onrender.com/admin/dashboard"
      );

      const data = await response.json();

      setStats({
        total_users: data.total_users || 0,
        total_analyses: data.total_analyses || 0,
        fake_count: data.fake_count || 0,
        real_count: data.real_count || 0,
      });

      setRecent(data.recent || []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================
  // LOGOUT
  // ==========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // ==========================
  // ADMIN PANEL
  // ==========================
  const handleAdminPanel = () => {
    navigate("/admin-panel");
  };

  // ==========================
  // ANALYZE BUTTON (UI ONLY)
  // ==========================
  const handleAnalyze = () => {
    if (!news.trim()) {
      alert("Please enter news content");
      return;
    }

    alert(
      "Prediction feature is available in User Dashboard."
    );
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

        {/* LEFT PANEL */}
        <div className="left-panel">

          <div className="info-card">

            <h4>
              <i className="fa-solid fa-circle-info"></i>
              {" "}How It Works?
            </h4>

            <p>
              Our AI uses Machine Learning Logistic
              Regression to identify whether news
              content is real or fake.
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
            />

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
            >
              Analyze Content
            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* STATS */}
          <div className="stats-card">

            <h2>
              <i className="fa-solid fa-chart-line"></i>
              {" "}Quick Stats
            </h2>

            <div className="stats-content">

              <div className="stat-row">
                <p>Total Users</p>
                <span>{stats.total_users}</span>
              </div>

              <div className="stat-row">
                <p>Total Analyses</p>
                <span>{stats.total_analyses}</span>
              </div>

              <div className="stat-row">
                <p>Fake News</p>
                <span className="red">
                  {stats.fake_count}
                </span>
              </div>

              <div className="stat-row">
                <p>Real News</p>
                <span className="green">
                  {stats.real_count}
                </span>
              </div>

            </div>

          </div>

          {/* RECENT ANALYSES */}
          <div className="recent-card">

            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i>
              {" "}Recent Analyses
            </h2>

            {recent.length === 0 ? (
              <p className="empty-text">
                No analyses available...
              </p>
            ) : (
              recent.map((item, index) => (
                <div
                  key={index}
                  className="recent-item"
                >
                  <strong>
                    {item.title}
                  </strong>

                  <p>
                    {item.prediction === "real"
                      ? "✅ REAL"
                      : "❌ FAKE"}
                  </p>

                  <small>
                    {item.created_at}
                  </small>
                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;