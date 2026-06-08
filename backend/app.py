from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import joblib
import os

app = Flask(__name__)
CORS(app)






DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found")

conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True

def get_cursor():
    return conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

# ==========================
# ML MODEL
# ==========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_FILE = os.path.join(BASE_DIR, "model.pkl")
VECT_FILE = os.path.join(BASE_DIR, "vectorizer.pkl")

if not os.path.exists(MODEL_FILE) or not os.path.exists(VECT_FILE):
    raise FileNotFoundError("Model files not found in backend folder")

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
    try:
        data = request.json
        cursor = get_cursor()

        cursor.execute("""
            INSERT INTO users
            (username, email, password, role, status)
            VALUES (%s, %s, %s, 'user', 'active')
        """, (
            data["username"],
            data["email"],
            data["password"]
        ))

        return jsonify({
            "message": "User registered successfully"
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "error": str(e)
        }), 500

# ==========================
# LOGIN
# ==========================
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        cursor = get_cursor()

        cursor.execute("""
            SELECT
                id,
                username,
                email,
                role,
                status
            FROM users
            WHERE email=%s
            AND password=%s
        """, (
            data["email"],
            data["password"]
        ))

        user = cursor.fetchone()

        if user:
            return jsonify({
                "message": "Login successful",
                "user": user
            })

        return jsonify({
            "message": "Invalid credentials"
        }), 401

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

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

    conn.commit()

    return jsonify({"prediction": result})

# ==========================
# USER DASHBOARD
# ==========================
@app.route("/dashboard/<int:user_id>")
def dashboard(user_id):
    cursor = get_cursor()

    cursor.execute("SELECT COUNT(*) AS total FROM analyses WHERE user_id=%s", (user_id,))
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS fake FROM analyses WHERE user_id=%s AND prediction='fake'", (user_id,))
    fake = cursor.fetchone()["fake"]

    cursor.execute("SELECT COUNT(*) AS realc FROM analyses WHERE user_id=%s AND prediction='real'", (user_id,))
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

    cursor.execute("SELECT COUNT(*) AS c FROM users")
    total_users = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM users WHERE status='active'")
    active_users = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM users WHERE status='blocked'")
    blocked_users = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM users WHERE role='admin'")
    admins = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM analyses")
    total_analyses = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM analyses WHERE prediction='fake'")
    fake_count = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM analyses WHERE prediction='real'")
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
# ADMIN USERS LIST
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

    conn.commit()

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

    conn.commit()

    return jsonify({"message": "role updated"})

# ==========================
# DELETE USER
# ==========================
@app.route("/admin/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    cursor = get_cursor()

    cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
    conn.commit()

    return jsonify({"message": "user deleted"})

# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)