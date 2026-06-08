import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userdashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [news, setNews] = useState("");
  const [prediction, setPrediction] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    fake: 0,
    real: 0,
    recent: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const loadDashboard = async () => {
    try {
      const response = await fetch(
        `https://fnd-1.onrender.com/dashboard/${user.id}`
      );

      const data = await response.json();

      setStats({
        total: data.total_analyses || 0,
        fake: data.fake || 0,
        real: data.real || 0,
        recent: data.recent || [],
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!news.trim()) {
      alert("Please enter news content");
      return;
    }

    try {
      const response = await fetch(
        "https://fnd-1.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            news: news,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
        setNews("");
        loadDashboard();
      } else {
        alert(data.message || "Prediction failed");
      }
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Server Error");
    }
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

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
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
              Regression algorithm to identify
              whether the news is real or fake.
            </p>
          </div>

          <div className="analyze-card">
            <h1>Analyze News Content</h1>

            <textarea
              placeholder="Enter the news content here..."
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
                <p>Total Analyses</p>
                <span>{stats.total}</span>
              </div>

              <div className="stat-row">
                <p>Fake News</p>
                <span className="red">
                  {stats.fake}
                </span>
              </div>

              <div className="stat-row">
                <p>Real News</p>
                <span className="green">
                  {stats.real}
                </span>
              </div>

            </div>

          </div>

          {/* PREDICTION RESULT */}
          {prediction && (
            <div className="recent-card">

              <h2>
                <i className="fa-solid fa-brain"></i>
                {" "}Prediction Result
              </h2>

              <h3
                style={{
                  textAlign: "center",
                  marginTop: "15px",
                }}
              >
                {prediction === "real"
                  ? "REAL NEWS ✅"
                  : "FAKE NEWS ❌"}
              </h3>

            </div>
          )}

          {/* RECENT ANALYSES */}
          <div className="recent-card">

            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i>
              {" "}Recent Analyses
            </h2>

            {stats.recent.length === 0 ? (
              <p className="empty-text">
                No analyses yet...
              </p>
            ) : (
              stats.recent.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "15px",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "10px",
                  }}
                >
                  <strong>{item.title}</strong>

                  <p>
                    {item.prediction === "real"
                      ? "✅ REAL"
                      : "❌ FAKE"}
                  </p>
                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;