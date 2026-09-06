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
// unused icon imports removed
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

  if (vehicle) {
    // 1. Get official admin colors list
    const adminColors = vehicle.color
      ? vehicle.color.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    const groupMap = new Map<string, NonNullable<Vehicle['images']>>();
    const allImages = vehicle.images || [];

    // Initialize groupMap for each official color
    adminColors.forEach((ac) => {
      groupMap.set(ac, []);
    });

    // 2. Map each image to an official color
    allImages.forEach((img) => {
      const alt = (img.altText || "").trim();
      let matchedColor: string | null = null;

      if (alt.includes("Color:")) {
        const parts = alt.split("|");
        const colorPart = parts.find((p) => p.includes("Color:"));
        if (colorPart) {
          const rawColor = colorPart.replace("Color:", "").trim();
          // Find matching admin color
          matchedColor = adminColors.find(
            (ac) => ac.toLowerCase() === rawColor.toLowerCase() || rawColor.toLowerCase().includes(ac.toLowerCase()) || ac.toLowerCase().includes(rawColor.toLowerCase())
          ) || rawColor;
        }
      }

      // If altText did not use "Color:", try matching keywords against admin colors
      if (!matchedColor && alt) {
        const altLower = alt.toLowerCase();
        matchedColor = adminColors.find((ac) => {
          const acLower = ac.toLowerCase();
          const words = acLower.split(" ").filter((w) => w.length > 3);
          return words.some((w) => altLower.includes(w));
        }) || null;
      }

      // Fallback to first admin color or raw color
      if (!matchedColor) {
        matchedColor = adminColors[0] || "Standard Variant";
      }

      if (!groupMap.has(matchedColor)) {
        groupMap.set(matchedColor, []);
      }
      groupMap.get(matchedColor)!.push(img);
    });

    // If an official color group has no images mapped, attach fallback
    groupMap.forEach((imgs, cName) => {
      if (imgs.length === 0 && allImages.length > 0) {
        // Try to filter allImages by color keyword
        const cLower = cName.toLowerCase();
        const filtered = allImages.filter((img) => {
          const aLower = (img.altText || "").toLowerCase();
          return cLower.split(" ").some((w) => w.length > 3 && aLower.includes(w));
        });
        groupMap.set(cName, filtered.length > 0 ? filtered : allImages);
      }
    });

    // 3. Build colorGroups list with swatches
    groupMap.forEach((imgs, colorName) => {
      // Sort images by angle
      imgs.sort((a, b) => {
        const getAngle = (alt?: string) => {
          if (!alt) return 0;
          const match = alt.match(/Angle:\s*(\d+)/i);
          return match ? parseInt(match[1], 10) : (a.displayOrder || 0);
        };
        return getAngle(a.altText || undefined) - getAngle(b.altText || undefined);
      });

      let swatch = "#3b82f6";
      const lower = colorName.toLowerCase();
      if (lower.includes("blue") && lower.includes("white") || (lower.includes("white") && lower.includes("stellar")) || lower.includes("glacier")) {
        swatch = "linear-gradient(135deg, #ffffff 50%, #2563eb 50%)";
      } else if (lower.includes("red") && (lower.includes("gray") || lower.includes("grey"))) {
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
      } else if (lower.includes("black")) {
        swatch = "linear-gradient(135deg, #111827 50%, #374151 50%)";
      } else if (lower.includes("blue") || lower.includes("triton") || lower.includes("stellar")) {
        swatch = "#2563eb";
      } else if (lower.includes("white") || lower.includes("mirage")) {
        swatch = "#ffffff";
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
              OFFICIAL SUZUKI DEALER PAGE SECTIONS (FEATURES, SPECS, ACCESSORIES)
             ========================================================= */}

          {/* SUB NAVIGATION RIBBON */}
          <div className="official-subnav-ribbon" style={{ display: "flex", justifyContent: "center", gap: "24px", background: "#f8fafc", padding: "14px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", margin: "40px 0 32px 0", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setActiveTab("highlights")} style={{ background: activeTab === "highlights" ? "#dc2626" : "transparent", color: activeTab === "highlights" ? "#fff" : "#475569", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}>
              Overview & Features
            </button>
            <button type="button" onClick={() => setActiveTab("specs")} style={{ background: activeTab === "specs" ? "#dc2626" : "transparent", color: activeTab === "specs" ? "#fff" : "#475569", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}>
              Specifications
            </button>
          </div>

          {/* FEATURES SECTION (OFFICIAL SUZUKI SHOWROOM STYLE) */}
          {activeTab === "highlights" && (
            <div className="official-features-section" style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>FEATURES</h2>
              </div>

              <div className="category-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                {customFeatures.length > 0 ? (
                  customFeatures.map((item, idx) => {
                    const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
                    let featureImg = item.imageUrl || "";
                    if (!featureImg) {
                      if (text.includes("engine") || text.includes("sep") || text.includes("eass") || text.includes("power") || text.includes("performance")) {
                        featureImg = isBike ? getImageUrl("/uploads/vehicles/bike_engine_block_1788629360348.jpg") : getImageUrl("/uploads/vehicles/scooter_engine_cvt_1788629571404.jpg");
                      } else if (text.includes("console") || text.includes("bluetooth") || text.includes("navigation") || text.includes("tft") || text.includes("dashboard") || text.includes("connect")) {
                        featureImg = getImageUrl("/uploads/vehicles/suzuki_digital_tft_console_1788627425512.jpg");
                      } else if (text.includes("storage") || text.includes("boot") || text.includes("usb") || text.includes("glovebox") || text.includes("rack")) {
                        featureImg = getImageUrl("/uploads/vehicles/scooter_underseat_storage_1788629750085.jpg");
                      } else if (text.includes("abs") || text.includes("brake") || text.includes("disc") || text.includes("safety") || text.includes("stopping")) {
                        featureImg = getImageUrl("/uploads/vehicles/suzuki_abs_disc_brake_1788627388211.jpg");
                      } else if (text.includes("fuel lid") || text.includes("fuel fill") || text.includes("external fuel") || text.includes("fuel cap")) {
                        featureImg = getImageUrl("/uploads/vehicles/scooter_fuel_lid_rear_1788629695842.jpg");
                      } else if (text.includes("seat") || text.includes("comfort") || text.includes("foot") || text.includes("ergonomics")) {
                        featureImg = getImageUrl("/uploads/vehicles/suzuki_comfort_seat_1788627543364.jpg");
                      } else if (text.includes("headlamp") || text.includes("led") || text.includes("lamp") || text.includes("styling")) {
                        featureImg = getImageUrl("/uploads/vehicles/suzuki_led_headlamp_1788627473237.jpg");
                      } else {
                        featureImg = activeImage ? getImageUrl(activeImage) : (vehicle.primaryImageUrl ? getImageUrl(vehicle.primaryImageUrl) : "");
                      }
                    }

                    return (
                      <div key={idx} style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", transition: "transform 0.2s ease" }}>
                        <div style={{ width: "100%", height: "180px", background: "#0f172a", overflow: "hidden" }}>
                          <img src={featureImg} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ padding: "20px" }}>
                          <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>{item.title}</h3>
                          <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem", lineHeight: "1.6" }}>{item.description}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <p style={{ color: "#64748b" }}>Official Suzuki specifications available below.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TECHNICAL SPECIFICATIONS SECTION */}
          {activeTab === "specs" && (
            <div className="official-specs-section" style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", marginBottom: "24px" }}>TECHNICAL SPECIFICATIONS</h2>
              
              <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                <table className="specs-detail-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b", width: "40%" }}>Model & Variant</td>
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>{vehicle.name} {vehicle.variant || ""}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b" }}>Category</td>
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>{vehicle.category || (isEV ? "ELECTRIC" : isBike ? "BIKE" : "SCOOTER")}</td>
                    </tr>
                    {vehicle.engineCc && (
                      <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b" }}>Engine Displacement</td>
                        <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>{vehicle.engineCc} cc</td>
                      </tr>
                    )}
                    {vehicle.mileage && (
                      <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b" }}>{isEV ? "Battery Range" : "Fuel Efficiency"}</td>
                        <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>{vehicle.mileage} {isEV ? "km / charge" : "km/l"}</td>
                      </tr>
                    )}
                    {vehicle.fuelType && (
                      <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b" }}>Fuel System</td>
                        <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>{vehicle.fuelType}</td>
                      </tr>
                    )}
                    {vehicle.color && (
                      <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b" }}>Available Colors</td>
                        <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>{vehicle.color}</td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#64748b" }}>Showroom Location</td>
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "#dc2626" }}>Shri Hari Suzuki, Kushmoda Chowki, Guna</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OFFICIAL SUZUKI ACCESSORIES SECTION */}
          <div className="official-accessories-section" style={{ margin: "48px 0" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", marginBottom: "24px" }}>ACCESSORIES</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
              <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "100%", height: "160px", background: "#f8fafc" }}>
                  <img src={getImageUrl("/uploads/vehicles/suzuki_comfort_seat_1788627543364.jpg")} alt="Seat Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "16px" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>SEAT COVER (DARK BROWN / BLACK)</h4>
                </div>
              </div>

              <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "100%", height: "160px", background: "#f8fafc" }}>
                  <img src={getImageUrl("/uploads/vehicles/scooter_underseat_storage_1788629750085.jpg")} alt="Floor Mat" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "16px" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>FLOOR MAT (RED / BLACK)</h4>
                </div>
              </div>

              <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "100%", height: "160px", background: "#f8fafc" }}>
                  <img src={getImageUrl("/uploads/vehicles/suzuki_led_headlamp_1788627473237.jpg")} alt="Meter Visor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "16px" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>METER VISOR & CHROME GUARD</h4>
                </div>
              </div>
            </div>
          </div>

          {/* RED DOWNLOAD BROCHURE BUTTON */}
          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <a href={`https://wa.me/919425131697?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#dc2626", color: "#ffffff", fontWeight: 800, fontSize: "1rem", textTransform: "uppercase", padding: "16px 40px", borderRadius: "8px", textDecoration: "none", letterSpacing: "1px", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}>
              DOWNLOAD BROCHURE
            </a>
          </div>

          {/* SHOWROOM FOOTER TITLE */}
          <div style={{ textAlign: "center", borderTop: "2px solid #e2e8f0", paddingTop: "32px", marginTop: "40px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              SUZUKI {vehicle.name.toUpperCase()} - SHRI HARI SUZUKI, KUSHMODA CHOWKI, GUNA
            </h2>
          </div>

        </div>
      </section>

    </main>
  );
};

export default VehicleDetailsPage;
