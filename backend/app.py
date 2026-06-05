from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="fnd_user",
    password="fnd@135",
    database="fake_news_db"
)

cursor = db.cursor()

@app.route("/")
def home():
    return "Backend Running 🚀"

# Register
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
        (data["username"], data["email"], data["password"])
    )
    db.commit()

    return jsonify({"message": "User registered successfully"})

# Login
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (data["email"], data["password"])
    )

    user = cursor.fetchone()

    if user:
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "role": user[4]
            }
        })

    return jsonify({"message": "Invalid credentials"}), 401

# Dashboard (REAL VERSION)
@app.route("/dashboard/<int:user_id>")
def dashboard(user_id):

    cursor.execute("""
        SELECT COUNT(*) FROM analyses 
        WHERE user_id=%s
    """, (user_id,))
    total = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM analyses 
        WHERE user_id=%s AND prediction='fake'
    """, (user_id,))
    fake = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM analyses 
        WHERE user_id=%s AND prediction='real'
    """, (user_id,))
    real = cursor.fetchone()[0]

    cursor.execute("""
        SELECT title, prediction, created_at 
        FROM analyses 
        WHERE user_id=%s 
        ORDER BY created_at DESC 
        LIMIT 5
    """, (user_id,))
    recent = cursor.fetchall()

    recent_list = []
    for r in recent:
        recent_list.append({
            "title": r[0],
            "prediction": r[1],
            "created_at": str(r[2])
        })

    return jsonify({
        "total_analyses": total,
        "fake": fake,
        "real": real,
        "recent": recent_list
    })

if __name__ == "__main__":
    app.run(debug=True)