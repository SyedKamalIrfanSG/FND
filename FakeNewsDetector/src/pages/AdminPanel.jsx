import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminpanel.css";

function AdminPanel() {

  const navigate = useNavigate("/admindashboard");

  // ADMIN INFO
  const [adminData] = useState({
    name: "Admin User",
    email: "admin@example.com",
  });

  // USERS
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "active",
      analyses: 156,
      joined: "1/15/2024",
    },
    {
      id: 2,
      name: "John Doe",
      email: "user@example.com",
      role: "User",
      status: "active",
      analyses: 42,
      joined: "3/20/2024",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "active",
      analyses: 28,
      joined: "4/10/2024",
    },
    {
      id: 4,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "User",
      status: "blocked",
      analyses: 15,
      joined: "2/5/2024",
    },
    {
      id: 5,
      name: "Alice Cooper",
      email: "alice@example.com",
      role: "Admin",
      status: "active",
      analyses: 67,
      joined: "5/1/2024",
    },
  ]);

  // BLOCK USER
  const toggleBlock = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
            ...user,
            status:
              user.status === "active"
                ? "blocked"
                : "active",
          }
          : user
      )
    );
  };

  // CHANGE ROLE
  const toggleRole = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
            ...user,
            role:
              user.role === "Admin"
                ? "User"
                : "Admin",
          }
          : user
      )
    );
  };

  // DELETE USER
  const deleteUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  };

  // STATS
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "active"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "blocked"
  ).length;

  const admins = users.filter(
    (user) => user.role === "Admin"
  ).length;

  // LOGOUT
  const handleLogout = () => {
    navigate("/");
  };

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
            <p>User Management & System Control</p>
          </div>

        </div>

        <div className="header-right">

          <Link to="/admin-dashboard" className="header-btn">
            <i className="fa-solid fa-arrow-left"></i>
            Back to App
          </Link>

          <div className="admin-info">
            <h4>{adminData.name}</h4>
            <p>{adminData.email}</p>
          </div>
          
          <button
            className="header-btn"
            onClick={handleLogout}
          >
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

            {users.map((user) => (

              <tr key={user.id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.role === "Admin"
                        ? "role admin-role"
                        : "role user-role"
                    }
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      user.status === "active"
                        ? "status active-status"
                        : "status blocked-status"
                    }
                  >
                    {user.status}
                  </span>
                </td>

                <td>{user.analyses}</td>

                <td>{user.joined}</td>

                <td>

                  <div className="action-buttons">

                    <button
                      className="action-btn role-btn"
                      onClick={() => toggleRole(user.id)}
                    >
                      <i className="fa-solid fa-user-gear"></i>
                    </button>

                    <button
                      className="action-btn block-btn"
                      onClick={() => toggleBlock(user.id)}
                    >
                      <i className="fa-solid fa-ban"></i>
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteUser(user.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminPanel;