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

  const handleLogout = () => {
    navigate("/");
  };

  // Load Dashboard Data
  const loadDashboard = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/dashboard/${user.id}`
      );

      const data = await response.json();

      setStats({
        total: data.total_analyses,
        fake: data.fake,
        real: data.real,
        recent: data.recent,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Analyze News
  const handleAnalyze = async () => {
    if (!news.trim()) {
      alert("Please enter news content");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
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

      setPrediction(data.prediction);

      setNews("");

      loadDashboard();
    } catch (error) {
      console.error(error);
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

      {/* MAIN */}
      <div className="main-container">

        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="right-panel">

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

          {/* Prediction Card */}
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

          {/* Recent Analyses */}
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
                    borderBottom:
                      "1px solid #ddd",
                    paddingBottom: "10px",
                  }}
                >
                  <strong>
                    {item.title}
                  </strong>

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