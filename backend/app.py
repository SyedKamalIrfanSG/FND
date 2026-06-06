from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import joblib
import os

app = Flask(__name__)
CORS(app)

# ==========================
# CONFIG (from env vars for production)
# ==========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "fnd_user")
DB_PASS = os.environ.get("DB_PASS", "fnd@135")
DB_NAME = os.environ.get("DB_NAME", "fake_news_db")

# DB connection (Render will provide a managed DB and you should set env vars)
db = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASS,
    database=DB_NAME
)

# IMPORTANT: use dictionary cursor everywhere
def get_cursor():
    return db.cursor(dictionary=True)

# ==========================
# ML MODEL
# ==========================
# Load model files from backend directory. For production, either commit
# these files (if allowed) or fetch them from secure storage and set
# the MODEL_DIR / MODEL_FILE env vars accordingly.
MODEL_FILE = os.environ.get("MODEL_FILE", os.path.join(BASE_DIR, "model.pkl"))
VECT_FILE = os.environ.get("VECT_FILE", os.path.join(BASE_DIR, "vectorizer.pkl"))

if not os.path.exists(MODEL_FILE) or not os.path.exists(VECT_FILE):
    raise FileNotFoundError(
        f"Model files not found. Expected {MODEL_FILE} and {VECT_FILE}.\n"
        "Place them in the backend folder or set MODEL_FILE/VECT_FILE env vars."
    )

model = joblib.load(MODEL_FILE)
vectorizer = joblib.load(VECT_FILE)

# ==========================
# HOME
# ==========================
@app.route("/")
def home():
    return "Backend Running 🚀"

# ==========================
# REGISTER
# ==========================
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    cursor = get_cursor()

    cursor.execute("""
        INSERT INTO users (username, email, password)
        VALUES (%s, %s, %s)
    """, (data["username"], data["email"], data["password"]))

    db.commit()

    return jsonify({"message": "User registered successfully"})

# ==========================
# LOGIN
# ==========================
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    cursor = get_cursor()

    cursor.execute("""
        SELECT id, username, email, role
        FROM users
        WHERE email=%s AND password=%s
    """, (data["email"], data["password"]))

    user = cursor.fetchone()

    if user:
        return jsonify({
            "message": "Login successful",
            "user": user
        })

    return jsonify({"message": "Invalid credentials"}), 401

# ==========================
# PREDICT NEWS
# ==========================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    user_id = data["user_id"]
    news_text = data["news"]

    vector = vectorizer.transform([news_text])
    prediction = model.predict(vector)[0]

    result = "real" if prediction == 1 else "fake"

    cursor = get_cursor()

    cursor.execute("""
        INSERT INTO analyses (user_id, title, content, prediction)
        VALUES (%s, %s, %s, %s)
    """, (user_id, news_text[:100], news_text, result))

    db.commit()

    return jsonify({"prediction": result})

# ==========================
# USER DASHBOARD
# ==========================
@app.route("/dashboard/<int:user_id>")
def dashboard(user_id):

    cursor = get_cursor()

    cursor.execute("SELECT COUNT(*) as total FROM analyses WHERE user_id=%s", (user_id,))
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as fake FROM analyses WHERE user_id=%s AND prediction='fake'", (user_id,))
    fake = cursor.fetchone()["fake"]

    cursor.execute("SELECT COUNT(*) as realc FROM analyses WHERE user_id=%s AND prediction='real'", (user_id,))
    real = cursor.fetchone()["realc"]

    cursor.execute("""
        SELECT title, prediction, created_at
        FROM analyses
        WHERE user_id=%s
        ORDER BY created_at DESC
        LIMIT 5
    """, (user_id,))

    recent = cursor.fetchall()

    return jsonify({
        "total_analyses": total,
        "fake": fake,
        "real": real,
        "recent": recent
    })

# ==========================
# ADMIN DASHBOARD
# ==========================
@app.route("/admin/dashboard")
def admin_dashboard():

    cursor = get_cursor()

    cursor.execute("SELECT COUNT(*) as c FROM users")
    total_users = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) as c FROM users WHERE status='active'")
    active_users = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) as c FROM users WHERE status='blocked'")
    blocked_users = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) as c FROM users WHERE role='admin'")
    admins = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) as c FROM analyses")
    total_analyses = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) as c FROM analyses WHERE prediction='fake'")
    fake_count = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) as c FROM analyses WHERE prediction='real'")
    real_count = cursor.fetchone()["c"]

    cursor.execute("""
        SELECT title, prediction, created_at
        FROM analyses
        ORDER BY created_at DESC
        LIMIT 5
    """)

    recent = cursor.fetchall()

    return jsonify({
        "total_users": total_users,
        "active_users": active_users,
        "blocked_users": blocked_users,
        "admins": admins,
        "total_analyses": total_analyses,
        "fake_count": fake_count,
        "real_count": real_count,
        "recent": recent
    })

# ==========================
# ADMIN USERS LIST (FIXED)
# ==========================
@app.route("/admin/users", methods=["GET"])
def get_users():

    cursor = get_cursor()

    cursor.execute("""
        SELECT id, username, email, role, status, created_at
        FROM users
    """)

    users = cursor.fetchall()

    result = []

    for user in users:

        user_id = user["id"]

        cursor.execute("""
            SELECT prediction
            FROM analyses
            WHERE user_id=%s
            ORDER BY id DESC
            LIMIT 1
        """, (user_id,))

        last = cursor.fetchone()

        result.append({
            "id": user["id"],
            "name": user["username"],
            "email": user["email"],
            "role": user["role"],
            "status": user["status"],
            "joined": str(user["created_at"]),
            "analyses": last["prediction"] if last else "No data"
        })

    return jsonify(result)

# ==========================
# TOGGLE STATUS
# ==========================
@app.route("/admin/toggle-status/<int:user_id>", methods=["PUT"])
def toggle_status(user_id):

    cursor = get_cursor()

    cursor.execute("SELECT status FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()

    new_status = "blocked" if user["status"] == "active" else "active"

    cursor.execute("""
        UPDATE users SET status=%s WHERE id=%s
    """, (new_status, user_id))

    db.commit()

    return jsonify({"message": "status updated"})

# ==========================
# TOGGLE ROLE
# ==========================
@app.route("/admin/toggle-role/<int:user_id>", methods=["PUT"])
def toggle_role(user_id):

    cursor = get_cursor()

    cursor.execute("SELECT role FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()

    new_role = "admin" if user["role"] == "user" else "user"

    cursor.execute("""
        UPDATE users SET role=%s WHERE id=%s
    """, (new_role, user_id))

    db.commit()

    return jsonify({"message": "role updated"})

# ==========================
# DELETE USER
# ==========================
@app.route("/admin/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    cursor = get_cursor()

    cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
    db.commit()

    return jsonify({"message": "user deleted"})

# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    # Use PORT env var when deployed (Render sets $PORT)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)







