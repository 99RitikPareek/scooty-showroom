import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgePercent,
  Bike,
  CalendarDays,
  ArrowRight,
  Search,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import offerService from "../../services/offerService";
import type { OfferResponse } from "../../types/offer";

const OffersPage = () => {
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  /* ================= LOAD ACTIVE OFFERS ================= */

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await offerService.getActive();

        setOffers(data);
      } catch (err) {
        console.error("Offers Page Error:", err);

        setOffers([]);
        setError(
          "Unable to load offers right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  /* ================= FILTER ================= */

  const filteredOffers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return offers;
    }

    return offers.filter((offer) => {
      return (
        offer.title?.toLowerCase().includes(keyword) ||
        offer.description?.toLowerCase().includes(keyword) ||
        offer.vehicleName?.toLowerCase().includes(keyword) ||
        offer.discountType?.toLowerCase().includes(keyword)
      );
    });
  }, [offers, search]);

  /* ================= DATE ================= */

  const formatDate = (date?: string | null) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= DISCOUNT ================= */

  const formatDiscount = (offer: OfferResponse) => {
    const value = Number(offer.discountValue);

    if (offer.discountType?.toUpperCase() === "PERCENTAGE") {
      return `${value}% OFF`;
    }

    if (offer.discountType?.toUpperCase() === "FIXED") {
      return `₹${value.toLocaleString("en-IN")} OFF`;
    }

    return `${value.toLocaleString("en-IN")} ${
      offer.discountType || ""
    }`;
  };

  return (
    <main className="public-page public-offers-page">

      {/* ================= HERO ================= */}

      <section className="offers-page-hero">

        <div className="offers-page-hero-content">

          <span className="offers-page-eyebrow">
            EXCLUSIVE DEALS
          </span>

          <h1>
            Offers & Promotions
          </h1>

          <p>
            Explore our latest offers and enjoy
            exclusive savings on selected vehicles.
          </p>

        </div>

        <div className="offers-page-hero-icon">
          <BadgePercent size={48} />
        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="offers-page-content">

        {/* SEARCH */}

        {!loading && !error && offers.length > 0 && (
          <div className="offers-page-toolbar">

            <div className="offers-page-result">

              <span>
                {offers.length}{" "}
                {offers.length === 1
                  ? "active offer"
                  : "active offers"}
              </span>

            </div>

            <div className="offers-page-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search offers..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="offers-page-state">

            <LoaderCircle
              size={42}
              className="spin"
            />

            <h2>
              Loading Offers
            </h2>

            <p>
              Fetching the latest offers for you.
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="offers-page-state offers-page-error">

            <AlertCircle size={42} />

            <h2>
              Unable to Load Offers
            </h2>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          offers.length === 0 && (
            <div className="offers-page-state">

              <BadgePercent size={42} />

              <h2>
                No Active Offers
              </h2>

              <p>
                There are no active promotional offers
                available right now.
              </p>

              <Link
                to="/vehicles"
                className="offers-page-primary-btn"
              >
                Explore Vehicles
                <ArrowRight size={17} />
              </Link>

            </div>
          )}

        {/* ================= NO SEARCH RESULTS ================= */}

        {!loading &&
          !error &&
          offers.length > 0 &&
          filteredOffers.length === 0 && (
            <div className="offers-page-state">

              <Search size={42} />

              <h2>
                No Matching Offers
              </h2>

              <p>
                Try searching with another offer,
                vehicle or discount.
              </p>

            </div>
          )}

        {/* ================= OFFER GRID ================= */}

        {!loading &&
          !error &&
          filteredOffers.length > 0 && (
            <div className="public-offers-grid">

              {filteredOffers.map((offer) => (

                <article
                  key={offer.id}
                  className="public-offer-card"
                >

                  {/* CARD HEADER */}

                  <div className="public-offer-card-header">

                    <div className="public-offer-icon">
                      <BadgePercent size={24} />
                    </div>

                    <span className="public-offer-badge">
                      Limited Offer
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="public-offer-content">

                    <h2>
                      {offer.title}
                    </h2>

                    <p>
                      {offer.description ||
                        "Special offer available on selected vehicles."}
                    </p>

                    <div className="public-offer-discount">
                      {formatDiscount(offer)}
                    </div>

                  </div>

                  {/* VEHICLE */}

                  <div className="public-offer-info">

                    <div className="public-offer-info-row">

                      <Bike size={17} />

                      <div>
                        <span>Applicable Vehicle</span>

                        <strong>
                          {offer.vehicleName ||
                            `Vehicle #${offer.vehicleId}`}
                        </strong>
                      </div>

                    </div>

                    <div className="public-offer-info-row">

                      <CalendarDays size={17} />

                      <div>
                        <span>Offer Validity</span>

                        <strong>
                          {formatDate(
                            offer.startDate
                          )}{" "}
                          —{" "}
                          {formatDate(
                            offer.endDate
                          )}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* ACTION */}

                  <Link
                    to={`/enquiry/${offer.vehicleId}`}
                    className="public-offer-btn"
                  >
                    Enquire Now
                    <ArrowRight size={17} />
                  </Link>

                </article>

              ))}

            </div>
          )}

      </section>

    </main>
  );
};

export default OffersPage;