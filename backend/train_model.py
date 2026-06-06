from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import joblib
import os

app = Flask(__name__)
CORS(app)

# =========================
# DB CONNECTION
# =========================
db = mysql.connector.connect(
    host="localhost",
    user="fnd_user",
    password="fnd@135",
    database="fake_news_db"
)

cursor = db.cursor()

# =========================
# LOAD ML MODEL (FIXED PATH)
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))

# =========================
# HOME
# =========================
@app.route("/")
def home():
    return "Backend Running 🚀"

# =========================
# PREDICT
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    user_id = data.get("user_id")
    news_text = data.get("news", "")

    # IMPORTANT: same preprocessing as training
    content = news_text.lower()

    vector = vectorizer.transform([content])
    prediction = model.predict(vector)[0]

    result = "real" if prediction == 1 else "fake"

    cursor.execute("""
        INSERT INTO analyses (user_id, title, content, prediction)
        VALUES (%s, %s, %s, %s)
    """, (user_id, news_text[:100], news_text, result))

    db.commit()

    return jsonify({
        "prediction": result
    })

# =========================
# ADMIN USERS (FIXED YOUR SQL ISSUE)
# =========================
@app.route("/admin/users", methods=["GET"])
def get_users():

    cursor.execute("""
        SELECT id, username, email, role, status, created_at
        FROM users
    """)

    rows = cursor.fetchall()

    result = []

    for row in rows:

        user_id = row[0]

        # latest analysis
        cursor.execute("""
            SELECT prediction
            FROM analyses
            WHERE user_id=%s
            ORDER BY id DESC
            LIMIT 1
        """, (user_id,))

        last = cursor.fetchone()

        result.append({
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "role": row[3],
            "status": row[4],
            "joined": str(row[5]),
            "analyses": last[0] if last else "No data"
        })

    return jsonify(result)

# =========================
# TOGGLE STATUS
# =========================
@app.route("/admin/toggle-status/<int:user_id>", methods=["PUT"])
def toggle_status(user_id):

    cursor.execute("SELECT status FROM users WHERE id=%s", (user_id,))
    status = cursor.fetchone()[0]

    new_status = "blocked" if status == "active" else "active"

    cursor.execute("""
        UPDATE users SET status=%s WHERE id=%s
    """, (new_status, user_id))

    db.commit()

    return jsonify({"message": "updated"})

# =========================
# TOGGLE ROLE
# =========================
@app.route("/admin/toggle-role/<int:user_id>", methods=["PUT"])
def toggle_role(user_id):

    cursor.execute("SELECT role FROM users WHERE id=%s", (user_id,))
    role = cursor.fetchone()[0]

    new_role = "admin" if role == "user" else "admin"

    cursor.execute("""
        UPDATE users SET role=%s WHERE id=%s
    """, (new_role, user_id))

    db.commit()

    return jsonify({"message": "updated"})

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)