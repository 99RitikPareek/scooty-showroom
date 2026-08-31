import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  User,
  Mail,
  Bike,
  AlertCircle,
} from "lucide-react";

import vehicleService from "../../services/vehicleService";
import testRideService from "../../services/testRideService";

import type { Vehicle } from "../../types/vehicle";
import type { TestRideRequest } from "../../types/testRide";

const TestRidePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<TestRideRequest>({
    vehicleId: 0,
    customerName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  // =========================
  // LOAD AVAILABLE VEHICLES
  // =========================

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoadingVehicles(true);
        setError("");

        const data = await vehicleService.getAvailable();

        setVehicles(data);
      } catch (err) {
        console.error("Vehicle loading error:", err);

        setError(
          "Unable to load available vehicles. Please try again."
        );
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "vehicleId"
          ? Number(value)
          : value,
    }));
  };

  // =========================
  // SUBMIT TEST RIDE
  // =========================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      if (!formData.vehicleId) {
        setError("Please select a vehicle.");
        return;
      }

      await testRideService.create(formData);

      setSuccess(true);

      setFormData({
        vehicleId: 0,
        customerName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    } catch (err) {
      console.error("Test ride submission error:", err);

      setError(
        "Unable to submit your test ride request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (success) {
    return (
      <main className="test-ride-page">

        <section className="page-hero">
          <div className="container">
            <span>SHRI HARI SUZUKI</span>

            <h1>Book a Test Ride</h1>

            <p>
              Experience your preferred Suzuki vehicle before
              making your decision.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">

            <div className="test-ride-card">

              <div className="test-ride-success">

                <CheckCircle2 size={56} />

                <h2>Request Submitted Successfully</h2>

                <p>
                  Thank you for your test ride request.
                  Our showroom team will contact you shortly
                  to confirm your appointment.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSuccess(false)}
                >
                  Book Another Test Ride
                </button>

              </div>

            </div>

          </div>
        </section>

      </main>
    );
  }

  return (
    <main className="test-ride-page">

      {/* ================= HERO ================= */}

      <section className="page-hero">

        <div className="container">

          <span>SHRI HARI SUZUKI</span>

          <h1>Book a Test Ride</h1>

          <p>
            Experience your preferred Suzuki vehicle before
            making your decision. Choose a convenient date
            and time for your test ride.
          </p>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="section">

        <div className="container test-ride-layout">

          {/* ================= LEFT ================= */}

          <div className="test-ride-info">

            <span className="section-label">
              EXPERIENCE THE RIDE
            </span>

            <h2>
              Feel The Ride Before You Decide
            </h2>

            <p className="test-ride-description">
              Book a test ride at Shri Hari Suzuki and
              experience the performance, comfort and
              features of your preferred vehicle.
            </p>

            <div className="test-ride-benefits">

              <div className="test-ride-benefit">

                <div className="benefit-icon">
                  <Bike size={22} />
                </div>

                <div>
                  <h3>Choose Your Vehicle</h3>

                  <p>
                    Select an available vehicle directly
                    from our showroom inventory.
                  </p>
                </div>

              </div>

              <div className="test-ride-benefit">

                <div className="benefit-icon">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h3>Choose Date & Time</h3>

                  <p>
                    Select a convenient date and preferred
                    time for your test ride.
                  </p>
                </div>

              </div>

              <div className="test-ride-benefit">

                <div className="benefit-icon">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h3>Get Confirmation</h3>

                  <p>
                    Our showroom team will contact you
                    to confirm your appointment.
                  </p>
                </div>

              </div>

            </div>

            {/* SHOWROOM */}

            <div className="test-ride-showroom">

              <div className="showroom-icon">
                <MapPin size={22} />
              </div>

              <div>

                <h3>Shri Hari Suzuki</h3>

                <p>
                  Hotel The Sara, AB Road,
                  <br />
                  Guna, Madhya Pradesh - 473001
                </p>

                <a href="tel:9425131697">

                  <Phone size={16} />

                  94251 31697

                </a>

              </div>

            </div>

          </div>

          {/* ================= FORM ================= */}

          <div className="test-ride-card">

            <div className="test-ride-card-heading">

              <span>TEST RIDE REQUEST</span>

              <h2>Book Your Test Ride</h2>

              <p>
                Fill in your details and our team will
                get in touch with you.
              </p>

            </div>

            {/* ERROR */}

            {error && (

              <div className="form-error">

                <AlertCircle size={18} />

                <span>{error}</span>

              </div>

            )}

            <form
              className="test-ride-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="customerName">
                  Full Name
                </label>

                <div className="input-with-icon">

                  <User size={18} />

                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="phone">
                  Mobile Number
                </label>

                <div className="input-with-icon">

                  <Phone size={18} />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-with-icon">

                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* VEHICLE */}

              <div className="form-group">

                <label htmlFor="vehicleId">
                  Preferred Vehicle
                </label>

                <div className="input-with-icon">

                  <Bike size={18} />

                  <select
                    id="vehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                    disabled={loadingVehicles}
                  >

                    <option value={0} disabled>
                      {loadingVehicles
                        ? "Loading vehicles..."
                        : "Select vehicle"}
                    </option>

                    {vehicles.map((vehicle) => (

                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.brandName}{" "}
                        {vehicle.name}
                        {vehicle.variant
                          ? ` - ${vehicle.variant}`
                          : ""}
                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* DATE + TIME */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="preferredDate">
                    Preferred Date
                  </label>

                  <div className="input-with-icon">

                    <CalendarDays size={18} />

                    <input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label htmlFor="preferredTime">
                    Preferred Time
                  </label>

                  <div className="input-with-icon">

                    <Clock3 size={18} />

                    <input
                      id="preferredTime"
                      name="preferredTime"
                      type="time"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div className="form-group">

                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Anything you would like us to know?"
                  value={formData.message}
                  onChange={handleChange}
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary test-ride-submit"
                disabled={submitting || loadingVehicles}
              >

                <CalendarDays size={18} />

                {submitting
                  ? "Submitting Request..."
                  : "Request Test Ride"}

              </button>

              <p className="form-note">
                Our showroom team will contact you to confirm
                availability.
              </p>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
};

export default TestRidePage;
