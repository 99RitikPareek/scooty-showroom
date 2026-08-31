import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Wrench, LogOut, RefreshCw, Check } from "lucide-react";
import customerAuthService from "../../services/customerAuthService";
import serviceBookingService from "../../services/serviceBookingService";
import type { CustomerUser } from "../../types/customerAuth";
import type { ServiceBooking, ServiceBookingStatus } from "../../types/serviceBooking";

const STATUS_STEPS: { key: ServiceBookingStatus; label: string; desc: string }[] = [
  { key: "PENDING", label: "Request Received", desc: "Your booking request is logged and awaiting confirmation." },
  { key: "CONFIRMED", label: "Booking Confirmed", desc: "Service slot confirmed by showroom staff." },
  { key: "IN_PROGRESS", label: "In Service Bay", desc: "Your vehicle is currently undergoing service by our technicians." },
  { key: "COMPLETED", label: "Ready for Delivery", desc: "Service complete! Your vehicle is inspected and ready for pickup." },
];

const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerUser | null>(customerAuthService.getCustomer());
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        const profile = await customerAuthService.getProfile();
        setCustomer(profile);

        if (profile.phone) {
          const myBookings = await serviceBookingService.track(profile.phone);
          setBookings(myBookings);
        }
      } catch (err) {
        console.error("Failed to load customer profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomerData();
  }, []);

  const handleLogout = () => {
    customerAuthService.logout();
    navigate("/login");
  };

  const getStatusIndex = (status: ServiceBookingStatus): number => {
    switch (status) {
      case "PENDING": return 0;
      case "CONFIRMED": return 1;
      case "IN_PROGRESS": return 2;
      case "COMPLETED": return 3;
      case "CANCELLED": return -1;
      default: return 0;
    }
  };

  if (!customer) return null;

  return (
    <div className="customer-dashboard-page" style={{ background: "#f8fafc", minHeight: "90vh", padding: "3rem 1rem 5rem" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>MY ACCOUNT PORTAL</span>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: "2px 0 0" }}>Welcome, {customer.name}!</h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/service" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#003b8f", color: "#fff", padding: "10px 18px", borderRadius: "10px", fontWeight: 700, textDecoration: "none" }}>
              <Wrench size={16} /> Book New Service
            </Link>

            <button type="button" onClick={handleLogout} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ffffff", border: "1px solid #cbd5e1", padding: "10px 16px", borderRadius: "10px", fontWeight: 600, color: "#ef4444", cursor: "pointer" }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-card" style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1rem", color: "#0f172a" }}>Customer Profile</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><User size={14} /> Full Name</span>
              <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{customer.name}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Phone size={14} /> Mobile Number</span>
              <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{customer.phone}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Mail size={14} /> Email Address</span>
              <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{customer.email || "Not specified"}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={14} /> Address / City</span>
              <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{customer.address || "Not specified"}</strong>
            </div>
          </div>
        </div>

        {/* MY SERVICE BOOKINGS SECTION */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>My Service Appointments</h2>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "2px 0 0" }}>Live tracking of all your vehicle service requests</p>
            </div>

            <button type="button" onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <RefreshCw size={28} className="spin" />
              <p style={{ marginTop: "0.5rem", color: "#64748b" }}>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3.5rem 1.5rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <Wrench size={44} color="#94a3b8" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem" }}>No Service Bookings Yet</h3>
              <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>You haven't scheduled any vehicle service appointments yet.</p>
              <Link to="/service" className="btn btn-primary" style={{ background: "#003b8f", color: "#fff", padding: "10px 22px", borderRadius: "10px", fontWeight: 700, textDecoration: "none" }}>
                Book First Service Slot
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {bookings.map((item) => {
                const currentStepIdx = getStatusIndex(item.status);
                const isCancelled = item.status === "CANCELLED";

                return (
                  <div key={item.id} className="status-card" style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                      <div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#003b8f", background: "#eaf2ff", padding: "4px 10px", borderRadius: "6px" }}>
                          {item.bookingCode}
                        </span>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "6px 0 2px" }}>{item.vehicleModel}</h3>
                        {item.registrationNumber && (
                          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>Reg: {item.registrationNumber}</span>
                        )}
                      </div>
                      <div className={`status-pill ${item.status.toLowerCase()}`} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>
                        {item.status.replace("_", " ")}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: "10px", margin: "1rem 0" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Service Type</span>
                        <strong style={{ display: "block", fontSize: "0.92rem" }}>{item.serviceType.replace("_", " ")}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Scheduled Date</span>
                        <strong style={{ display: "block", fontSize: "0.92rem" }}>{item.preferredDate} ({item.preferredTimeSlot || "N/A"})</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Estimated Cost</span>
                        <strong style={{ display: "block", fontSize: "0.92rem", color: "#059669" }}>
                          {item.estimatedCost ? `₹${item.estimatedCost.toLocaleString("en-IN")}` : "Under Inspection"}
                        </strong>
                      </div>
                    </div>

                    {isCancelled ? (
                      <div style={{ background: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "1rem", borderRadius: "8px", color: "#991b1b" }}>
                        <strong>Service Booking Cancelled</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "0.88rem" }}>{item.adminNotes || "This service booking was cancelled. Contact showroom for assistance."}</p>
                      </div>
                    ) : (
                      <div className="status-timeline" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingLeft: "0.5rem" }}>
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;
                          return (
                            <div key={step.key} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                              <div style={{
                                width: "30px", height: "30px", borderRadius: "50%",
                                background: isDone ? "#10b981" : isCurrent ? "#003b8f" : "#f1f5f9",
                                color: isDone || isCurrent ? "#ffffff" : "#64748b",
                                fontWeight: 700, fontSize: "0.85rem",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                              }}>
                                {isDone ? <Check size={16} /> : idx + 1}
                              </div>
                              <div>
                                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{step.label}</strong>
                                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboardPage;
