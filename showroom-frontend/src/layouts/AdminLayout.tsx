import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bike,
  MessageSquare,
  CalendarCheck,
  LogOut,
  UserCircle,
  Tag,
  Settings,
  Wrench,
} from "lucide-react";

import authService from "../services/authService";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const admin =
    authService.getAdmin();

  const adminName =
    admin?.name || "Administrator";

  const handleLogout = () => {
    authService.logout();

    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">

      {/* ================= HEADER ================= */}

      <header className="admin-dashboard-header">

        {/* ================= BRAND ================= */}

        <div className="admin-header-left">

          <div className="admin-brand-mark" style={{ background: "transparent", border: "none", display: "flex", alignItems: "center" }}>
            <img
              src="/suzuki-logo.png"
              alt="Suzuki Logo"
              style={{
                height: "32px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <div className="admin-brand-text">
            <strong>Showroom</strong>
            <span>Administration</span>
          </div>

        </div>

        {/* ================= NAVIGATION ================= */}

        <nav className="admin-main-nav">

          {/* Dashboard */}

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          {/* Service Bookings */}

          <NavLink
            to="/admin/service-bookings"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Wrench size={16} />
            Service Bookings
          </NavLink>

          {/* Vehicles */}

          <NavLink
            to="/admin/vehicles"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Bike size={16} />
            Vehicles
          </NavLink>

          {/* Test Rides */}

          <NavLink
            to="/admin/test-rides"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <CalendarCheck size={16} />
            Test Rides
          </NavLink>

          {/* Enquiries */}

          <NavLink
            to="/admin/enquiries"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <MessageSquare size={16} />
            Enquiries
          </NavLink>

          {/* Offers */}

          <NavLink
            to="/admin/offers"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Tag size={16} />
            Offers
          </NavLink>

          {/* Settings */}

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Settings size={16} />
            Settings
          </NavLink>

        </nav>

        {/* ================= ADMIN ACTIONS ================= */}

        <div className="admin-header-actions">

          <div className="admin-profile">

            <div className="admin-profile-icon">
              <UserCircle size={20} />
            </div>

            <div className="admin-profile-info">
              <strong>{adminName}</strong>
              <span>Administrator</span>
            </div>

          </div>

          <button
            type="button"
            className="admin-header-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={17} />
          </button>

        </div>

      </header>

      {/* ================= PAGE CONTENT ================= */}

      <main className="admin-layout-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
