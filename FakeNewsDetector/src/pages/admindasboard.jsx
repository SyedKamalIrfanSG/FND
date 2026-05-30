import React, { useState } from "react";
import "..styles/admindashboard.css";

function Admindashboard() {
  const [news, setNews] = useState("");
  const [total, setTotal] = useState(0);
  const [fake, setFake] = useState(0);
  const [verified, setVerified] = useState(0);
  const [recent, setRecent] = useState([]);

  const analyzeNews = () => {
    if (!news.trim()) {
      alert("Please enter news content");
      return;
    }

    const isFake = Math.random() > 0.5;
    const result = isFake ? "Fake" : "Verified";

    setTotal(total + 1);

    if (isFake) {
      setFake(fake + 1);
    } else {
      setVerified(verified + 1);
    }

    setRecent([
      {
        text: news,
        result: result,
      },
      ...recent,
    ]);

    setNews("");
  };

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo-section">
          <div className="logo">🛡️</div>

          <div>
            <h2>Fake News Detector</h2>
            <p>AI Powered Fake News Checking System</p>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="admin-btn">Admin Panel</button>
          <button className="logout-btn">Logout</button>
        </div>

      </nav>

      <div className="container">

        <div className="left-section">

          <div className="info-box">
            <h4>ⓘ How It Works?</h4>

            <p>
              Our AI uses Machine Learning Logistic Regression
               algorithm to determine whether news is real or fake.
            </p>
          </div>

          <div className="analyze-box">

            <h1>Analyze News Content</h1>

            <textarea
              placeholder="Enter the news here..."
              value={news}
              onChange={(e) => setNews(e.target.value)}
            />

            <button onClick={analyzeNews}>
              Analyze Content
            </button>

          </div>

        </div>

        <div className="right-section">

          <div className="stats-box">

            <h2>📈 Quick Stats</h2>

            <p>Analyses Today</p>
            <span>{total}</span>

            <p className="one">Fake Content</p>
            <span className="red">{fake}</span>

            <p>Verified Content</p>
            <span className="green">{verified}</span>

          </div>

          <div className="recent-box">

            <h2>🕘 Recent Analyses</h2>

            {recent.length === 0 ? (
              <p className="empty">
                No analyses yet...start by checking some content
              </p>
            ) : (
              recent.map((item, index) => (
                <div className="recent-item" key={index}>
                  <p>{item.text}</p>

                  <strong
                    className={
                      item.result === "Fake"
                        ? "red"
                        : "green"
                    }
                  >
                    {item.result}
                  </strong>
                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Fnd;