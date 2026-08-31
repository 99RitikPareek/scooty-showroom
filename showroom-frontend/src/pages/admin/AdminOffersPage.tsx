import {
  BadgePercent,
  CalendarDays,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Bike,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import offerService from "../../services/offerService";

import type {
  OfferResponse,
} from "../../types/offer";

const AdminOffersPage = () => {
  const navigate = useNavigate();

  const [offers, setOffers] =
    useState<OfferResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  /* ================= LOAD OFFERS ================= */

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await offerService.getAll();

      setOffers(data);
    } catch (err) {
      console.error(
        "Admin Offers Error:",
        err
      );

      setOffers([]);

      setError(
        "Unable to load offers from the server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  /* ================= FILTER ================= */

  const filteredOffers = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesSearch =
        !keyword ||
        offer.title
          ?.toLowerCase()
          .includes(keyword) ||
        offer.description
          ?.toLowerCase()
          .includes(keyword) ||
        offer.vehicleName
          ?.toLowerCase()
          .includes(keyword) ||
        offer.discountType
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "ACTIVE"
          ? offer.active === true
          : offer.active === false);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    offers,
    search,
    statusFilter,
  ]);

  /* ================= STATS ================= */

  const stats = useMemo(() => {
    const active = offers.filter(
      (offer) => offer.active
    ).length;

    return {
      total: offers.length,
      active,
      inactive:
        offers.length - active,
    };
  }, [offers]);

  /* ================= DELETE ================= */

  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this offer?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await offerService.delete(id);

      setOffers((current) =>
        current.filter(
          (offer) => offer.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Offer Error:",
        err
      );

      window.alert(
        "Unable to delete this offer. Please try again."
      );
    }
  };

  /* ================= DATE ================= */

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

  /* ================= DISCOUNT ================= */

  const formatDiscount = (
    offer: OfferResponse
  ) => {
    const value =
      Number(offer.discountValue);

    if (
      offer.discountType
        ?.toUpperCase() === "PERCENTAGE"
    ) {
      return `${value}% OFF`;
    }

    if (
      offer.discountType
        ?.toUpperCase() === "FIXED"
    ) {
      return `₹${value.toLocaleString(
        "en-IN"
      )} OFF`;
    }

    return `${value.toLocaleString(
      "en-IN"
    )} ${offer.discountType || ""}`;
  };

  return (
    <main className="admin-page admin-offers-page">

      {/* ================= HEADER ================= */}

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            OFFER MANAGEMENT
          </span>

          <h1>
            Offers & Promotions
          </h1>

          <p>
            Create and manage promotional
            offers for your showroom.
          </p>

        </div>

        <div className="admin-page-header-actions">

          <button
            type="button"
            className="admin-icon-btn"
            onClick={loadOffers}
            title="Refresh offers"
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

          <button
            type="button"
            className="admin-primary-btn"
            onClick={() =>
              navigate(
                "/admin/offers/new"
              )
            }
          >
            <Plus size={17} />
            Create Offer
          </button>

        </div>

      </div>

      {/* ================= STATS ================= */}

      {!loading && !error && (
        <div className="admin-offer-stats">

          <div className="admin-offer-stat-card">

            <div className="admin-offer-stat-icon">
              <BadgePercent size={21} />
            </div>

            <div>
              <span>
                Total Offers
              </span>

              <strong>
                {stats.total}
              </strong>
            </div>

          </div>

          <div className="admin-offer-stat-card">

            <div className="admin-offer-stat-icon active">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>
                Active Offers
              </span>

              <strong>
                {stats.active}
              </strong>
            </div>

          </div>

          <div className="admin-offer-stat-card">

            <div className="admin-offer-stat-icon inactive">
              <XCircle size={21} />
            </div>

            <div>
              <span>
                Inactive Offers
              </span>

              <strong>
                {stats.inactive}
              </strong>
            </div>

          </div>

        </div>
      )}

      {/* ================= FILTER ================= */}

      <section className="admin-filter-card">

        <div className="admin-search-box">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search offer, vehicle, discount..."
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

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

          </select>

        </div>

      </section>

      {/* ================= RESULT COUNT ================= */}

      {!loading && !error && (
        <div className="admin-result-info">

          <span>
            Showing{" "}
            <strong>
              {filteredOffers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {offers.length}
            </strong>{" "}
            offers
          </span>

        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading && (
        <section className="admin-state-card">

          <RefreshCw
            size={38}
            className="spin"
          />

          <h2>
            Loading Offers
          </h2>

          <p>
            Fetching promotional offers
            from the backend.
          </p>

        </section>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <section className="admin-state-card admin-error-state">

          <XCircle size={42} />

          <h2>
            Unable to Load Offers
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={loadOffers}
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </section>
      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        !error &&
        filteredOffers.length === 0 && (
          <section className="admin-state-card">

            <BadgePercent size={42} />

            <h2>
              {offers.length === 0
                ? "No Offers Found"
                : "No Matching Offers"}
            </h2>

            <p>
              {offers.length === 0
                ? "Create your first promotional offer."
                : "Try changing your search or status filter."}
            </p>

            {offers.length === 0 && (
              <button
                type="button"
                className="admin-primary-btn"
                onClick={() =>
                  navigate(
                    "/admin/offers/new"
                  )
                }
              >
                <Plus size={17} />
                Create Offer
              </button>
            )}

          </section>
        )}

      {/* ================= OFFERS ================= */}

      {!loading &&
        !error &&
        filteredOffers.length > 0 && (

          <section className="admin-offers-grid">

            {filteredOffers.map(
              (offer) => (

                <article
                  key={offer.id}
                  className="admin-offer-card"
                >

                  {/* TOP */}

                  <div className="admin-offer-card-top">

                    <div className="admin-offer-icon">
                      <BadgePercent
                        size={23}
                      />
                    </div>

                    <span
                      className={
                        offer.active
                          ? "admin-offer-status active"
                          : "admin-offer-status inactive"
                      }
                    >
                      {offer.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="admin-offer-card-content">

                    <h2>
                      {offer.title}
                    </h2>

                    <p>
                      {offer.description ||
                        "No description available."}
                    </p>

                    <strong className="admin-offer-discount">
                      {formatDiscount(
                        offer
                      )}
                    </strong>

                  </div>

                  {/* VEHICLE */}

                  <div className="admin-offer-vehicle">

                    <Bike size={16} />

                    <span>
                      {offer.vehicleName ||
                        `Vehicle #${offer.vehicleId}`}
                    </span>

                  </div>

                  {/* DATE */}

                  <div className="admin-offer-date">

                    <CalendarDays
                      size={16}
                    />

                    <span>
                      {formatDate(
                        offer.startDate
                      )}
                      {" — "}
                      {formatDate(
                        offer.endDate
                      )}
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="admin-offer-actions">

                    <button
                      type="button"
                      className="admin-action-btn view"
                      title="Edit offer"
                      onClick={() =>
                        navigate(
                          `/admin/offers/${offer.id}/edit`
                        )
                      }
                    >
                      <Pencil
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Delete offer"
                      onClick={() =>
                        handleDelete(
                          offer.id
                        )
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>

                </article>

              )
            )}

          </section>
        )}

    </main>
  );
};

export default AdminOffersPage;
