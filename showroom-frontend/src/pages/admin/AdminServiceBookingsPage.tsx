import React, { useCallback, useEffect, useState } from "react";
import {
  Wrench,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Phone,
  X,
} from "lucide-react";
import serviceBookingService from "../../services/serviceBookingService";
import type {
  ServiceBooking,
  ServiceBookingStatus,
} from "../../types/serviceBooking";

const AdminServiceBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected Booking for Modal Detail / Status Edit
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [editStatus, setEditStatus] = useState<ServiceBookingStatus>("PENDING");
  const [editCost, setEditCost] = useState<string>("");
  const [editAdminNotes, setEditAdminNotes] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState<ServiceBooking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await serviceBookingService.getAll(
        selectedStatus !== "ALL" ? selectedStatus : undefined,
        searchQuery.trim() || undefined
      );
      setBookings(data);
    } catch (err) {
      console.error("Failed to load service bookings:", err);
      setError("Failed to load service bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const openEditModal = (booking: ServiceBooking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditCost(booking.estimatedCost ? String(booking.estimatedCost) : "");
    setEditAdminNotes(booking.adminNotes || "");
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      const costNum = editCost ? parseFloat(editCost) : undefined;
      const updated = await serviceBookingService.updateStatus(selectedBooking.id, {
        status: editStatus,
        estimatedCost: costNum,
        adminNotes: editAdminNotes,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      setSelectedBooking(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update booking status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await serviceBookingService.delete(deleteTarget.id);
      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to delete service booking.");
    } finally {
      setDeleting(false);
    }
  };

  // Metrics counts
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const inProgressCount = bookings.filter((b) => b.status === "IN_PROGRESS").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="admin-page">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h1>Service Bookings</h1>
          <p>Manage customer vehicle service appointments and status updates.</p>
        </div>

        <button
          type="button"
          className="admin-secondary-btn"
          onClick={loadBookings}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* METRICS */}
      <div className="admin-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="admin-card" style={{ padding: "1rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Requests</span>
          <h3 style={{ fontSize: "1.5rem", margin: "4px 0 0" }}>{totalCount}</h3>
        </div>
        <div className="admin-card" style={{ padding: "1rem", borderLeft: "4px solid #f59e0b" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Pending</span>
          <h3 style={{ fontSize: "1.5rem", margin: "4px 0 0", color: "#d97706" }}>{pendingCount}</h3>
        </div>
        <div className="admin-card" style={{ padding: "1rem", borderLeft: "4px solid #3b82f6" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Confirmed</span>
          <h3 style={{ fontSize: "1.5rem", margin: "4px 0 0", color: "#2563eb" }}>{confirmedCount}</h3>
        </div>
        <div className="admin-card" style={{ padding: "1rem", borderLeft: "4px solid #8b5cf6" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>In Progress</span>
          <h3 style={{ fontSize: "1.5rem", margin: "4px 0 0", color: "#7c3aed" }}>{inProgressCount}</h3>
        </div>
        <div className="admin-card" style={{ padding: "1rem", borderLeft: "4px solid #10b981" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Completed</span>
          <h3 style={{ fontSize: "1.5rem", margin: "4px 0 0", color: "#059669" }}>{completedCount}</h3>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="admin-toolbar" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", justifyContent: "space-between", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search code, name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", paddingLeft: "38px", paddingRight: "12px", height: "40px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>

        {/* Status Filter */}
        <div className="admin-status-filters" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              type="button"
              className={`filter-btn ${selectedStatus === status ? "active" : ""}`}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #cbd5e1",
                background: selectedStatus === status ? "#1e293b" : "#fff",
                color: selectedStatus === status ? "#fff" : "#475569",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="admin-loading" style={{ textAlign: "center", padding: "3rem" }}>
          <RefreshCw size={28} className="spin" />
          <p style={{ marginTop: "0.5rem" }}>Loading service bookings...</p>
        </div>
      ) : error ? (
        <div className="admin-error" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
          <p>{error}</p>
          <button type="button" className="admin-primary-btn" onClick={loadBookings}>
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="admin-empty" style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Wrench size={40} color="#94a3b8" />
          <h3 style={{ marginTop: "1rem" }}>No Service Bookings Found</h3>
          <p style={{ color: "#64748b" }}>There are no bookings matching your criteria.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper" style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px" }}>Code</th>
                <th style={{ padding: "12px 16px" }}>Customer</th>
                <th style={{ padding: "12px 16px" }}>Vehicle & Service</th>
                <th style={{ padding: "12px 16px" }}>Preferred Date</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px" }}>Est. Cost</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2563eb" }}>
                    {booking.bookingCode}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600 }}>{booking.customerName}</div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{booking.phone}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600 }}>{booking.vehicleModel}</div>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                      {booking.serviceType.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
                    <div>{formatDate(booking.preferredDate)}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{booking.preferredTimeSlot || ""}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background:
                          booking.status === "COMPLETED"
                            ? "#d1fae5"
                            : booking.status === "IN_PROGRESS"
                            ? "#ede9fe"
                            : booking.status === "CONFIRMED"
                            ? "#dbeafe"
                            : booking.status === "CANCELLED"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          booking.status === "COMPLETED"
                            ? "#065f46"
                            : booking.status === "IN_PROGRESS"
                            ? "#5b21b6"
                            : booking.status === "CONFIRMED"
                            ? "#1e40af"
                            : booking.status === "CANCELLED"
                            ? "#991b1b"
                            : "#92400e",
                      }}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                    {booking.estimatedCost ? `₹${booking.estimatedCost.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        onClick={() => openEditModal(booking)}
                        title="Manage Booking & Status"
                        style={{ padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => setDeleteTarget(booking)}
                        title="Delete Booking"
                        style={{ padding: "6px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT / VIEW MODAL */}
      {selectedBooking && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !updating) setSelectedBooking(null);
          }}
          style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
        >
          <div
            className="admin-modal"
            style={{ background: "#fff", borderRadius: "12px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>BOOKING DETAILS</span>
                <h2 style={{ fontSize: "1.25rem", margin: "2px 0 0" }}>{selectedBooking.bookingCode}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Customer & Vehicle Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Customer</span>
                <strong style={{ display: "block" }}>{selectedBooking.customerName}</strong>
                <a href={`tel:${selectedBooking.phone}`} style={{ fontSize: "0.85rem", color: "#2563eb" }}>
                  <Phone size={12} style={{ display: "inline", marginRight: "4px" }} /> {selectedBooking.phone}
                </a>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Vehicle</span>
                <strong style={{ display: "block" }}>{selectedBooking.vehicleModel}</strong>
                {selectedBooking.registrationNumber && (
                  <span style={{ fontSize: "0.8rem", color: "#475569" }}>Reg: {selectedBooking.registrationNumber}</span>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div style={{ marginBottom: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Service Type</span>
                  <strong style={{ display: "block" }}>{selectedBooking.serviceType.replace("_", " ")}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Scheduled Date & Time</span>
                  <strong style={{ display: "block" }}>{formatDate(selectedBooking.preferredDate)} ({selectedBooking.preferredTimeSlot || "N/A"})</strong>
                </div>
              </div>
              {selectedBooking.notes && (
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed #cbd5e1" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Customer Notes:</span>
                  <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#334155" }}>{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* STATUS & COST UPDATE FORM */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Update Service Progress</h3>

              {/* Status Select */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>
                  Service Stage Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ServiceBookingStatus)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontWeight: 600 }}
                >
                  <option value="PENDING">PENDING (Request Received)</option>
                  <option value="CONFIRMED">CONFIRMED (Appointment Booked)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Currently Servicing)</option>
                  <option value="COMPLETED">COMPLETED (Ready for Pickup)</option>
                  <option value="CANCELLED">CANCELLED (Service Cancelled)</option>
                </select>
              </div>

              {/* Estimated Cost */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>
                  Estimated Service Cost (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1250"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              {/* Technician Notes */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>
                  Technician / Admin Notes (Visible to Customer on Tracker)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Oil changed, brake pads replaced. Vehicle washed and ready."
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                className="admin-secondary-btn"
                onClick={() => setSelectedBooking(null)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={handleUpdateStatus}
                disabled={updating}
                style={{ background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                {updating ? "Saving Changes..." : "Save Updates"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) setDeleteTarget(null);
          }}
          style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
        >
          <div className="admin-modal" style={{ background: "#fff", borderRadius: "12px", maxWidth: "450px", width: "100%", padding: "1.5rem", textAlign: "center" }}>
            <Trash2 size={36} color="#ef4444" style={{ margin: "0 auto 1rem" }} />
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Delete Service Booking?</h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Are you sure you want to delete the booking code <strong>{deleteTarget.bookingCode}</strong> for {deleteTarget.customerName}?
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                className="admin-secondary-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: "#ef4444", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminServiceBookingsPage;
