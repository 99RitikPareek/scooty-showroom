import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

import vehicleService from "../../services/vehicleService";
import enquiryService from "../../services/enquiryService";
import type { Vehicle } from "../../types/vehicle";
import type { EnquiryRequest } from "../../types/enquiry";
import { getErrorMessage } from "../../utils/errorUtils";

const EnquiryPage = () => {
  const { vehicleId: urlVehicleId } = useParams();
  const location = useLocation();

  // Selected vehicle ID state
  const initialVehicleId = urlVehicleId
    ? Number(urlVehicleId)
    : location.state?.vehicleId
    ? Number(location.state.vehicleId)
    : null;

  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    initialVehicleId
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ================= LOAD VEHICLES & SELECTED VEHICLE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingVehicles(true);

        const allVehicles = await vehicleService.getAll();
        setVehicles(allVehicles);

        // If an initial vehicle ID exists, find it or fetch its details
        if (selectedVehicleId) {
          const match = allVehicles.find((v) => v.id === selectedVehicleId);
          if (match) {
            setSelectedVehicle(match);
          } else {
            try {
              const fetched = await vehicleService.getById(selectedVehicleId);
              setSelectedVehicle(fetched);
            } catch {
              // Fallback if ID invalid
              setSelectedVehicleId(null);
            }
          }
        }
      } catch (err) {
        console.error("Load Vehicles Error:", err);
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadData();
  }, [selectedVehicleId]);

  /* ================= HANDLE VEHICLE DROPDOWN CHANGE ================= */
  const handleVehicleSelect = (idStr: string) => {
    if (!idStr) {
      setSelectedVehicleId(null);
      setSelectedVehicle(null);
      return;
    }

    const idNum = Number(idStr);
    setSelectedVehicleId(idNum);
    const match = vehicles.find((v) => v.id === idNum);
    setSelectedVehicle(match || null);
  };

  /* ================= SUBMIT ENQUIRY ================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!selectedVehicleId) {
      setError("Please select a vehicle to enquire about.");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      setSubmitting(true);

      const enquiryData: EnquiryRequest = {
        vehicleId: selectedVehicleId,
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
      };

      await enquiryService.create(enquiryData);

      setSuccess(true);
      setCustomerName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error("Enquiry Submit Error:", err);
      setError(
        getErrorMessage(
          err,
          "Unable to submit your enquiry right now. Please try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="public-page enquiry-page">
        <section className="enquiry-success-card">
          <div className="enquiry-success-icon">
            <CheckCircle2 size={52} />
          </div>

          <span className="enquiry-eyebrow">ENQUIRY SUBMITTED</span>
          <h1>Thank You!</h1>
          <p>
            Your enquiry for{" "}
            <strong>
              {selectedVehicle
                ? `${selectedVehicle.brandName || ""} ${selectedVehicle.name}`
                : "the vehicle"}
            </strong>{" "}
            has been submitted successfully. Our showroom team will contact you shortly.
          </p>

          <div className="enquiry-success-actions">
            <Link to="/vehicles" className="enquiry-secondary-btn">
              Explore Vehicles
            </Link>
            <Link to="/" className="enquiry-primary-btn">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="public-page enquiry-page">
      {/* HEADER */}
      <section className="enquiry-header">
        <Link to="/vehicles" className="enquiry-back-link">
          <ArrowLeft size={17} />
          Back to Vehicles
        </Link>

        <span className="enquiry-eyebrow">CUSTOMER ENQUIRY</span>
        <h1>
          {selectedVehicle
            ? `Enquire About ${selectedVehicle.brandName || ""} ${selectedVehicle.name}`
            : "Vehicle Enquiry"}
        </h1>
        <p>
          Fill in your contact details below and our Shri Hari Suzuki showroom team will contact you with pricing, offers, and details.
        </p>
      </section>

      {/* FORM SECTION */}
      <section className="enquiry-form-section">
        <div className="enquiry-form-card">
          <div className="enquiry-form-header">
            <div className="enquiry-form-icon">
              <MessageSquare size={23} />
            </div>
            <div>
              <h2>Send Your Enquiry</h2>
              <p>We'll get back to you with specs and best showroom offers.</p>
            </div>
          </div>

          {error && <div className="enquiry-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* VEHICLE SELECTION */}
            <div className="enquiry-field">
              <label htmlFor="vehicleSelect">Select Vehicle *</label>

              {loadingVehicles ? (
                <div style={{ color: "#64748b", fontSize: "0.9rem", padding: "8px 0" }}>
                  <LoaderCircle size={16} className="spin" style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                  Loading available vehicles...
                </div>
              ) : (
                <div className="enquiry-input-wrapper" style={{ paddingLeft: "12px" }}>
                  <Bike size={18} style={{ marginRight: "8px", color: "#64748b" }} />
                  <select
                    id="vehicleSelect"
                    value={selectedVehicleId || ""}
                    onChange={(e) => handleVehicleSelect(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      border: "none",
                      background: "transparent",
                      fontSize: "0.95rem",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">-- Choose a Vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brandName ? `${v.brandName} ` : ""}{v.name} ({v.model}) - ₹{Number(v.price).toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* SELECTED VEHICLE HIGHLIGHT CARD */}
            {selectedVehicle && (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div style={{ background: "#eff6ff", padding: "8px", borderRadius: "6px", color: "#2563eb" }}>
                  <Bike size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: "0.95rem", display: "block" }}>
                    {selectedVehicle.brandName || ""} {selectedVehicle.name} {selectedVehicle.variant ? `(${selectedVehicle.variant})` : ""}
                  </strong>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Model: {selectedVehicle.model} • Price: ₹{Number(selectedVehicle.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}

            {/* FULL NAME */}
            <div className="enquiry-field">
              <label htmlFor="customerName">Full Name *</label>
              <div className="enquiry-input-wrapper">
                <User size={18} />
                <input
                  id="customerName"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="enquiry-field">
              <label htmlFor="email">Email Address *</label>
              <div className="enquiry-input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="enquiry-field">
              <label htmlFor="phone">Phone Number *</label>
              <div className="enquiry-input-wrapper">
                <Phone size={18} />
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="enquiry-field">
              <label htmlFor="message">Message</label>
              <div className="enquiry-textarea-wrapper">
                <MessageSquare size={18} />
                <textarea
                  id="message"
                  placeholder="Tell us what you would like to know (pricing, EMI, availability...)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="enquiry-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoaderCircle size={18} className="spin" />
                  Submitting Enquiry...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EnquiryPage;
