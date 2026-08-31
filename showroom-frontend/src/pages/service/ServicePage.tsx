import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  Search,
  Bike,
  ShieldCheck,
  Droplets,
  Zap,
  Disc,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Phone,
  User,
  Mail,
  FileText,
  Sparkles,
} from "lucide-react";
import serviceBookingService from "../../services/serviceBookingService";
import vehicleService from "../../services/vehicleService";
import type {
  ServiceBooking,
  ServiceBookingRequest,
  ServiceBookingStatus,
} from "../../types/serviceBooking";
import type { Vehicle } from "../../types/vehicle";

const SERVICE_TYPES = [
  {
    id: "PERIODIC_SERVICE",
    title: "Periodic Maintenance Service",
    description: "Complete 25-point inspection, oil change, spark plug cleaning, filter check & complimentary wash.",
    icon: ShieldCheck,
    recommendedMonths: "Every 3 Months / 3000 KM",
  },
  {
    id: "OIL_CHANGE",
    title: "Engine Oil & Filter Change",
    description: "Premium genuine Suzuki 4T engine oil replacement, gear oil level check & oil filter renewal.",
    icon: Droplets,
    recommendedMonths: "Every 2500 KM",
  },
  {
    id: "EXPRESS_WASH",
    title: "Express Water Wash & Polish",
    description: "Deep pressure water wash, foam wash, tire dressing & high-gloss body polish.",
    icon: Sparkles,
    recommendedMonths: "As needed",
  },
  {
    id: "BATTERY_ELECTRICAL",
    title: "Battery & Electrical Check",
    description: "Battery voltage testing, wiring harness check, self-starter & headlight alignment.",
    icon: Zap,
    recommendedMonths: "Every 6 Months",
  },
  {
    id: "BRAKE_TYRE",
    title: "Brake & Tyre Maintenance",
    description: "Brake shoe/pad inspection, drum cleaning, cable adjustment & tire pressure calibration.",
    icon: Disc,
    recommendedMonths: "Every 4000 KM",
  },
  {
    id: "GENERAL_REPAIR",
    title: "General Repair & Troubleshooting",
    description: "Custom engine repair, noise diagnostics, clutch overhaul, or part replacement.",
    icon: Wrench,
    recommendedMonths: "On demand",
  },
];

const DEFAULT_SUZUKI_MODELS = [
  "Suzuki Access 125",
  "Suzuki Burgman Street 125",
  "Suzuki Avenis 125",
  "Suzuki Gixxer 150",
  "Suzuki Gixxer SF 150",
  "Suzuki Gixxer 250",
  "Suzuki Gixxer SF 250",
  "Suzuki V-Strom SX 250",
  "Other Scooter / Bike",
];

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const STATUS_STEPS: { key: ServiceBookingStatus; label: string; desc: string }[] = [
  { key: "PENDING", label: "Request Received", desc: "Your booking request is logged and awaiting confirmation." },
  { key: "CONFIRMED", label: "Booking Confirmed", desc: "Service slot confirmed by showroom staff." },
  { key: "IN_PROGRESS", label: "In Service Bay", desc: "Your vehicle is currently undergoing service by our technicians." },
  { key: "COMPLETED", label: "Ready for Delivery", desc: "Service complete! Your vehicle is inspected and ready for pickup." },
];

const ServicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "track" ? "track" : "book";
  const initialCode = searchParams.get("code") || "";

  const [activeTab, setActiveTab] = useState<"book" | "track">(initialTab);

  // Form State
  const [formData, setFormData] = useState<ServiceBookingRequest>({
    customerName: "",
    phone: "",
    email: "",
    vehicleModel: DEFAULT_SUZUKI_MODELS[0],
    registrationNumber: "",
    serviceType: SERVICE_TYPES[0].id,
    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    preferredTimeSlot: TIME_SLOTS[0],
    notes: "",
  });

  const [availableVehicles, setAvailableVehicles] = useState<string[]>(DEFAULT_SUZUKI_MODELS);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [createdBooking, setCreatedBooking] = useState<ServiceBooking | null>(null);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState(initialCode);
  const [trackingResults, setTrackingResults] = useState<ServiceBooking[]>([]);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [hasTracked, setHasTracked] = useState(false);

  // Clipboard copied indicator
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch showroom vehicles for dropdown if available
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAll();
        if (data && data.length > 0) {
          const names = Array.from(new Set(data.map((v: Vehicle) => v.name)));
          setAvailableVehicles([...names, "Other Vehicle"]);
        }
      } catch {
        // Fallback to default models
      }
    };
    fetchVehicles();
  }, []);

  // Handle auto-track if URL code is present
  useEffect(() => {
    if (initialCode) {
      handleTrackSearch(initialCode);
    }
  }, [initialCode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, serviceType: serviceId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.customerName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.preferredDate) {
      setFormError("Please select a preferred service date.");
      return;
    }

    try {
      setSubmitting(true);
      const booking = await serviceBookingService.create(formData);
      setCreatedBooking(booking);
    } catch (err: unknown) {
      console.error("Booking submit error:", err);
      setFormError("Failed to submit service booking. Please try again or call our helpline.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSearch = async (queryToSearch?: string) => {
    const query = (queryToSearch !== undefined ? queryToSearch : trackQuery).trim();
    if (!query) {
      setTrackError("Please enter a Booking Code or Mobile Number.");
      return;
    }

    try {
      setTrackLoading(true);
      setTrackError("");
      setHasTracked(true);
      const results = await serviceBookingService.track(query);
      setTrackingResults(results);
      if (results.length === 0) {
        setTrackError(`No service booking found matching "${query}". Please check your code or phone number.`);
      }
    } catch (err: unknown) {
      console.error("Track error:", err);
      setTrackError("Unable to retrieve booking status right now. Please try again.");
      setTrackingResults([]);
    } finally {
      setTrackLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const getStatusIndex = (status: ServiceBookingStatus): number => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "IN_PROGRESS":
        return 2;
      case "COMPLETED":
        return 3;
      case "CANCELLED":
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="service-page">
      {/* HERO SECTION */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">SHRI HARI SUZUKI SERVICE CENTER</span>
          <h1>Vehicle Service & Maintenance</h1>
          <p>
            Book certified Suzuki service online or track your vehicle's live service progress in real time.
          </p>

          {/* TAB SWITCHER BUTTONS */}
          <div className="service-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "book" ? "active" : ""}`}
              onClick={() => setActiveTab("book")}
            >
              <Calendar size={18} />
              Book Service Slot
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "track" ? "active" : ""}`}
              onClick={() => setActiveTab("track")}
            >
              <Search size={18} />
              Track Service Status
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="container section">

        {/* =========================================================
            TAB 1: BOOK SERVICE FORM & OFFERINGS
        ========================================================= */}
        {activeTab === "book" && (
          <div className="service-booking-wrapper">
            
            {/* SUCCESS MODAL / CALLOUT */}
            {createdBooking ? (
              <div className="booking-success-card">
                <div className="success-icon-wrap">
                  <CheckCircle size={48} />
                </div>
                <h2>Service Booking Confirmed!</h2>
                <p>
                  Thank you, <strong>{createdBooking.customerName}</strong>! Your service request has been successfully registered.
                </p>

                <div className="booking-code-box">
                  <span className="code-label">Your Booking Reference Code:</span>
                  <div className="code-display">
                    <strong>{createdBooking.bookingCode}</strong>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => copyToClipboard(createdBooking.bookingCode)}
                      title="Copy Code"
                    >
                      {copiedCode ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
                    </button>
                  </div>
                  {copiedCode && <span className="copy-toast">Copied to clipboard!</span>}
                </div>

                <div className="booking-summary-grid">
                  <div className="summary-item">
                    <span>Vehicle Model</span>
                    <strong>{createdBooking.vehicleModel}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Service Type</span>
                    <strong>{createdBooking.serviceType.replace("_", " ")}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Date & Time</span>
                    <strong>{createdBooking.preferredDate} ({createdBooking.preferredTimeSlot || "Morning"})</strong>
                  </div>
                  <div className="summary-item">
                    <span>Contact Number</span>
                    <strong>{createdBooking.phone}</strong>
                  </div>
                </div>

                <div className="success-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setTrackQuery(createdBooking.bookingCode);
                      setActiveTab("track");
                      handleTrackSearch(createdBooking.bookingCode);
                    }}
                  >
                    Track Live Status <ChevronRight size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCreatedBooking(null);
                      setFormData({
                        customerName: "",
                        phone: "",
                        email: "",
                        vehicleModel: DEFAULT_SUZUKI_MODELS[0],
                        registrationNumber: "",
                        serviceType: SERVICE_TYPES[0].id,
                        preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
                        preferredTimeSlot: TIME_SLOTS[0],
                        notes: "",
                      });
                    }}
                  >
                    Book Another Service
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* SERVICE PACKAGES CARDS */}
                <div className="service-packages-section">
                  <h3>Select Service Package</h3>
                  <p>Choose from our specialized Suzuki maintenance & care services</p>

                  <div className="packages-grid">
                    {SERVICE_TYPES.map((pkg) => {
                      const IconComponent = pkg.icon;
                      const isSelected = formData.serviceType === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          className={`package-card ${isSelected ? "selected" : ""}`}
                          onClick={() => handleServiceSelect(pkg.id)}
                        >
                          <div className="package-header">
                            <div className="package-icon">
                              <IconComponent size={24} />
                            </div>
                            <span className="rec-tag">{pkg.recommendedMonths}</span>
                          </div>
                          <h4>{pkg.title}</h4>
                          <p>{pkg.description}</p>
                          <div className="select-indicator">
                            {isSelected ? <CheckCircle size={18} /> : <span>Select</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BOOKING FORM CARD */}
                <div className="booking-form-card">
                  <div className="form-header">
                    <Wrench size={28} />
                    <div>
                      <h3>Schedule Your Service Appointment</h3>
                      <p>Fill out the details below to reserve your vehicle service slot</p>
                    </div>
                  </div>

                  {formError && (
                    <div className="error-alert">
                      <AlertCircle size={20} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-grid">
                      {/* Customer Name */}
                      <div className="form-group">
                        <label htmlFor="customerName">
                          <User size={16} /> Full Name *
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          name="customerName"
                          placeholder="e.g., Rajesh Sharma"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="form-group">
                        <label htmlFor="phone">
                          <Phone size={16} /> Mobile Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="e.g., 9826012345"
                          value={formData.phone}
                          onChange={handleInputChange}
                          maxLength={10}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <label htmlFor="email">
                          <Mail size={16} /> Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="e.g., rajesh@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Vehicle Model */}
                      <div className="form-group">
                        <label htmlFor="vehicleModel">
                          <Bike size={16} /> Select Scooter / Vehicle Model *
                        </label>
                        <select
                          id="vehicleModel"
                          name="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={handleInputChange}
                          required
                        >
                          {availableVehicles.map((model) => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Registration Number */}
                      <div className="form-group">
                        <label htmlFor="registrationNumber">
                          <FileText size={16} /> Registration Number (Optional)
                        </label>
                        <input
                          type="text"
                          id="registrationNumber"
                          name="registrationNumber"
                          placeholder="e.g., MP04 AB 1234"
                          value={formData.registrationNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Service Type */}
                      <div className="form-group">
                        <label htmlFor="serviceType">
                          <Wrench size={16} /> Service Type *
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleInputChange}
                          required
                        >
                          {SERVICE_TYPES.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preferred Date */}
                      <div className="form-group">
                        <label htmlFor="preferredDate">
                          <Calendar size={16} /> Preferred Date *
                        </label>
                        <input
                          type="date"
                          id="preferredDate"
                          name="preferredDate"
                          min={new Date().toISOString().split("T")[0]}
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* Preferred Time Slot */}
                      <div className="form-group">
                        <label htmlFor="preferredTimeSlot">
                          <Clock size={16} /> Time Slot *
                        </label>
                        <select
                          id="preferredTimeSlot"
                          name="preferredTimeSlot"
                          value={formData.preferredTimeSlot}
                          onChange={handleInputChange}
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="form-group full-width">
                      <label htmlFor="notes">Special Requirements / Issue Description (Optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        placeholder="Mention any specific issue (e.g., brake noise, mileage check, oil leak)..."
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      disabled={submitting}
                    >
                      {submitting ? "Booking Service Slot..." : "Confirm & Submit Service Booking"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: TRACK SERVICE STATUS
        ========================================================= */}
        {activeTab === "track" && (
          <div className="track-service-wrapper">
            <div className="track-search-card">
              <h3>Track Your Vehicle Service</h3>
              <p>Enter your Booking Reference Code (e.g. <code>SRV-20260826-XXXX</code>) or your registered 10-digit Mobile Number to check real-time service progress.</p>

              <div className="track-search-form">
                <div className="input-with-icon">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Enter Booking Code or Mobile Number..."
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTrackSearch();
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleTrackSearch()}
                  disabled={trackLoading}
                >
                  {trackLoading ? "Searching..." : "Track Status"}
                </button>
              </div>

              {trackError && (
                <div className="error-alert mt-4">
                  <AlertCircle size={20} />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* TRACKING RESULTS */}
            {hasTracked && trackingResults.length > 0 && (
              <div className="tracking-results-list">
                {trackingResults.map((item) => {
                  const currentStepIdx = getStatusIndex(item.status);
                  const isCancelled = item.status === "CANCELLED";

                  return (
                    <div key={item.id} className="status-card">
                      <div className="status-card-header">
                        <div>
                          <span className="booking-badge">{item.bookingCode}</span>
                          <h2>{item.vehicleModel}</h2>
                          {item.registrationNumber && (
                            <span className="reg-tag">Reg: {item.registrationNumber}</span>
                          )}
                        </div>
                        <div className={`status-pill ${item.status.toLowerCase()}`}>
                          {item.status.replace("_", " ")}
                        </div>
                      </div>

                      {/* CUSTOMER & APPOINTMENT META */}
                      <div className="status-meta-grid">
                        <div>
                          <span>Customer Name</span>
                          <strong>{item.customerName}</strong>
                        </div>
                        <div>
                          <span>Service Type</span>
                          <strong>{item.serviceType.replace("_", " ")}</strong>
                        </div>
                        <div>
                          <span>Scheduled Date</span>
                          <strong>{item.preferredDate} ({item.preferredTimeSlot || "N/A"})</strong>
                        </div>
                        <div>
                          <span>Estimated Cost</span>
                          <strong className="cost-text">
                            {item.estimatedCost ? `₹${item.estimatedCost.toLocaleString("en-IN")}` : "To be quoted after inspection"}
                          </strong>
                        </div>
                      </div>

                      {/* TIMELINE PROGRESS */}
                      {isCancelled ? (
                        <div className="cancelled-banner">
                          <AlertCircle size={24} />
                          <div>
                            <strong>Service Booking Cancelled</strong>
                            <p>{item.adminNotes || "This service booking was cancelled. Please contact showroom for assistance."}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="status-timeline">
                          {STATUS_STEPS.map((step, idx) => {
                            const isDone = currentStepIdx >= idx;
                            const isCurrent = currentStepIdx === idx;

                            return (
                              <div
                                key={step.key}
                                className={`timeline-step ${isDone ? "completed" : ""} ${
                                  isCurrent ? "current" : ""
                                }`}
                              >
                                <div className="step-circle">
                                  {isDone ? <Check size={16} /> : idx + 1}
                                </div>
                                <div className="step-content">
                                  <strong>{step.label}</strong>
                                  <p>{step.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* TECHNICIAN / ADMIN NOTES */}
                      {item.adminNotes && (
                        <div className="admin-notes-box">
                          <FileText size={18} />
                          <div>
                            <strong>Technician Updates / Notes:</strong>
                            <p>{item.adminNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
