import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Trash2,
  UserCircle,
  Bike,
  Mail,
  Phone,
  Eye,
  MessageSquare,
  CheckCircle2,
  Clock3,
  XCircle,
  X,
} from "lucide-react";

import enquiryService from "../../services/enquiryService";

import type {
  EnquiryResponse,
} from "../../types/enquiry";


const AdminEnquiriesPage = () => {

  const [
    enquiries,
    setEnquiries,
  ] = useState<EnquiryResponse[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    selectedEnquiry,
    setSelectedEnquiry,
  ] = useState<EnquiryResponse | null>(
    null
  );


  /* =====================================================
     LOAD ENQUIRIES
  ===================================================== */

  const loadEnquiries = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await enquiryService.getAll();

        setEnquiries(data);

      } catch (err) {

        console.error(
          "Admin Enquiries Error:",
          err
        );

        setEnquiries([]);

        setError(
          "Unable to load enquiries from the server."
        );

      } finally {

        setLoading(false);

      }

    },
    []
  );


  useEffect(() => {

    loadEnquiries();

  }, [loadEnquiries]);


  /* =====================================================
     FILTER
  ===================================================== */

  const filteredEnquiries =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      return enquiries.filter(
        (enquiry) => {

          const matchesSearch =
            !keyword ||
            enquiry.customerName
              ?.toLowerCase()
              .includes(keyword) ||
            enquiry.email
              ?.toLowerCase()
              .includes(keyword) ||
            enquiry.phone
              ?.toLowerCase()
              .includes(keyword) ||
            enquiry.vehicleName
              ?.toLowerCase()
              .includes(keyword) ||
            enquiry.message
              ?.toLowerCase()
              .includes(keyword);


          const matchesStatus =
            !statusFilter ||
            enquiry.status
              ?.toUpperCase() ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      enquiries,
      search,
      statusFilter,
    ]);


  /* =====================================================
     STATS
  ===================================================== */

  const stats =
    useMemo(() => {

      return {

        total:
          enquiries.length,

        pending:
          enquiries.filter(
            (item) =>
              item.status
                ?.toUpperCase() ===
              "PENDING"
          ).length,

        contacted:
          enquiries.filter(
            (item) =>
              item.status
                ?.toUpperCase() ===
              "CONTACTED"
          ).length,

        resolved:
          enquiries.filter(
            (item) =>
              item.status
                ?.toUpperCase() ===
              "RESOLVED"
          ).length,

        cancelled:
          enquiries.filter(
            (item) =>
              item.status
                ?.toUpperCase() ===
              "CANCELLED"
          ).length,

      };

    }, [enquiries]);


  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatusUpdate = async (item: EnquiryResponse, newStatus: string) => {
    try {
      const updated = await enquiryService.update(item.id, {
        vehicleId: item.vehicleId,
        customerName: item.customerName,
        email: item.email,
        phone: item.phone,
        message: item.message,
        status: newStatus,
      });

      setEnquiries((current) =>
        current.map((e) => (e.id === item.id ? updated : e))
      );

      if (selectedEnquiry?.id === item.id) {
        setSelectedEnquiry(updated);
      }
    } catch (err) {
      console.error("Update enquiry status error:", err);
      alert("Failed to update enquiry status. Please try again.");
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete =
    async (
      id: number
    ) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this enquiry?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await enquiryService.delete(
          id
        );

        setEnquiries(
          (current) =>
            current.filter(
              (item) =>
                item.id !== id
            )
        );

        if (
          selectedEnquiry?.id === id
        ) {
          setSelectedEnquiry(null);
        }

      } catch (err) {

        console.error(
          "Delete Enquiry Error:",
          err
        );

        window.alert(
          "Unable to delete this enquiry. Please try again."
        );

      }

    };





  /* =====================================================
     DATE
  ===================================================== */

  const formatDate =
    (
      date?: string | null
    ) => {

      if (!date) {
        return "—";
      }

      const parsedDate =
        new Date(date);

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


  return (

    <main className="admin-page admin-enquiries-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>
            Customer Enquiries
          </h1>

          <p>
            View and manage customer enquiries
            received from your showroom website.
          </p>

        </div>


        <div className="admin-page-header-actions">

          <button
            type="button"
            className="admin-icon-btn"
            onClick={loadEnquiries}
            title="Refresh enquiries"
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "spin"
                  : ""
              }
            />

          </button>

        </div>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      {!loading &&
        !error && (

          <div className="admin-test-ride-stats">

            {/* TOTAL */}

            <div className="admin-test-ride-stat">

              <div className="admin-test-ride-stat-icon">

                <MessageSquare
                  size={20}
                />

              </div>

              <div>

                <span>
                  Total Enquiries
                </span>

                <strong>
                  {stats.total}
                </strong>

              </div>

            </div>


            {/* PENDING */}

            <div className="admin-test-ride-stat">

              <div className="admin-test-ride-stat-icon pending">

                <Clock3
                  size={20}
                />

              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {stats.pending}
                </strong>

              </div>

            </div>


            {/* CONTACTED */}

            <div className="admin-test-ride-stat">

              <div className="admin-test-ride-stat-icon confirmed">

                <Phone
                  size={20}
                />

              </div>

              <div>

                <span>
                  Contacted
                </span>

                <strong>
                  {stats.contacted}
                </strong>

              </div>

            </div>


            {/* RESOLVED */}

            <div className="admin-test-ride-stat">

              <div className="admin-test-ride-stat-icon completed">

                <CheckCircle2
                  size={20}
                />

              </div>

              <div>

                <span>
                  Resolved
                </span>

                <strong>
                  {stats.resolved}
                </strong>

              </div>

            </div>


            {/* CANCELLED */}

            <div className="admin-test-ride-stat">

              <div className="admin-test-ride-stat-icon cancelled">

                <XCircle
                  size={20}
                />

              </div>

              <div>

                <span>
                  Cancelled
                </span>

                <strong>
                  {stats.cancelled}
                </strong>

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
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div className="admin-filter-select">

          <label>
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="CONTACTED">
              Contacted
            </option>

            <option value="RESOLVED">
              Resolved
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

      {!loading &&
        !error && (

          <div className="admin-result-info">

            Showing{" "}

            <strong>
              {
                filteredEnquiries.length
              }
            </strong>

            {" "}of{" "}

            <strong>
              {enquiries.length}
            </strong>

            {" "}enquiries

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
            Loading Enquiries
          </h2>

          <p>
            Fetching customer enquiries
            from the backend.
          </p>

        </section>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {!loading &&
        error && (

          <section className="admin-state-card admin-error-state">

            <XCircle
              size={42}
            />

            <h2>
              Unable to Load Enquiries
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="admin-primary-btn"
              onClick={
                loadEnquiries
              }
            >

              <RefreshCw
                size={17}
              />

              Try Again

            </button>

          </section>

        )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        filteredEnquiries.length === 0 && (

          <section className="admin-state-card">

            <MessageSquare
              size={42}
            />

            <h2>

              {enquiries.length === 0
                ? "No Enquiries Found"
                : "No Matching Enquiries"}

            </h2>

            <p>

              {enquiries.length === 0
                ? "Customer enquiries will appear here once submitted."
                : "Try changing your search or status filter."}

            </p>

          </section>

        )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        !error &&
        filteredEnquiries.length > 0 && (

          <section className="admin-table-card">

            <div className="admin-table-wrapper">

              <table className="admin-test-rides-table">

                <thead>

                  <tr>

                    <th>
                      Customer
                    </th>

                    <th>
                      Vehicle
                    </th>

                    <th>
                      Contact
                    </th>

                    <th>
                      Message
                    </th>

                    <th>
                      Received
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredEnquiries.map(
                    (enquiry) => (

                      <tr
                        key={
                          enquiry.id
                        }
                      >

                        {/* CUSTOMER */}

                        <td>

                          <div className="admin-test-ride-customer">

                            <div className="admin-test-ride-avatar">

                              <UserCircle
                                size={22}
                              />

                            </div>

                            <div>

                              <strong>
                                {
                                  enquiry.customerName
                                }
                              </strong>

                              <span>
                                {
                                  enquiry.email
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* VEHICLE */}

                        <td>

                          <div className="admin-test-ride-vehicle">

                            <div className="admin-test-ride-vehicle-icon">

                              <Bike
                                size={19}
                              />

                            </div>

                            <div>

                              <strong>

                                {
                                  enquiry.vehicleName ||
                                  `Vehicle #${enquiry.vehicleId}`
                                }

                              </strong>

                              <span>

                                ID #
                                {
                                  enquiry.vehicleId
                                }

                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td>

                          <div className="admin-test-ride-contact">

                            <a
                              href={`tel:${enquiry.phone}`}
                            >

                              <Phone
                                size={14}
                              />

                              {
                                enquiry.phone
                              }

                            </a>


                            <a
                              href={`mailto:${enquiry.email}`}
                            >

                              <Mail
                                size={14}
                              />

                              Email

                            </a>

                          </div>

                        </td>


                        {/* MESSAGE */}

                        <td>

                          <div className="admin-enquiry-message">

                            {enquiry.message
                              ? enquiry.message
                              : "No message"}

                          </div>

                        </td>


                        {/* DATE */}

                        <td>

                          <div className="admin-enquiry-date">

                            <strong>
                              {
                                formatDate(
                                  enquiry.createdAt
                                )
                              }
                            </strong>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td>

                          <select
                            value={enquiry.status || "NEW"}
                            onChange={(e) => handleStatusUpdate(enquiry, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border-color, #cbd5e1)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <option value="NEW">New</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-action-btn view"
                              title="View enquiry"
                              onClick={() =>
                                setSelectedEnquiry(
                                  enquiry
                                )
                              }
                            >

                              <Eye
                                size={17}
                              />

                            </button>


                            <button
                              type="button"
                              className="admin-action-btn delete"
                              title="Delete enquiry"
                              onClick={() =>
                                handleDelete(
                                  enquiry.id
                                )
                              }
                            >

                              <Trash2
                                size={17}
                              />

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
          VIEW MODAL
      ================================================= */}

      {selectedEnquiry && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedEnquiry(
              null
            )
          }
        >

          <div
            className="admin-enquiry-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span>
                  CUSTOMER ENQUIRY
                </span>

                <h2>
                  Enquiry Details
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedEnquiry(
                    null
                  )
                }
                className="admin-modal-close"
              >

                <X
                  size={19}
                />

              </button>

            </div>


            <div className="admin-modal-content">

              <div className="admin-enquiry-detail-grid">

                <div>

                  <span>
                    Customer
                  </span>

                  <strong>
                    {
                      selectedEnquiry.customerName
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Vehicle
                  </span>

                  <strong>
                    {
                      selectedEnquiry.vehicleName ||
                      `Vehicle #${selectedEnquiry.vehicleId}`
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Email
                  </span>

                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                  >
                    {
                      selectedEnquiry.email
                    }
                  </a>

                </div>


                <div>

                  <span>
                    Phone
                  </span>

                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                  >
                    {
                      selectedEnquiry.phone
                    }
                  </a>

                </div>


                <div>

                  <span>
                    Status
                  </span>

                  <select
                    value={selectedEnquiry.status || "PENDING"}
                    onChange={(e) => handleStatusUpdate(selectedEnquiry, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: "4px",
                    }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                </div>


                <div>

                  <span>
                    Received
                  </span>

                  <strong>
                    {
                      formatDate(
                        selectedEnquiry.createdAt
                      )
                    }
                  </strong>

                </div>

              </div>


              <div className="admin-enquiry-detail-message">

                <span>
                  Customer Message
                </span>

                <p>

                  {selectedEnquiry.message ||
                    "No message provided by the customer."}

                </p>

              </div>

            </div>


            <div className="admin-modal-footer">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={() =>
                  setSelectedEnquiry(
                    null
                  )
                }
              >
                Close
              </button>

              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="admin-primary-btn"
              >
                <Phone size={17} />
                Contact Customer
              </a>

            </div>

          </div>

        </div>

      )}

    </main>

  );
};

export default AdminEnquiriesPage;