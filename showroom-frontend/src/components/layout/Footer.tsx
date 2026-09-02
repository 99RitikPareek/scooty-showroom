import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/suzuki-logo.png"
              alt="Suzuki Logo"
              style={{
                height: "42px",
                width: "auto",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 2px 4px rgba(230, 0, 18, 0.3))",
              }}
            />

            <div>
              <h3>SHRI HARI SUZUKI</h3>
              <span>Authorized Suzuki Showroom</span>
            </div>
          </div>

          <p>
            Discover the latest Suzuki scooters and quality pre-owned
            vehicles with trusted service and transparent pricing.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>Services</h4>

          <Link to="/vehicles?type=NEW">New Vehicles</Link>
          <Link to="/vehicles?type=USED">Pre-Owned Vehicles</Link>
          <Link to="/test-ride">Book a Test Ride</Link>
          <Link to="/enquiry">Vehicle Enquiry</Link>
        </div>

        {/* Contact */}
        <div className="footer-column footer-contact">
          <h4>Contact Us</h4>

          <a href="tel:9425131697">
            <Phone size={17} />
            <span>9425131697</span>
          </a>

          <a href="mailto:Shriharisuzuki@gmail.com">
            <Mail size={17} />
            <span>Shriharisuzuki@gmail.com</span>
          </a>

          <a
            href="http://www.hotelthesara.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={17} />
            <span>Hotel The Sara</span>
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Shri Harivallabh Automobiles Services
          Pvt. Ltd. All rights reserved.
        </div>

        <div className="footer-developer-credit" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.88rem", color: "#e2e8f0", flexWrap: "wrap", justifyContent: "center" }}>
          <span>Designed &amp; Developed by</span>
          <a
            href="mailto:Ritikpareek923@gmail.com"
            style={{
              color: "#ffffff",
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: "none",
              paddingBottom: "1px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#E60012";
              
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#ffffff";
              
            }}
          >
            Ritik Pareek
          </a>
          <a
            href="mailto:Ritikpareek923@gmail.com"
            style={{
              color: "#94a3b8",
              fontSize: "0.82rem",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#cbd5e1")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            (Ritikpareek923@gmail.com)
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;