import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Bike,
  Phone,
  MapPin,
  CalendarDays,
  BadgeCheck,
  BadgePercent,
  LoaderCircle,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Wrench,
  CreditCard,
} from "lucide-react";

import VehicleCard from "../../components/vehicle/VehicleCard";
import vehicleService from "../../services/vehicleService";
import offerService from "../../services/offerService";

import type { Vehicle } from "../../types/vehicle";
import type { OfferResponse } from "../../types/offer";

const HomePage = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState("");

  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      try {
        setLoadingVehicles(true);
        setVehicleError("");

        const data = await vehicleService.getFeatured();
        setFeaturedVehicles(data);
      } catch (err) {
        console.error("Failed to load featured vehicles:", err);
        setVehicleError("Unable to load featured vehicles right now.");
      } finally {
        setLoadingVehicles(false);
      }
    };

    const loadOffers = async () => {
      try {
        setOffersLoading(true);
        const data = await offerService.getActive();
        setOffers(data);
      } catch (err) {
        console.error("Failed to load offers:", err);
      } finally {
        setOffersLoading(false);
      }
    };

    loadFeaturedVehicles();
    loadOffers();
  }, []);

  return (
    <main className="home-page">

      {/* =========================================================
          HERO SECTION WITH YOUTUBE VIDEO BACKGROUND
         ========================================================= */}
      <section className="hero-section">
        {/* Background Video from YouTube */}
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/src/assets/hero.png"
        >
          <source src="/videos/suzuki-scooter.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="hero-video-overlay" />

        <div className="container">
          <div className="hero-content">

            <div className="hero-text">
              <div className="hero-badge">
                <ShieldCheck size={15} />
                <span>SHRI HARI SUZUKI</span>
              </div>

              <h1>
                Ride Your
                <span>Dreams</span>
              </h1>

              <p>
                Discover the latest Suzuki scooters and quality pre-owned vehicles at Shri Hari Suzuki.
                Trusted vehicles, transparent pricing and dependable service.
              </p>

              <div className="hero-actions">
                <Link to="/vehicles" className="btn btn-primary">
                  Explore Vehicles
                  <ArrowRight size={18} />
                </Link>

                <Link to="/test-ride" className="btn btn-outline-light">
                  <CalendarDays size={18} />
                  Book a Test Ride
                </Link>
              </div>

              <div className="hero-contact">
                <Phone size={16} />
                <span>Call us: 9425131697</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          EXPLORE OUR RANGE (NEW & PRE-OWNED CARDS)
         ========================================================= */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span>EXPLORE OUR RANGE</span>
            <h2>Find The Right Vehicle For You</h2>
            <p>Choose from our new Suzuki scooters and carefully selected pre-owned vehicles.</p>
          </div>

          <div className="type-grid">
            {/* Fully Clickable New Vehicles Card */}
            <Link to="/vehicles?type=NEW" className="type-card" style={{ textDecoration: "none" }}>
              <div className="type-card-content">
                <div className="type-icon">
                  <Bike size={28} color="#ffffff" />
                </div>
                <h3>New Vehicles</h3>
                <p>Explore the latest Suzuki models with modern technology, stylish design and reliable performance.</p>
                <span className="card-link">
                  Explore New Vehicles
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            {/* Fully Clickable Pre-Owned Vehicles Card */}
            <Link to="/vehicles?type=USED" className="type-card used-card" style={{ textDecoration: "none" }}>
              <div className="type-card-content">
                <div className="type-icon">
                  <BadgeCheck size={28} color="#ffffff" />
                </div>
                <h3>Pre-Owned Vehicles</h3>
                <p>Quality checked pre-owned vehicles at competitive prices with complete transparency.</p>
                <span className="card-link">
                  Explore Pre-Owned
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE US SECTION
         ========================================================= */}
      <section className="section why-section">
        <div className="container">
          <div className="section-heading">
            <span>WHY CHOOSE US</span>
            <h2>A Better Way To Buy Your Scooter</h2>
            <p>We make buying and servicing your vehicle simple, transparent, and rewarding.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={26} />
              </div>
              <h3>Authorized Suzuki Dealer</h3>
              <p>Official dealership in Guna providing genuine Suzuki scooters and motorcycles.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BadgePercent size={26} />
              </div>
              <h3>Best Price & Offers</h3>
              <p>Competitive transparent pricing with exclusive showroom discounts and deals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={26} />
              </div>
              <h3>Easy Finance & Exchange</h3>
              <p>Hassle-free vehicle loans, quick approvals and attractive exchange value.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Wrench size={26} />
              </div>
              <h3>Genuine Service & Care</h3>
              <p>Certified mechanics, state-of-the-art workshop and 100% genuine Suzuki spare parts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED VEHICLES SECTION
         ========================================================= */}
      <section className="section featured-section">
        <div className="container">
          <div className="home-section-header">
            <div>
              <span className="home-section-eyebrow">
                OUR SHOWROOM HIGHLIGHTS
              </span>
              <h2>Featured Vehicles</h2>
              <p>Discover our top-recommended Suzuki scooters and bikes.</p>
            </div>

            <Link to="/vehicles" className="home-section-link">
              View All Vehicles
              <ArrowRight size={17} />
            </Link>
          </div>

          {loadingVehicles ? (
            <div className="home-offers-state">
              <LoaderCircle size={32} className="spin" />
              <span>Loading featured vehicles...</span>
            </div>
          ) : vehicleError ? (
            <div className="home-offers-state error">
              <AlertCircle size={32} />
              <span>{vehicleError}</span>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div className="home-offers-state">
              <Bike size={32} />
              <span>No featured vehicles available right now.</span>
            </div>
          ) : (
            <div className="vehicles-grid">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                />
              ))}
            </div>
          )}

          {!loadingVehicles && !vehicleError && featuredVehicles.length > 0 && (
            <div className="featured-view-all" style={{ textAlign: "center", marginTop: "40px" }}>
              <Link to="/vehicles" className="btn btn-primary">
                View All Vehicles
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          OFFERS SECTION
         ========================================================= */}
      <section className="home-offers-section">
        <div className="container">
          <div className="home-section-header">
            <div>
              <span className="home-section-eyebrow">
                EXCLUSIVE OFFERS
              </span>
              <h2>Offers & Promotions</h2>
              <p>Get the best deals on your favourite vehicles.</p>
            </div>

            <Link to="/offers" className="home-section-link">
              View All Offers
              <ArrowRight size={17} />
            </Link>
          </div>

          {offersLoading ? (
            <div className="home-offers-state">
              <LoaderCircle size={32} className="spin" />
              <span>Loading latest offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="home-offers-state">
              <BadgePercent size={32} />
              <span>No active offers available right now.</span>
            </div>
          ) : (
            <div className="home-offers-grid">
              {offers.map((offer) => (
                <article key={offer.id} className="home-offer-card">
                  <div className="home-offer-card-top">
                    <div className="home-offer-icon">
                      <BadgePercent size={22} />
                    </div>
                    <span className="home-offer-badge">Special Offer</span>
                  </div>

                  <div className="home-offer-content">
                    <h3>{offer.title}</h3>
                    <p>{offer.description || "Limited time offer available on selected vehicles."}</p>

                    <strong className="home-offer-discount">
                      {offer.discountType?.toUpperCase() === "PERCENTAGE"
                        ? `${Number(offer.discountValue)}% OFF`
                        : offer.discountType?.toUpperCase() === "FIXED"
                        ? `₹${Number(offer.discountValue).toLocaleString("en-IN")} OFF`
                        : `${Number(offer.discountValue).toLocaleString("en-IN")} ${offer.discountType || ""}`}
                    </strong>
                  </div>

                  <div className="home-offer-vehicle">
                    <Bike size={16} />
                    <span>{offer.vehicleName || `Vehicle #${offer.vehicleId}`}</span>
                  </div>

                  <div className="home-offer-date">
                    <CalendarDays size={16} />
                    <span>{offer.startDate} — {offer.endDate}</span>
                  </div>

                  <Link to={`/enquiry/${offer.vehicleId}`} className="home-offer-btn">
                    Enquire Now
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          CUSTOMER ENQUIRY
         ========================================================= */}
      <section className="home-enquiry-section">
        <div className="container">
          <div className="home-enquiry-content">
            <div className="home-enquiry-icon">
              <MessageSquare size={30} />
            </div>

            <div className="home-enquiry-text">
              <span className="home-enquiry-eyebrow">HAVE A QUESTION?</span>
              <h2>Interested in a Suzuki vehicle?</h2>
              <p>Get in touch with our showroom team. Ask about pricing, availability, features and more.</p>
            </div>

            <Link to="/enquiry" className="home-enquiry-btn">
              Enquire Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SHOWROOM CTA / LOCATION
         ========================================================= */}
      <section className="showroom-cta">
        <div className="container showroom-cta-content">
          <div>
            <span>VISIT SHRI HARI SUZUKI</span>
            <h2>Ready To Experience The Ride?</h2>
            <p>Visit our showroom for the latest Suzuki scooters, offers and professional assistance.</p>

            <div className="location-info">
              <MapPin size={20} />
              <div>
                <strong>Our Showroom</strong>
                <p>
                  Hotel The Sara, AB Road,<br />
                  Guna, Madhya Pradesh - 473001
                </p>
              </div>
            </div>
          </div>

          <div className="showroom-actions">
            <a href="tel:9425131697" className="btn btn-light">
              <Phone size={18} />
              Call Now
            </a>

            <a
              href="http://www.hotelthesara.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light"
            >
              <MapPin size={18} />
              Visit Location
            </a>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
