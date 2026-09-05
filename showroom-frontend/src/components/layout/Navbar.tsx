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
              All Vehicles
            </NavLink>

            {/* SCOOTERS DROPDOWN */}
            <div className="nav-dropdown">
              <Link to="/vehicles?category=SCOOTER" className="nav-link nav-dropdown-trigger">
                Scooters <ChevronDown size={13} style={{ marginLeft: "2px" }} />
              </Link>
              <div className="nav-dropdown-menu">
                <Link to="/vehicles?category=SCOOTER" className="nav-dropdown-item title-item">
                  🛵 All Scooters
                </Link>
                <Link to="/vehicles?category=SCOOTER&model=Access" className="nav-dropdown-item">
                  Access 125
                </Link>
                <Link to="/vehicles?category=SCOOTER&model=Avenis" className="nav-dropdown-item">
                  Avenis 125
                </Link>
                <Link to="/vehicles?category=SCOOTER&model=Burgman" className="nav-dropdown-item">
                  Burgman Street
                </Link>
              </div>
            </div>

            {/* BIKES DROPDOWN */}
            <div className="nav-dropdown">
              <Link to="/vehicles?category=BIKE" className="nav-link nav-dropdown-trigger">
                Bikes <ChevronDown size={13} style={{ marginLeft: "2px" }} />
              </Link>
              <div className="nav-dropdown-menu">
                <Link to="/vehicles?category=BIKE" className="nav-dropdown-item title-item">
                  🏍️ All Bikes
                </Link>
                <Link to="/vehicles?category=BIKE&model=Gixxer" className="nav-dropdown-item">
                  Gixxer
                </Link>
                <Link to="/vehicles?category=BIKE&model=SF" className="nav-dropdown-item">
                  Gixxer SF
                </Link>
              </div>
            </div>

            {/* EV DROPDOWN */}
            <div className="nav-dropdown">
              <Link to="/vehicles?category=ELECTRIC" className="nav-link nav-dropdown-trigger">
                EV <ChevronDown size={13} style={{ marginLeft: "2px" }} />
              </Link>
              <div className="nav-dropdown-menu">
                <Link to="/vehicles?category=ELECTRIC" className="nav-dropdown-item title-item">
                  ⚡ All EV Electric
                </Link>
                <Link to="/vehicles?category=ELECTRIC&model=Access" className="nav-dropdown-item">
                  e-Access (EV Access)
                </Link>
                <Link to="/vehicles?category=ELECTRIC&model=Burgman" className="nav-dropdown-item">
                  e-Burgman (EV Burgman)
                </Link>
              </div>
            </div>

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
              All Vehicles
            </NavLink>

            <div className="mobile-nav-subgroup">
              <div className="mobile-subgroup-title">🛵 Scooters</div>
              <Link to="/vehicles?category=SCOOTER&model=Access" onClick={closeMobileMenu} className="mobile-sublink">• Access 125</Link>
              <Link to="/vehicles?category=SCOOTER&model=Avenis" onClick={closeMobileMenu} className="mobile-sublink">• Avenis 125</Link>
              <Link to="/vehicles?category=SCOOTER&model=Burgman" onClick={closeMobileMenu} className="mobile-sublink">• Burgman Street</Link>
            </div>

            <div className="mobile-nav-subgroup">
              <div className="mobile-subgroup-title">🏍️ Bikes</div>
              <Link to="/vehicles?category=BIKE&model=Gixxer" onClick={closeMobileMenu} className="mobile-sublink">• Gixxer</Link>
              <Link to="/vehicles?category=BIKE&model=SF" onClick={closeMobileMenu} className="mobile-sublink">• Gixxer SF</Link>
            </div>

            <div className="mobile-nav-subgroup">
              <div className="mobile-subgroup-title">⚡ EV Electric</div>
              <Link to="/vehicles?category=ELECTRIC&model=Access" onClick={closeMobileMenu} className="mobile-sublink">• e-Access (EV Access)</Link>
            </div>

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
