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
  RotateCw,
  Palette,
  Play,
  Pause,
  } from "lucide-react";

import VehicleSkeleton from "../../components/vehicle/VehicleSkeleton";
import vehicleService from "../../services/vehicleService";
import { getImageUrl } from "../../utils/imageUtils";
import type { Vehicle } from "../../types/vehicle";

interface CustomFeatureItem {
  title: string;
  description: string;
  imageUrl?: string;
}

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"highlights" | "specs">("highlights");



  // 360 Viewer state
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Dynamic Color 360 State
  const [activeColorGroupName, setActiveColorGroupName] = useState<string | null>(null);

  // Group images dynamically by Color Name
  interface ColorGroup {
    colorName: string;
    swatch: string;
    images: NonNullable<Vehicle['images']>;
  }

  const colorGroups: ColorGroup[] = [];

  if (vehicle?.images && vehicle.images.length > 0) {
    const groupMap = new Map<string, NonNullable<Vehicle['images']>>();

    vehicle.images.forEach((img) => {
      let color = "Metallic Triton Blue";
      const alt = (img.altText || "").trim();
      
      if (alt.includes("Color:")) {
        const parts = alt.split("|");
        const colorPart = parts.find((p) => p.includes("Color:"));
        if (colorPart) {
          color = colorPart.replace("Color:", "").trim();
        }
      } else if (alt) {
        color = alt;
      }

      if (!groupMap.has(color)) {
        groupMap.set(color, []);
      }
      groupMap.get(color)!.push(img);
    });

    // Also parse vehicle.color string set by Admin (e.g. "Solid Ice Green, Metallic Mat Stellar Blue, Pearl Grace White")
    if (vehicle?.color) {
      const adminColors = vehicle.color.split(",").map(c => c.trim()).filter(Boolean);
      adminColors.forEach(ac => {
        if (!groupMap.has(ac)) {
          // If no image explicitly mapped, attach fallback vehicle images
          groupMap.set(ac, vehicle.images || []);
        }
      });
    }

    groupMap.forEach((imgs, colorName) => {
      let swatch = "#3b82f6";
      const lower = colorName.toLowerCase();
      if (lower.includes("red") && (lower.includes("gray") || lower.includes("grey"))) {
        swatch = "linear-gradient(135deg, #dc2626 50%, #4b5563 50%)";
      } else if (lower.includes("orange")) {
        swatch = lower.includes("black") ? "linear-gradient(135deg, #f97316 50%, #111827 50%)" : "#f97316";
      } else if (lower.includes("aqua") || (lower.includes("silver") && lower.includes("blue"))) {
        swatch = "linear-gradient(135deg, #06b6d4 50%, #9ca3af 50%)";
      } else if (lower.includes("green") || lower.includes("ice")) {
        swatch = "linear-gradient(135deg, #059669 50%, #6ee7b7 50%)";
      } else if (lower.includes("beige")) {
        swatch = "#fef08a";
      } else if (lower.includes("bronze")) {
        swatch = "linear-gradient(135deg, #92400e 50%, #78350f 50%)";
      } else if (lower.includes("blue") && lower.includes("white") || (lower.includes("white") && lower.includes("stellar")) || lower.includes("glacier")) {
        swatch = "linear-gradient(135deg, #ffffff 50%, #2563eb 50%)";
      } else if (lower.includes("black")) {
        swatch = "linear-gradient(135deg, #111827 50%, #374151 50%)";
      } else if (lower.includes("blue") || lower.includes("triton") || lower.includes("stellar")) {
        swatch = "#2563eb";
      } else if (lower.includes("white")) {
        swatch = "#ffffff";
      } else if (lower.includes("blue") || lower.includes("triton") || lower.includes("stellar")) {
        swatch = "#2563eb";
      } else if (lower.includes("red") || lower.includes("mira")) {
        swatch = "#dc2626";
      } else if (lower.includes("gray") || lower.includes("grey") || lower.includes("fibroin")) {
        swatch = "#4b5563";
      }

      colorGroups.push({
        colorName,
        swatch,
        images: imgs,
      });
    });
  }

  const activeGroup =
    colorGroups.find((g) => g.colorName === activeColorGroupName) || colorGroups[0];

  const currentAngleImages = activeGroup ? activeGroup.images : vehicle?.images || [];

  // Auto 360 Spin Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoSpinning && currentAngleImages && currentAngleImages.length > 0) {
      interval = setInterval(() => {
        setCurrentAngleIndex((prev) => (prev + 1) % currentAngleImages.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAutoSpinning, currentAngleImages]);

  // Drag & Tilt handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
     // Switch to 360 view on drag
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && vehicle?.images && vehicle.images.length > 1) {
      const deltaX = e.clientX - dragStartX;
      const threshold = 16;
      if (Math.abs(deltaX) > threshold) {
        const step = deltaX > 0 ? -1 : 1;
        const count = currentAngleImages.length;
        setCurrentAngleIndex((prev) => (prev + step + count) % count);
        setDragStartX(e.clientX);
      }
    } else if (!vehicle?.images || vehicle.images.length <= 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotY = (x / (rect.width / 2)) * 14;
      const rotX = -(y / (rect.height / 2)) * 14;
      setTilt({ rotateX: rotX, rotateY: rotY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length > 0 && vehicle?.images && vehicle.images.length > 1) {
      const deltaX = e.touches[0].clientX - dragStartX;
      const threshold = 16;
      if (Math.abs(deltaX) > threshold) {
        const step = deltaX > 0 ? -1 : 1;
        const count = currentAngleImages.length;
        setCurrentAngleIndex((prev) => (prev + step + count) % count);
        setDragStartX(e.touches[0].clientX);
      }
    }
  };

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

  const hasMultipleImages = Boolean(currentAngleImages && currentAngleImages.length > 1);
  
  const activeImageObj = hasMultipleImages
    ? currentAngleImages[currentAngleIndex % currentAngleImages.length]
    : currentAngleImages[0];

  const activeImage =
    activeImageObj?.imageUrl ||
    selectedImage ||
    vehicle?.primaryImageUrl ||
    vehicle?.images?.[0]?.imageUrl;

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

            {/* GALLERY WITH 360 INTERACTIVE ROTATION */}
            <div className="vehicle-details-gallery">
              <div
                className={`vehicle-main-image v360-container ${isDragging ? "is-dragging" : ""}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{
                  perspective: "1000px",
                  cursor: hasMultipleImages ? (isDragging ? "grabbing" : "grab") : "pointer",
                  userSelect: "none"
                }}
              >
                <div
                  className="v360-image-wrapper"
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                    transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {activeImage ? (
                    <img
                      src={getImageUrl(activeImage)}
                      alt={`${vehicle.brandName} ${vehicle.name}`}
                      draggable={false}
                    />
                  ) : (
                    <div className="vehicle-image-placeholder">
                      <Bike size={72} />
                      <span>Vehicle image unavailable</span>
                    </div>
                  )}
                </div>

                {/* 360 High Tech Overlay Badge */}
                <div className="v360-overlay-badge">
                  <RotateCw className={isAutoSpinning ? "spin-icon-anim" : ""} size={16} />
                  <span>360° Interactive View</span>
                  <span className="v360-hint">• Drag / Touch Move to Rotate</span>
                </div>

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

              {/* 360 INTERACTIVE CONTROLS BAR */}
              <div className="v360-controls-bar">
                <button
                  type="button"
                  className={`v360-spin-btn ${isAutoSpinning ? "active" : ""}`}
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                >
                  {isAutoSpinning ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isAutoSpinning ? "Pause 360° Spin" : "Auto 360° Spin"}</span>
                </button>

                {hasMultipleImages && (
                  <div className="v360-angle-pills">
                    {currentAngleImages.map((image, index) => {
                      const angleDeg = Math.round((index / currentAngleImages.length) * 360);
                      const isCurrent = currentAngleIndex % currentAngleImages.length === index;
                      return (
                        <button
                          key={image.id || index}
                          type="button"
                          className={`v360-angle-pill ${isCurrent ? "active" : ""}`}
                          onClick={() => {
                            setCurrentAngleIndex(index);
                            setSelectedImage(image.imageUrl);
                          }}
                          title={`View angle ${angleDeg}°`}
                        >
                          {angleDeg}°
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DYNAMIC MULTI-COLOR 360 PALETTE SELECTOR */}
              {colorGroups.length > 0 && (
                <div className="official-color-palette-card">
                  <div className="color-palette-header">
                    <Palette size={18} />
                    <span>Official Suzuki Color Options</span>
                  </div>
                  
                  <div className="color-swatches-grid">
                    {colorGroups.map((group) => {
                      const isCurrent = activeGroup?.colorName === group.colorName;
                      return (
                        <button
                          key={group.colorName}
                          type="button"
                          className={`color-swatch-btn ${isCurrent ? 'active' : ''}`}
                          onClick={() => {
                            setActiveColorGroupName(group.colorName);
                            setCurrentAngleIndex(0);
                          }}
                          title={group.colorName}
                        >
                          <span className="swatch-circle" style={{ background: group.swatch }} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="active-color-name">
                    {activeGroup?.colorName || vehicle.color || "Standard Variant"}
                  </div>
                </div>
              )}

              {currentAngleImages && currentAngleImages.length > 1 && (
                <div className="vehicle-thumbnail-grid">
                  {currentAngleImages.map((image, index) => (
                    <img
                      key={image.id}
                      src={getImageUrl(image.imageUrl)}
                      onClick={() => {
                        setSelectedImage(image.imageUrl);
                        setCurrentAngleIndex(index);
                      }}
                      style={{ cursor: "pointer" }}
                      className={
                        currentAngleIndex % currentAngleImages.length === index
                          ? "active-thumb"
                          : ""
                      }
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
                    {customFeatures.map((item, idx) => {
                      const text = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
                      let imgUrl = item.imageUrl || '';
                      if (!imgUrl) {
                        if (text.includes('exhaust') || text.includes('muffler')) {
                          imgUrl = '/features/bike-exhaust.jpg';
                        } else if (text.includes('engine') || text.includes('sep') || text.includes('performance') || text.includes('torque') || text.includes('power')) {
                          imgUrl = isBike ? '/features/bike-engine.jpg' : '/features/scooter-engine.jpg';
                        } else if (text.includes('abs') || text.includes('brake') || text.includes('disc') || text.includes('stopping')) {
                          imgUrl = '/features/abs-brake.jpg';
                        } else if (text.includes('console') || text.includes('bluetooth') || text.includes('navigation') || text.includes('display') || text.includes('tft') || text.includes('dashboard') || text.includes('connect')) {
                          imgUrl = '/features/tft-console.jpg';
                        } else if (text.includes('fuel lid') || text.includes('fuel fill') || text.includes('external fuel') || text.includes('fueling cap') || text.includes('refueling') || text.includes('fuel filling')) {
                          imgUrl = '/features/scooter-fuel-lid.jpg';
                        } else if (text.includes('storage') || text.includes('boot') || text.includes('glovebox') || text.includes('usb') || text.includes('rack')) {
                          imgUrl = '/features/scooter-storage.jpg';
                        } else if (text.includes('headlamp') || text.includes('led') || text.includes('light') || text.includes('styling') || text.includes('lamp') || text.includes('fairing')) {
                          imgUrl = '/features/led-headlight.jpg';
                        } else if (text.includes('seat') || text.includes('comfort') || text.includes('floorboard') || text.includes('posture') || text.includes('ergonomics')) {
                          imgUrl = '/features/comfort-seat.jpg';
                        } else {
                          imgUrl = isBike ? '/features/bike-engine.jpg' : '/features/tft-console.jpg';
                        }
                      }
                      return (
                        <div key={idx} className="feature-highlight-card with-image-card" style={{ background: '#ffffff', overflow: 'hidden', padding: 0 }}>
                          <div style={{ position: 'relative', width: '100%', height: '160px', background: '#0f172a', overflow: 'hidden' }}>
                            <img src={imgUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
                              ✨ Highlight
                            </div>
                          </div>
                          <div style={{ padding: '20px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>{item.title}</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
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
