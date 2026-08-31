import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Clock3,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserCircle,
  Bike,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  MessageSquare,
  CalendarDays,
} from "lucide-react";

import testRideService from "../../services/testRideService";
import type { TestRideResponse } from "../../types/testRide";

const AdminTestRidesPage = () => {
  const [testRides, setTestRides] = useState<TestRideResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedRide, setSelectedRide] =
    useState<TestRideResponse | null>(null);

  const [deleteRide, setDeleteRide] =
    useState<TestRideResponse | null>(null);

  const [deleting, setDeleting] = useState(false);

  /* =====================================================
     LOAD TEST RIDES
  ===================================================== */

  const loadTestRides = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await testRideService.getAll();

      setTestRides(data);
    } catch (err) {
      console.error("Admin Test Rides Error:", err);

      setTestRides([]);

      setError(
        "Unable to load test ride requests from the server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestRides();
  }, [loadTestRides]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredTestRides = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return testRides.filter((ride) => {
      const matchesSearch =
        !keyword ||
        ride.customerName
          ?.toLowerCase()
          .includes(keyword) ||
        ride.email
          ?.toLowerCase()
          .includes(keyword) ||
        ride.phone
          ?.toLowerCase()
          .includes(keyword) ||
        ride.vehicleName
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        !statusFilter ||
        ride.status?.toUpperCase() ===
          statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [testRides, search, statusFilter]);

  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    return {
      total: testRides.length,

      pending: testRides.filter(
        (ride) =>
          ride.status?.toUpperCase() === "PENDING"
      ).length,

      confirmed: testRides.filter(
        (ride) =>
          ride.status?.toUpperCase() === "CONFIRMED"
      ).length,

      completed: testRides.filter(
        (ride) =>
          ride.status?.toUpperCase() === "COMPLETED"
      ).length,

      cancelled: testRides.filter(
        (ride) =>
          ride.status?.toUpperCase() === "CANCELLED"
      ).length,
    };
  }, [testRides]);

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatusUpdate = async (ride: TestRideResponse, newStatus: string) => {
    try {
      const updated = await testRideService.update(ride.id, {
        vehicleId: ride.vehicleId,
        customerName: ride.customerName,
        email: ride.email,
        phone: ride.phone,
        preferredDate: ride.preferredDate,
        preferredTime: ride.preferredTime ?? undefined,
        message: ride.message ?? undefined,
        status: newStatus,
      });

      setTestRides((current) =>
        current.map((item) => (item.id === ride.id ? updated : item))
      );

      if (selectedRide?.id === ride.id) {
        setSelectedRide(updated);
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async () => {
    if (!deleteRide) {
      return;
    }

    try {
      setDeleting(true);

      await testRideService.delete(deleteRide.id);

      setTestRides((current) =>
        current.filter(
          (ride) => ride.id !== deleteRide.id
        )
      );

      setDeleteRide(null);

      if (selectedRide?.id === deleteRide.id) {
        setSelectedRide(null);
      }
    } catch (err) {
      console.error(
        "Delete Test Ride Error:",
        err
      );

      alert(
        "Unable to delete this test ride request. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };



  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     CREATED DATE
  ===================================================== */

  const formatDateTime = (
    date?: string | null
  ) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="admin-page admin-test-rides-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>
          <span className="admin-page-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>Test Ride Requests</h1>

          <p>
            View and manage customer test ride
            requests and showroom appointments.
          </p>
        </div>

        <div className="admin-page-header-actions">

          <button
            type="button"
            className="admin-icon-btn"
            onClick={loadTestRides}
            title="Refresh test rides"
          >
            <RefreshCw
              size={18}
              className={
                loading ? "spin" : ""
              }
            />
          </button>

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      {!loading && !error && (
        <div className="admin-test-ride-stats">

          <div className="admin-test-ride-stat">
            <div className="admin-test-ride-stat-icon">
              <CalendarCheck size={20} />
            </div>

            <div>
              <span>Total Requests</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="admin-test-ride-stat">
            <div className="admin-test-ride-stat-icon pending">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className="admin-test-ride-stat">
            <div className="admin-test-ride-stat-icon confirmed">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Confirmed</span>
              <strong>{stats.confirmed}</strong>
            </div>
          </div>

          <div className="admin-test-ride-stat">
            <div className="admin-test-ride-stat-icon completed">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>

          <div className="admin-test-ride-stat">
            <div className="admin-test-ride-stat-icon cancelled">
              <XCircle size={20} />
            </div>

            <div>
              <span>Cancelled</span>
              <strong>{stats.cancelled}</strong>
            </div>
          </div>

        </div>
      )}

      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="admin-filter-card">

        <div className="admin-search-box">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search customer, vehicle, email, phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

        <div className="admin-filter-select">

          <label htmlFor="testRideStatus">
            Status
          </label>

          <select
            id="testRideStatus"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

        </div>

      </section>

      {/* =================================================
          RESULT COUNT
      ================================================= */}

      {!loading && !error && (
        <div className="admin-result-info">

          <span>
            Showing{" "}
            <strong>
              {filteredTestRides.length}
            </strong>{" "}
            of{" "}
            <strong>
              {testRides.length}
            </strong>{" "}
            test ride requests
          </span>

          {(search || statusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="admin-clear-filters"
            >
              Clear Filters
            </button>
          )}

        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <section className="admin-state-card">

          <RefreshCw
            size={38}
            className="spin"
          />

          <h2>
            Loading Test Rides
          </h2>

          <p>
            Fetching test ride requests from
            the backend.
          </p>

        </section>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <section className="admin-state-card admin-error-state">

          <XCircle size={42} />

          <h2>
            Unable to Load Test Rides
          </h2>

          <p>{error}</p>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={loadTestRides}
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </section>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        filteredTestRides.length === 0 && (
          <section className="admin-state-card">

            <CalendarCheck size={42} />

            <h2>
              {testRides.length === 0
                ? "No Test Ride Requests"
                : "No Matching Requests"}
            </h2>

            <p>
              {testRides.length === 0
                ? "There are no customer test ride requests yet."
                : "Try changing your search or status filter."}
            </p>

          </section>
        )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        !error &&
        filteredTestRides.length > 0 && (
          <section className="admin-table-card">

            <div className="admin-table-wrapper">

              <table className="admin-test-rides-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Schedule</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTestRides.map(
                    (ride) => (

                      <tr key={ride.id}>

                        {/* CUSTOMER */}

                        <td>

                          <div className="admin-test-ride-customer">

                            <div className="admin-test-ride-avatar">
                              <UserCircle size={22} />
                            </div>

                            <div>

                              <strong>
                                {ride.customerName}
                              </strong>

                              <span>
                                {ride.email}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* VEHICLE */}

                        <td>

                          <div className="admin-test-ride-vehicle">

                            <div className="admin-test-ride-vehicle-icon">
                              <Bike size={19} />
                            </div>

                            <div>

                              <strong>
                                {ride.vehicleName ||
                                  `Vehicle #${ride.vehicleId}`}
                              </strong>

                              <span>
                                ID #{ride.vehicleId}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* SCHEDULE */}

                        <td>

                          <div className="admin-test-ride-schedule">

                            <strong>
                              {formatDate(
                                ride.preferredDate
                              )}
                            </strong>

                            <span>
                              <Clock3 size={14} />

                              {ride.preferredTime ||
                                "Time not specified"}
                            </span>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td>

                          <div className="admin-test-ride-contact">

                            <a
                              href={`tel:${ride.phone}`}
                              title="Call customer"
                            >
                              <Phone size={14} />
                              {ride.phone}
                            </a>

                            <a
                              href={`mailto:${ride.email}`}
                              title="Send email"
                            >
                              <Mail size={14} />
                              Email
                            </a>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td>

                          <select
                            value={ride.status || "PENDING"}
                            onChange={(e) => handleStatusUpdate(ride, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border-color, #cbd5e1)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-action-btn view"
                              title="View request"
                              onClick={() =>
                                setSelectedRide(ride)
                              }
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn delete"
                              title="Delete request"
                              onClick={() =>
                                setDeleteRide(ride)
                              }
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedRide && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              setSelectedRide(null);
            }
          }}
        >

          <div
            className="admin-modal admin-test-ride-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="testRideDetailsTitle"
          >

            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>
                <span>
                  TEST RIDE REQUEST
                </span>

                <h2 id="testRideDetailsTitle">
                  Request Details
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedRide(null)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* CUSTOMER */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">
                <UserCircle size={18} />
                <span>Customer Information</span>
              </div>

              <div className="admin-detail-grid">

                <div className="admin-detail-item">

                  <span>Name</span>

                  <strong>
                    {selectedRide.customerName}
                  </strong>

                </div>

                <div className="admin-detail-item">

                  <span>Phone</span>

                  <a
                    href={`tel:${selectedRide.phone}`}
                  >
                    <Phone size={14} />
                    {selectedRide.phone}
                  </a>

                </div>

                <div className="admin-detail-item">

                  <span>Email</span>

                  <a
                    href={`mailto:${selectedRide.email}`}
                  >
                    <Mail size={14} />
                    {selectedRide.email}
                  </a>

                </div>

              </div>

            </div>

            {/* VEHICLE */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">
                <Bike size={18} />
                <span>Vehicle Information</span>
              </div>

              <div className="admin-modal-vehicle">

                <div className="admin-modal-vehicle-icon">
                  <Bike size={24} />
                </div>

                <div>

                  <strong>
                    {selectedRide.vehicleName ||
                      `Vehicle #${selectedRide.vehicleId}`}
                  </strong>

                  <span>
                    Vehicle ID #{selectedRide.vehicleId}
                  </span>

                </div>

              </div>

            </div>

            {/* APPOINTMENT */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">
                <CalendarDays size={18} />
                <span>Appointment Details</span>
              </div>

              <div className="admin-detail-grid">

                <div className="admin-detail-item">

                  <span>Preferred Date</span>

                  <strong>
                    {formatDate(
                      selectedRide.preferredDate
                    )}
                  </strong>

                </div>

                <div className="admin-detail-item">

                  <span>Preferred Time</span>

                  <strong>
                    {selectedRide.preferredTime ||
                      "Not specified"}
                  </strong>

                </div>

                <div className="admin-detail-item">

                  <span>Status</span>

                  <select
                    value={selectedRide.status || "PENDING"}
                    onChange={(e) => handleStatusUpdate(selectedRide, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                </div>

              </div>

            </div>

            {/* MESSAGE */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">
                <MessageSquare size={18} />
                <span>Customer Message</span>
              </div>

              <div className="admin-message-box">

                {selectedRide.message ||
                  "No message provided by the customer."}

              </div>

            </div>

            {/* CREATED */}

            <div className="admin-modal-created">

              Request created:{" "}
              <strong>
                {formatDateTime(
                  selectedRide.createdAt
                )}
              </strong>

            </div>

            {/* FOOTER */}

            <div className="admin-modal-footer">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={() =>
                  setSelectedRide(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="admin-danger-btn"
                onClick={() => {
                  setDeleteRide(selectedRide);
                  setSelectedRide(null);
                }}
              >
                <Trash2 size={16} />
                Delete Request
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deleteRide && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleting
            ) {
              setDeleteRide(null);
            }
          }}
        >

          <div
            className="admin-modal admin-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deleteRideTitle"
          >

            <div className="admin-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2 id="deleteRideTitle">
              Delete Test Ride Request?
            </h2>

            <p>
              Are you sure you want to delete the
              test ride request from{" "}
              <strong>
                {deleteRide.customerName}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="admin-modal-footer">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={() =>
                  setDeleteRide(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-danger-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Request
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
};

export default AdminTestRidesPage;