import {
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
} from "lucide-react";

const ContactPage = () => {
  const showroomPhone = "9425131697";
  const showroomEmail = "Shriharisuzuki@gmail.com";
  const showroomAddress =
    "Hotel The Sara, AB Road, near Kushmoda Chowki, Gaushala Mahaveerpura, Guna, Madhya Pradesh 473001";

  // Google Maps Directions link for exact Guna showroom location
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Shri Hari Suzuki Hotel The Sara AB Road Guna Madhya Pradesh"
  )}`;

  // Interactive OpenStreetMap Embed URL centered at Guna, MP
  const mapEmbedUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=77.3000%2C24.6400%2C77.3200%2C24.6600&layer=mapnik&marker=24.6468%2C77.3093";

  return (
    <main
      className="public-page contact-page"
      style={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* PAGE HEADER */}
      <section style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "1.5px",
            color: "var(--primary-color, #2563eb)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          AUTHORIZED SUZUKI DEALERSHIP
        </span>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "800",
            margin: "0 0 0.5rem",
            color: "var(--text-primary, #0f172a)",
          }}
        >
          Contact Shri Hari Suzuki
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "#64748b",
            maxWidth: "650px",
            margin: "0 auto",
          }}
        >
          Visit our main Guna showroom for sales, test rides, genuine spare parts,
          financing options, and authorized Suzuki two-wheeler service.
        </p>
      </section>

      {/* TWO-COLUMN CONTACT LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: SHOWROOM DETAILS */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "#2563eb",
                  letterSpacing: "1px",
                }}
              >
                SHRI HARI SUZUKI
              </span>
              <h2
                style={{
                  fontSize: "1.25rem",
                  margin: 0,
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Shri Harivallabh Automobiles Services Pvt. Ltd.
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              color: "#16a34a",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "6px 12px",
              borderRadius: "6px",
              marginBottom: "1.5rem",
              width: "fit-content",
            }}
          >
            <ShieldCheck size={16} />
            <span>Authorized Suzuki Two-Wheeler Showroom</span>
          </div>

          {/* CONTACT INFO ITEMS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            {/* ADDRESS */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#475569",
                  marginTop: "2px",
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    marginBottom: "2px",
                  }}
                >
                  Showroom Address
                </strong>
                <span style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.4" }}>
                  {showroomAddress}
                </span>
              </div>
            </div>

            {/* PHONE */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#475569",
                  marginTop: "2px",
                }}
              >
                <Phone size={18} />
              </div>
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    marginBottom: "2px",
                  }}
                >
                  Phone / Whatsapp
                </strong>
                <a
                  href={`tel:${showroomPhone}`}
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    color: "#2563eb",
                    textDecoration: "none",
                  }}
                >
                  +91 {showroomPhone}
                </a>
              </div>
            </div>

            {/* EMAIL */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#475569",
                  marginTop: "2px",
                }}
              >
                <Mail size={18} />
              </div>
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    marginBottom: "2px",
                  }}
                >
                  Email Address
                </strong>
                <a
                  href={`mailto:${showroomEmail}`}
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#2563eb",
                    textDecoration: "none",
                  }}
                >
                  {showroomEmail}
                </a>
              </div>
            </div>

            {/* HOURS */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#475569",
                  marginTop: "2px",
                }}
              >
                <Clock size={18} />
              </div>
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    marginBottom: "2px",
                  }}
                >
                  Showroom Business Hours
                </strong>
                <span style={{ fontSize: "0.9rem", color: "#475569", display: "block" }}>
                  Monday – Saturday: 9:30 AM – 8:00 PM
                </span>
                <span style={{ fontSize: "0.9rem", color: "#475569", display: "block" }}>
                  Sunday: 10:00 AM – 6:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              href={`tel:${showroomPhone}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "0.95rem",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              <Phone size={18} /> Call Showroom
            </a>

            <a
              href={`mailto:${showroomEmail}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "#f1f5f9",
                color: "#0f172a",
                fontWeight: "600",
                fontSize: "0.95rem",
                borderRadius: "8px",
                textDecoration: "none",
                border: "1px solid #cbd5e1",
              }}
            >
              <Mail size={18} /> Email Us
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "#059669",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "0.95rem",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              <Navigation size={18} /> Get Directions <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL INTERACTIVE MAP */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: "450px",
          }}
        >
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={18} color="#2563eb" />
              <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                Interactive Showroom Map (Guna, MP)
              </strong>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Guna, MP 473001</span>
          </div>

          <div style={{ flex: 1, width: "100%", minHeight: "400px", position: "relative" }}>
            <iframe
              title="Shri Hari Suzuki Showroom Map Guna"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              loading="lazy"
              allowFullScreen
              src={mapEmbedUrl}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;