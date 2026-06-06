import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminpanel.css";

function AdminPanel() {
  const navigate = useNavigate();

  const [adminData] = useState({
    name: "Admin User",
    email: "admin@example.com",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS FROM BACKEND
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/admin/users");
      const data = await res.json();

      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // ACTIONS
  // =========================
  const toggleBlock = async (id) => {
    await fetch(`http://127.0.0.1:5000/admin/toggle-status/${id}`, {
      method: "PUT",
    });
    fetchUsers();
  };

  const toggleRole = async (id) => {
    await fetch(`http://127.0.0.1:5000/admin/toggle-role/${id}`, {
      method: "PUT",
    });
    fetchUsers();
  };

  const handleLogout = () => {
    navigate("/");
  };

  // =========================
  // STATS
  // =========================
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const admins = users.filter((u) => u.role === "Admin").length;

  return (
    <div className="admin-page">

      {/* HEADER */}
      <header className="admin-header">

        <div className="header-left">
          <div className="shield-box">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <div>
            <h1>Admin Dashboard</h1>
            <p>User Management & Analytics</p>
          </div>
        </div>

        <div className="header-right">

          <Link to="/admin-dashboard" className="header-btn">
            <i className="fa-solid fa-arrow-left"></i>
            Back
          </Link>

          <div className="admin-info">
            <h4>{adminData.name}</h4>
            <p>{adminData.email}</p>
          </div>

          <button className="header-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>

        </div>

      </header>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <h3>Total Users</h3>
            <h2>{totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <h3>Active Users</h3>
            <h2>{activeUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <i className="fa-solid fa-circle-xmark"></i>
          </div>
          <div>
            <h3>Blocked Users</h3>
            <h2>{blockedUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <h3>Admins</h3>
            <h2>{admins}</h2>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="table-container">

        <div className="table-header">
          <h2>User Management</h2>
        </div>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Analyses</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="7">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <span className={user.role === "Admin" ? "admin-role" : "user-role"}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span className={user.status === "active" ? "active-status" : "blocked-status"}>
                      {user.status}
                    </span>
                  </td>

                  <td>{user.analyses}</td>
                  <td>{user.joined}</td>

                  <td>
                    <div className="action-buttons">

                      <button className="action-btn role-btn" onClick={() => toggleRole(user.id)}>
                        <i className="fa-solid fa-user-gear"></i>
                      </button>

                      <button className="action-btn block-btn" onClick={() => toggleBlock(user.id)}>
                        <i className="fa-solid fa-ban"></i>
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminPanel;