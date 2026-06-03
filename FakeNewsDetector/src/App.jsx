import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Admindashboard from "./pages/Admindashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admindashboard"
          element={<Admindashboard />}
        />

        <Route
          path="/admin-panel"
          element={<AdminPanel />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;