import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admindashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [news, setNews] = useState("");

  // 🔥 LIVE DATA FROM BACKEND
  const [stats, setStats] = useState({
    total_users: 0,
    total_analyses: 0,
    fake_count: 0,
    real_count: 0,
  });

  const [recent, setRecent] = useState([]);

  // ==========================
  // FETCH ADMIN DATA
  // ==========================
  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/admin/dashboard");
      const data = await res.json();

      setStats({
        total_users: data.total_users,
        total_analyses: data.total_analyses,
        fake_count: data.fake_count,
        real_count: data.real_count,
      });

      setRecent(data.recent || []);
    } catch (error) {
      console.log("Error fetching dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================
  // NAV ACTIONS
  // ==========================
  const handleLogout = () => {
    navigate("/");
  };

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

    alert("Use User Dashboard or API /predict endpoint for analysis");
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

          <button className="admin-btn" onClick={handleAdminPanel}>
            Admin Panel
          </button>

          <button className="logout-btn" onClick={handleLogout}>
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
              <i className="fa-solid fa-circle-info"></i> How It Works?
            </h4>

            <p>
              Our AI uses Machine Learning (Logistic Regression)
              to detect whether news is real or fake.
            </p>
          </div>

          <div className="analyze-card">

            <h1>Analyze News Content</h1>

            <textarea
              placeholder="Enter the news here..."
              value={news}
              onChange={(e) => setNews(e.target.value)}
            />

            <button className="analyze-btn" onClick={handleAnalyze}>
              Analyze Content
            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* STATS */}
          <div className="stats-card">

            <h2>
              <i className="fa-solid fa-chart-line"></i> Quick Stats
            </h2>

            <div className="stats-content">

              <p>Total Analyses</p>
              <span>{stats.total_analyses}</span>

              <p>Fake Content</p>
              <span className="red">{stats.fake_count}</span>

              <p>Verified Content</p>
              <span className="green">{stats.real_count}</span>

              <p>Total Users</p>
              <span>{stats.total_users}</span>

            </div>

          </div>

          {/* RECENT */}
          <div className="recent-card">

            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i> Recent Analyses
            </h2>

            {recent.length === 0 ? (
              <p className="empty-text">
                No analyses yet... Start by checking some content.
              </p>
            ) : (
              recent.map((item, index) => (
                <div key={index} className="recent-item">
                  <p><b>{item.title}</b></p>
                  <small>
                    {item.prediction.toUpperCase()} • {item.created_at}
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