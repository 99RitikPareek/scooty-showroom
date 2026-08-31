import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  BadgePercent,
  Wrench,
  CalendarDays,
} from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="site-header">

      {/* ================= TOP BAR ================= */}

      <div className="top-bar">
        <div className="container top-bar-content">

          <div className="company-name">
            Shri Harivallabh Automobiles Services Pvt. Ltd.
          </div>

          <a
            href="tel:9425131697"
            className="top-phone"
          >
            <Phone size={14} />
            94251 31697
          </a>

        </div>
      </div>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="container navbar-inner">

          {/* ================= BRAND ================= */}

          <Link
            to="/"
            className="navbar-brand"
            onClick={closeMobileMenu}
          >
            <img
              src="/suzuki-logo.png"
              alt="Suzuki Logo"
              style={{
                height: "40px",
                width: "auto",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 2px 4px rgba(230, 0, 18, 0.2))",
              }}
            />

            <div className="brand-text">
              <strong>SHRI HARI</strong>
              <span>SUZUKI</span>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}

          <div className="desktop-nav">

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/vehicles"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              Vehicles
            </NavLink>

            {/* OFFERS */}

            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `nav-link offers-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <BadgePercent size={16} />
              Offers
            </NavLink>

            {/* SERVICE */}
            <NavLink
              to="/service"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Wrench size={15} style={{ marginRight: "4px" }} />
              Service
            </NavLink>

            <NavLink
              to="/test-ride"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              Test Ride
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              Contact
            </NavLink>

          </div>

          {/* ================= DESKTOP ACTIONS ================= */}

          <div className="navbar-actions">

            <a
              href="tel:9425131697"
              className="nav-call"
              title="Call Shri Hari Suzuki"
            >
              <Phone size={18} />
            </a>

            <Link
              to="/service"
              className="test-ride-btn"
              style={{ background: "#2563eb", border: "none" }}
            >
              <Wrench size={16} />
              Book Service
            </Link>

            <Link
              to="/test-ride"
              className="test-ride-btn"
            >
              <CalendarDays size={17} />
              Book Test Ride
            </Link>

          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>

        {/* ================= MOBILE NAVIGATION ================= */}

        {mobileOpen && (
          <div className="mobile-nav">

            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className="mobile-nav-link"
            >
              Home
            </NavLink>

            <NavLink
              to="/vehicles"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
            >
              Vehicles
              <ChevronDown size={16} />
            </NavLink>

            {/* MOBILE OFFERS */}

            <NavLink
              to="/offers"
              onClick={closeMobileMenu}
              className="mobile-nav-link offers-mobile-link"
            >
              <BadgePercent size={16} />
              Offers
            </NavLink>

            <NavLink
              to="/service"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
            >
              <Wrench size={16} />
              Service & Maintenance
            </NavLink>

            <NavLink
              to="/test-ride"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
            >
              Test Ride
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
            >
              Contact
            </NavLink>

            <a
              href="tel:9425131697"
              className="mobile-call-btn"
              onClick={closeMobileMenu}
            >
              <Phone size={18} />
              Call 94251 31697
            </a>

          </div>
        )}

      </nav>

    </header>
  );
};

export default Navbar;
