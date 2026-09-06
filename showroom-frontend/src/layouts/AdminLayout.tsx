import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

import authService from "../services/authService";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const admin = authService.getAdmin();
  const adminName = admin?.name || "Administrator";

  const handleLogout = () => {
    authService.logout();
    navigate("/admin/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/service-bookings", label: "Service Bookings", icon: Wrench },
    { to: "/admin/vehicles", label: "Vehicles", icon: Bike },
    { to: "/admin/test-rides", label: "Test Rides", icon: CalendarCheck },
    { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
    { to: "/admin/offers", label: "Offers", icon: Tag },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

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
            <span>Administration • v2.0 Mobile</span>
          </div>

        </div>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <nav className="admin-main-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
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

          {/* MOBILE TOGGLE BUTTON */}
          <button
            type="button"
            className="admin-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </header>

      {/* ================= MOBILE DRAWER MENU ================= */}

      {mobileMenuOpen && (
        <>
          <div
            className="admin-drawer-overlay"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div className="admin-mobile-drawer">
            <div className="admin-drawer-header">
              <div className="admin-drawer-brand">
                <img
                  src="/suzuki-logo.png"
                  alt="Suzuki Logo"
                  style={{ height: "28px", width: "auto" }}
                />
                <div>
                  <strong>Showroom Admin</strong>
                  <span>Suzuki Management</span>
                </div>
              </div>
              <button
                type="button"
                className="admin-drawer-close"
                onClick={closeMobileMenu}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-drawer-profile">
              <div className="admin-profile-icon">
                <UserCircle size={22} />
              </div>
              <div>
                <strong>{adminName}</strong>
                <span>System Administrator</span>
              </div>
            </div>

            <nav className="admin-drawer-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `admin-drawer-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="admin-drawer-footer">
              <button
                type="button"
                className="admin-drawer-logout"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= PAGE CONTENT ================= */}

      <main className="admin-layout-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
