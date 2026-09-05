import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bike,
  Gauge,
  Fuel,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  Navigation,
  Lock,
  Layers,
  FileText,
  CheckCircle,
} from "lucide-react";

import VehicleSkeleton from "../../components/vehicle/VehicleSkeleton";
import vehicleService from "../../services/vehicleService";
import { getImageUrl } from "../../utils/imageUtils";
import type { Vehicle } from "../../types/vehicle";

interface CustomFeatureItem {
  title: string;
  description: string;
}

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"highlights" | "specs">("highlights");

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const data = await vehicleService.getById(Number(id));
        setVehicle(data);

        const firstImage =
          data.primaryImageUrl || data.images?.[0]?.imageUrl || null;

        setSelectedImage(firstImage);
      } catch (err) {
        console.error("Failed to load vehicle details:", err);
        setError(
          "Unable to load vehicle details right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <main className="vehicle-details-page">
        <section className="section">
          <div className="container" style={{ maxWidth: "800px" }}>
            <VehicleSkeleton />
          </div>
        </section>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="vehicle-details-page">
        <section className="section">
          <div className="container">
            <div className="vehicle-state error-state">
              <AlertCircle size={48} />
              <h2>Vehicle Not Found</h2>
              <p>{error || "The requested vehicle details could not be found."}</p>
              <Link to="/vehicles" className="btn btn-primary">
                Back To All Vehicles
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const activeImage =
    selectedImage || vehicle.primaryImageUrl || vehicle.images?.[0]?.imageUrl;

  const category = (vehicle.category || "").toUpperCase();
  const fuelTypeUpper = (vehicle.fuelType || "").toUpperCase();
  const isEV = category === "ELECTRIC" || fuelTypeUpper.includes("ELECTRIC") || fuelTypeUpper.includes("EV");
  const isBike = category === "BIKE" || vehicle.name.toUpperCase().includes("GIXXER") || vehicle.name.toUpperCase().includes("STROM");

  // Parse Admin Custom Features if present
  let customFeatures: CustomFeatureItem[] = [];
  if (vehicle.featuresJson) {
    try {
      const parsed = JSON.parse(vehicle.featuresJson);
      if (Array.isArray(parsed)) {
        customFeatures = parsed.filter(item => item && item.title);
      }
    } catch (e) {
      console.error("Failed to parse featuresJson:", e);
    }
  }

  const priceNum = Number(vehicle.price) || 0;

  const whatsappMessage = encodeURIComponent(
    `Hello Shri Hari Suzuki! I am interested in ${vehicle.brandName} ${vehicle.name} (${vehicle.model || ''}). Please share best price offer and test ride availability.`
  );

  return (
    <main className="vehicle-details-page">

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span>SHRI HARI SUZUKI • OFFICIAL SHOWROOM</span>
          <h1>
            {vehicle.brandName} {vehicle.name}
          </h1>

          {vehicle.model && (
            <p>
              {vehicle.model}
              {vehicle.variant ? ` • ${vehicle.variant}` : ""}
            </p>
          )}
        </div>
      </section>

      {/* DETAILS LAYOUT */}
      <section className="section">
        <div className="container">

          <div className="vehicle-details-layout">

            {/* GALLERY */}
            <div className="vehicle-details-gallery">
              <div className="vehicle-main-image">
                {activeImage ? (
                  <img
                    src={getImageUrl(activeImage)}
                    alt={`${vehicle.brandName} ${vehicle.name}`}
                  />
                ) : (
                  <div className="vehicle-image-placeholder">
                    <Bike size={72} />
                    <span>Vehicle image unavailable</span>
                  </div>
                )}

                <span className="vehicle-type-badge">
                  {vehicle.vehicleType === "NEW" ? "NEW" : "PRE-OWNED"}
                </span>

                {isEV && (
                  <span className="category-tag-badge ev-tag">
                    <Zap size={14} /> EV ELECTRIC
                  </span>
                )}
                {!isEV && isBike && (
                  <span className="category-tag-badge bike-tag">
                    🏍️ PERFORMANCE BIKE
                  </span>
                )}
                {!isEV && !isBike && (
                  <span className="category-tag-badge scooter-tag">
                    🛵 SUZUKI SCOOTY
                  </span>
                )}
              </div>

              {vehicle.images && vehicle.images.length > 1 && (
                <div className="vehicle-thumbnail-grid">
                  {vehicle.images.map((image) => (
                    <img
                      key={image.id}
                      src={getImageUrl(image.imageUrl)}
                      onClick={() => setSelectedImage(image.imageUrl)}
                      style={{ cursor: "pointer" }}
                      className={activeImage === image.imageUrl ? "active-thumb" : ""}
                      alt={image.altText || `${vehicle.name} image`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CONTENT & INFORMATION */}
            <div className="vehicle-details-content">

              <div className="vehicle-detail-heading">
                <span className="vehicle-brand">{vehicle.brandName}</span>
                <h2>
                  {vehicle.name} {vehicle.model && `${vehicle.model}`}
                </h2>
                {vehicle.variant && (
                  <p className="vehicle-variant">{vehicle.variant}</p>
                )}
              </div>

              {/* PRICE */}
              <div className="vehicle-detail-price-card">
                <div>
                  <span className="price-label">Ex-Showroom Price</span>
                  <strong className="price-value">
                    <IndianRupee size={24} />
                    {priceNum.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="showroom-location-badge" style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                  📍 Guna Showroom
                </div>
              </div>

              {/* AVAILABILITY STATUS */}
              <div className="vehicle-availability">
                {vehicle.available ? (
                  <>
                    <CheckCircle2 size={18} />
                    Ready For Delivery At Showroom
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} />
                    Currently Out of Stock
                  </>
                )}
              </div>

              {/* QUICK SPECS ROW */}
              <div className="vehicle-specifications">
                {vehicle.engineCc && (
                  <div className="spec-item">
                    <Gauge size={22} />
                    <div>
                      <span>Engine</span>
                      <strong>{vehicle.engineCc} cc</strong>
                    </div>
                  </div>
                )}

                {vehicle.mileage && (
                  <div className="spec-item">
                    <Fuel size={22} />
                    <div>
                      <span>{isEV ? "Range" : "Mileage"}</span>
                      <strong>{vehicle.mileage} {isEV ? "km/charge" : "km/l"}</strong>
                    </div>
                  </div>
                )}

                {vehicle.fuelType && (
                  <div className="spec-item">
                    <Zap size={22} />
                    <div>
                      <span>Fuel Type</span>
                      <strong>{vehicle.fuelType}</strong>
                    </div>
                  </div>
                )}

                {vehicle.color && (
                  <div className="spec-item">
                    <div className="color-dot" />
                    <div>
                      <span>Color</span>
                      <strong>{vehicle.color}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="vehicle-detail-actions">
                <Link
                  to={`/test-ride/${vehicle.id}`}
                  className="btn btn-primary"
                >
                  <CalendarDays size={18} />
                  Book Free Test Ride
                </Link>

                <a
                  href={`https://wa.me/919425131697?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn whatsapp-btn"
                >
                  <MessageSquare size={18} />
                  WhatsApp Inquiry
                </a>
              </div>

              <div className="showroom-assurance-box">
                <ShieldCheck size={20} />
                <span>100% Genuine Suzuki Warranty • Instant Spot Finance at Showroom</span>
              </div>

            </div>
          </div>

          {/* =========================================================
              OFFICIAL SUZUKI STYLE FEATURE SHOWCASE & SPECS TABS
             ========================================================= */}
          <div className="vehicle-feature-tabs-section">

            {/* TAB BUTTONS */}
            <div className="feature-tabs-bar">
              <button
                type="button"
                className={`tab-btn ${activeTab === "highlights" ? "active" : ""}`}
                onClick={() => setActiveTab("highlights")}
              >
                <Sparkles size={18} />
                Key Features & Highlights
              </button>

              <button
                type="button"
                className={`tab-btn ${activeTab === "specs" ? "active" : ""}`}
                onClick={() => setActiveTab("specs")}
              >
                <FileText size={18} />
                Technical Specifications
              </button>
            </div>

            {/* TAB CONTENT: HIGHLIGHTS */}
            {activeTab === "highlights" && (
              <div className="tab-content-panel">
                <h3>{customFeatures.length > 0 ? "Vehicle Specific Features" : "Key Highlights & Features"}</h3>

                {/* ADMIN CUSTOM FEATURES GRID */}
                {customFeatures.length > 0 ? (
                  <div className="category-features-grid">
                    {customFeatures.map((item, idx) => (
                      <div key={idx} className="feature-highlight-card">
                        <div className="feature-card-icon">
                          <CheckCircle size={22} />
                        </div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* DEFAULT CATEGORY FEATURES FALLBACK IF NO CUSTOM FEATURES FILLED BY ADMIN */
                  <div className="category-features-grid">
                    {!isEV && !isBike && (
                      <>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><Fuel size={24} /></div>
                          <h4>Suzuki Eco Performance (SEP)</h4>
                          <p>Advanced SEP engine technology delivers smooth acceleration while giving superior mileage up to {vehicle.mileage || 52} km/l.</p>
                        </div>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><Navigation size={24} /></div>
                          <h4>Bluetooth Digital Console</h4>
                          <p>Turn-by-turn navigation alerts, incoming call & SMS notifications right on your digital instrument cluster.</p>
                        </div>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><Layers size={24} /></div>
                          <h4>21.8L Large Storage</h4>
                          <p>Spacious underseat storage with convenient front rack & USB mobile charging socket for easy riding.</p>
                        </div>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><Lock size={24} /></div>
                          <h4>One-Push Central Locking</h4>
                          <p>Integrated central locking system with easy ignition start and secure shutter key protection.</p>
                        </div>
                      </>
                    )}

                    {!isEV && isBike && (
                      <>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><Gauge size={24} /></div>
                          <h4>Gixxer Performance SEP Engine</h4>
                          <p>Derived from Suzuki GSX-R racing heritage, offering powerful throttle response and high-speed stability.</p>
                        </div>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><ShieldCheck size={24} /></div>
                          <h4>Dual Channel ABS Brakes</h4>
                          <p>Advanced Anti-Lock Braking System with twin disc brakes for unmatched emergency stopping power and control.</p>
                        </div>
                        <div className="feature-highlight-card">
                          <div className="feature-card-icon"><Sparkles size={24} /></div>
                          <h4>Aerodynamic Sport Styling</h4>
                          <p>Aggressive LED headlamp, twin-muffler exhaust, and clip-on handlebars designed for sporty riding dynamics.</p>
                        </div>
                      </>
                    )}

                    {isEV && (
                      <>
                        <div className="feature-highlight-card ev-style">
                          <div className="feature-card-icon"><Zap size={24} /></div>
                          <h4>Zero Emission Eco Mobility</h4>
                          <p>100% Electric drivetrain delivering zero carbon emissions with whisper-quiet, smooth acceleration.</p>
                        </div>
                        <div className="feature-highlight-card ev-style">
                          <div className="feature-card-icon"><Sparkles size={24} /></div>
                          <h4>Fast Charge Battery System</h4>
                          <p>Advanced Lithium-Ion battery pack with fast-charging technology (0 to 80% in 60 mins).</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {vehicle.description && (
                  <div className="full-vehicle-description">
                    <h4>Description & Overview</h4>
                    <p>{vehicle.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SPECS TABLE */}
            {activeTab === "specs" && (
              <div className="tab-content-panel">
                <h3>Technical Specifications</h3>

                <table className="specs-detail-table">
                  <tbody>
                    <tr>
                      <td>Model & Variant</td>
                      <td><strong>{vehicle.name} {vehicle.variant || ''}</strong></td>
                    </tr>
                    <tr>
                      <td>Vehicle Category</td>
                      <td><strong>{vehicle.category || (isEV ? 'ELECTRIC' : isBike ? 'BIKE' : 'SCOOTER')}</strong></td>
                    </tr>
                    {vehicle.engineCc && (
                      <tr>
                        <td>Engine Displacement</td>
                        <td><strong>{vehicle.engineCc} cc</strong></td>
                      </tr>
                    )}
                    {vehicle.mileage && (
                      <tr>
                        <td>{isEV ? "Battery Range" : "Fuel Efficiency (Mileage)"}</td>
                        <td><strong>{vehicle.mileage} {isEV ? "km / full charge" : "km/l"}</strong></td>
                      </tr>
                    )}
                    {vehicle.fuelType && (
                      <tr>
                        <td>Fuel / Power Type</td>
                        <td><strong>{vehicle.fuelType}</strong></td>
                      </tr>
                    )}
                    {vehicle.transmission && (
                      <tr>
                        <td>Transmission Type</td>
                        <td><strong>{vehicle.transmission}</strong></td>
                      </tr>
                    )}
                    {vehicle.color && (
                      <tr>
                        <td>Available Color</td>
                        <td><strong>{vehicle.color}</strong></td>
                      </tr>
                    )}
                    <tr>
                      <td>Condition</td>
                      <td><strong>{vehicle.vehicleType === "NEW" ? "Brand New (Official Warranty)" : "Pre-Owned (Quality Checked)"}</strong></td>
                    </tr>
                    <tr>
                      <td>Showroom Location</td>
                      <td><strong>Shri Hari Suzuki, Guna Showroom</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      </section>

    </main>
  );
};

export default VehicleDetailsPage;
