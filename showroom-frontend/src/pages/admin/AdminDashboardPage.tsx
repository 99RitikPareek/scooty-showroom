import { useEffect, useState } from "react";
import {
  Bike,
  CheckCircle2,
  Star,
  Plus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CalendarCheck,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

import vehicleService from "../../services/vehicleService";
import testRideService from "../../services/testRideService";
import enquiryService from "../../services/enquiryService";

import type { Vehicle } from "../../types/vehicle";
import type { TestRideResponse } from "../../types/testRide";
import type { EnquiryResponse } from "../../types/enquiry";
import { getErrorMessage } from "../../utils/errorUtils";

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  featuredVehicles: number;
  totalTestRides: number;
  pendingTestRides: number;
  totalEnquiries: number;
  pendingEnquiries: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    featuredVehicles: 0,
    totalTestRides: 0,
    pendingTestRides: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
  });

  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);
  const [recentTestRides, setRecentTestRides] = useState<TestRideResponse[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [vehiclesRes, testRidesRes, enquiriesRes] = await Promise.allSettled([
        vehicleService.getAll(),
        testRideService.getAll(),
        enquiryService.getAll(),
      ]);

      const vehicles = vehiclesRes.status === "fulfilled" ? vehiclesRes.value : [];
      const testRides = testRidesRes.status === "fulfilled" ? testRidesRes.value : [];
      const enquiries = enquiriesRes.status === "fulfilled" ? enquiriesRes.value : [];

      if (
        vehiclesRes.status === "rejected" &&
        testRidesRes.status === "rejected" &&
        enquiriesRes.status === "rejected"
      ) {
        setError(getErrorMessage(vehiclesRes.reason, "Unable to load dashboard data."));
      }

      setStats({
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter((v) => v.available).length,
        featuredVehicles: vehicles.filter((v) => v.featured).length,
        totalTestRides: testRides.length,
        pendingTestRides: testRides.filter((tr) => (tr.status || "PENDING").toUpperCase() === "PENDING").length,
        totalEnquiries: enquiries.length,
        pendingEnquiries: enquiries.filter((e) => (e.status || "PENDING").toUpperCase() === "PENDING").length,
      });

      setRecentVehicles(
        [...vehicles]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5)
      );

      setRecentTestRides(
        [...testRides]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5)
      );

      setRecentEnquiries(
        [...enquiries]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5)
      );
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(getErrorMessage(err, "Unable to load dashboard data. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <main className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">SHOWROOM OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Manage your showroom operations, inventory, test rides, and enquiries from one place.</p>
        </div>

        <div className="admin-page-header-actions">
          <button
            type="button"
            className="admin-icon-btn"
            onClick={loadDashboard}
            title="Refresh dashboard"
          >
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>

          <Link to="/admin/vehicles/new" className="admin-primary-btn">
            <Plus size={18} />
            Add Vehicle
          </Link>
        </div>
      </div>

      <section className="admin-dashboard-content">
        {/* ERROR */}
        {error && (
          <div className="admin-dashboard-error">
            <AlertCircle size={19} />
            <span>{error}</span>
            <button type="button" onClick={loadDashboard}>
              Try Again
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Bike size={23} />
            </div>
            <div>
              <span>Total Vehicles</span>
              <strong>{loading ? "—" : stats.totalVehicles}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <CheckCircle2 size={23} />
            </div>
            <div>
              <span>Available</span>
              <strong>{loading ? "—" : stats.availableVehicles}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Star size={23} />
            </div>
            <div>
              <span>Featured</span>
              <strong>{loading ? "—" : stats.featuredVehicles}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <CalendarCheck size={23} />
            </div>
            <div>
              <span>Test Rides</span>
              <strong>
                {loading ? "—" : stats.totalTestRides}
                {!loading && stats.pendingTestRides > 0 && (
                  <span style={{ fontSize: "0.85rem", color: "#f59e0b", marginLeft: "6px" }}>
                    ({stats.pendingTestRides} pending)
                  </span>
                )}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <MessageSquare size={23} />
            </div>
            <div>
              <span>Enquiries</span>
              <strong>
                {loading ? "—" : stats.totalEnquiries}
                {!loading && stats.pendingEnquiries > 0 && (
                  <span style={{ fontSize: "0.85rem", color: "#f59e0b", marginLeft: "6px" }}>
                    ({stats.pendingEnquiries} pending)
                  </span>
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <section className="admin-dashboard-section">
          <div className="admin-section-heading">
            <div>
              <span>QUICK ACTIONS</span>
              <h2>Manage Showroom</h2>
            </div>
          </div>

          <div className="admin-quick-actions">
            <Link to="/admin/vehicles" className="admin-action-card">
              <div>
                <Bike size={22} />
              </div>
              <section>
                <h3>Manage Vehicles</h3>
                <p>Add, edit and manage showroom vehicles.</p>
              </section>
              <ArrowRight size={19} />
            </Link>

            <Link to="/admin/test-rides" className="admin-action-card">
              <div>
                <CalendarCheck size={22} />
              </div>
              <section>
                <h3>Test Rides</h3>
                <p>View and update customer test ride requests.</p>
              </section>
              <ArrowRight size={19} />
            </Link>

            <Link to="/admin/enquiries" className="admin-action-card">
              <div>
                <MessageSquare size={22} />
              </div>
              <section>
                <h3>Customer Enquiries</h3>
                <p>View and manage customer enquiries.</p>
              </section>
              <ArrowRight size={19} />
            </Link>
          </div>
        </section>

        {/* RECENT TEST RIDES & ENQUIRIES GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* RECENT TEST RIDES */}
          <section className="admin-dashboard-section" style={{ margin: 0 }}>
            <div className="admin-section-heading">
              <div>
                <span>APPOINTMENTS</span>
                <h2>Recent Test Rides</h2>
              </div>
              <Link to="/admin/test-rides" className="admin-view-all">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="admin-recent-card" style={{ padding: "1rem" }}>
              {loading ? (
                <div className="admin-dashboard-empty">Loading test rides...</div>
              ) : recentTestRides.length === 0 ? (
                <div className="admin-dashboard-empty">No test ride requests found.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {recentTestRides.map((ride) => (
                    <div key={ride.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "8px", background: "var(--bg-secondary, #f8fafc)", border: "1px solid var(--border-color, #e2e8f0)" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.95rem" }}>{ride.customerName}</strong>
                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          {ride.vehicleName || `Vehicle #${ride.vehicleId}`} • {formatDate(ride.preferredDate)}
                        </span>
                      </div>
                      <span className={`admin-badge ${(ride.status || "PENDING").toLowerCase()}`}>
                        {ride.status || "PENDING"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RECENT ENQUIRIES */}
          <section className="admin-dashboard-section" style={{ margin: 0 }}>
            <div className="admin-section-heading">
              <div>
                <span>INQUIRIES</span>
                <h2>Recent Enquiries</h2>
              </div>
              <Link to="/admin/enquiries" className="admin-view-all">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="admin-recent-card" style={{ padding: "1rem" }}>
              {loading ? (
                <div className="admin-dashboard-empty">Loading enquiries...</div>
              ) : recentEnquiries.length === 0 ? (
                <div className="admin-dashboard-empty">No customer enquiries found.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {recentEnquiries.map((enquiry) => (
                    <div key={enquiry.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "8px", background: "var(--bg-secondary, #f8fafc)", border: "1px solid var(--border-color, #e2e8f0)" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.95rem" }}>{enquiry.customerName}</strong>
                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          {enquiry.vehicleName || `Vehicle #${enquiry.vehicleId}`} • <Phone size={12} style={{ display: "inline", verticalAlign: "middle" }} /> {enquiry.phone}
                        </span>
                      </div>
                      <span className={`admin-badge ${(enquiry.status || "PENDING").toLowerCase()}`}>
                        {enquiry.status || "PENDING"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RECENT VEHICLES */}
        <section className="admin-dashboard-section">
          <div className="admin-section-heading">
            <div>
              <span>INVENTORY</span>
              <h2>Recent Vehicles</h2>
            </div>
            <Link to="/admin/vehicles" className="admin-view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="admin-recent-card">
            {loading ? (
              <div className="admin-dashboard-empty">Loading vehicles...</div>
            ) : recentVehicles.length === 0 ? (
              <div className="admin-dashboard-empty">
                <Bike size={35} />
                <h3>No Vehicles Found</h3>
                <p>Add your first vehicle to start managing inventory.</p>
                <Link to="/admin/vehicles/new" className="btn btn-primary">
                  <Plus size={17} /> Add Vehicle
                </Link>
              </div>
            ) : (
              <div className="admin-vehicle-list">
                {recentVehicles.map((vehicle) => {
                  const image =
                    vehicle.images?.length > 0
                      ? vehicle.images.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))[0]?.imageUrl
                      : null;

                  return (
                    <Link key={vehicle.id} to={`/vehicles/${vehicle.id}`} className="admin-vehicle-row">
                      <div className="admin-vehicle-image">
                        {image ? <img src={image} alt={`${vehicle.brandName} ${vehicle.name}`} /> : <Bike size={24} />}
                      </div>

                      <div className="admin-vehicle-info">
                        <strong>
                          {vehicle.brandName} {vehicle.name}
                        </strong>
                        <span>
                          {vehicle.model}
                          {vehicle.variant ? ` • ${vehicle.variant}` : ""}
                        </span>
                      </div>

                      <div className="admin-vehicle-type">
                        <span className={vehicle.vehicleType === "NEW" ? "admin-badge new" : "admin-badge used"}>
                          {vehicle.vehicleType === "NEW" ? "NEW" : "PRE-OWNED"}
                        </span>
                      </div>

                      <strong className="admin-vehicle-price">
                        ₹{Number(vehicle.price).toLocaleString("en-IN")}
                      </strong>

                      <span className={vehicle.available ? "admin-availability available" : "admin-availability unavailable"}>
                        {vehicle.available ? "Available" : "Unavailable"}
                      </span>

                      <ArrowRight size={17} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
