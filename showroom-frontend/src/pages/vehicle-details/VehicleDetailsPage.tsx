import { getImageUrl } from "../../utils/imageUtils";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  CalendarDays,
  CheckCircle2,
  Fuel,
  Gauge,
  IndianRupee,
  Settings2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import vehicleService from "../../services/vehicleService";
import type { Vehicle } from "../../types/vehicle";

const VehicleDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVehicle = async () => {
    if (!id) {
      setError("Vehicle ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await vehicleService.getById(
        Number(id)
      );

      setVehicle(data);
    } catch (err) {
      console.error("Failed to load vehicle:", err);

      setError(
        "Unable to load vehicle details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <main className="vehicle-details-page">
        <div className="container">
          <div className="vehicle-status">
            <RefreshCw
              size={36}
              className="loading-icon"
            />

            <h3>Loading vehicle details...</h3>

            <p>
              Fetching vehicle information from
              Shri Hari Suzuki.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="vehicle-details-page">
        <div className="container">
          <div className="vehicle-status error">
            <AlertCircle size={40} />

            <h3>Vehicle not found</h3>

            <p>
              {error ||
                "The requested vehicle could not be found."}
            </p>

            <div className="vehicle-empty-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={loadVehicle}
              >
                Try Again
              </button>

              <Link
                to="/vehicles"
                className="btn btn-secondary"
              >
                Back To Vehicles
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const activeImage =
    selectedImage || (vehicle.images?.length > 0 ? vehicle.images[0].imageUrl : null);

  return (
    <main className="vehicle-details-page">

      {/* BREADCRUMB */}
      <section className="page-hero vehicle-details-hero">
        <div className="container">

          <Link
            to="/vehicles"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Back To Vehicles
          </Link>

          <span>
            {vehicle.vehicleType === "NEW"
              ? "NEW SUZUKI VEHICLE"
              : "PRE-OWNED VEHICLE"}
          </span>

          <h1>
            {vehicle.brandName} {vehicle.name}
          </h1>

          {vehicle.model && (
            <p>
              {vehicle.model}
              {vehicle.variant
                ? ` • ${vehicle.variant}`
                : ""}
            </p>
          )}
        </div>
      </section>

      {/* DETAILS */}
      <section className="section">
        <div className="container">

          <div className="vehicle-details-layout">

            {/* IMAGE */}
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
                    <span>
                      Vehicle image unavailable
                    </span>
                  </div>
                )}

                <span className="vehicle-type-badge">
                  {vehicle.vehicleType === "NEW"
                    ? "NEW"
                    : "PRE-OWNED"}
                </span>

              </div>

              {vehicle.images &&
                vehicle.images.length > 1 && (
                  <div className="vehicle-thumbnail-grid">

                    {vehicle.images.map((image) => (
                      <img
                        key={image.id}
                        src={getImageUrl(image.imageUrl)} onClick={() => setSelectedImage(image.imageUrl)} style={{ cursor: "pointer" }}
                        alt={
                          image.altText ||
                          `${vehicle.name} image`
                        }
                      />
                    ))}

                  </div>
                )}

            </div>

            {/* INFORMATION */}
            <div className="vehicle-details-content">

              <div className="vehicle-detail-heading">

                <span className="vehicle-brand">
                  {vehicle.brandName}
                </span>

                <h2>
                  {vehicle.name}
                  {vehicle.model &&
                    ` ${vehicle.model}`}
                </h2>

                {vehicle.variant && (
                  <p className="vehicle-variant">
                    {vehicle.variant}
                  </p>
                )}

              </div>

              {/* PRICE */}
              <div className="vehicle-detail-price">

                <span>Starting Price</span>

                <strong>
                  <IndianRupee size={24} />
                  {Number(
                    vehicle.price
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

              {/* STATUS */}
              <div className="vehicle-availability">

                {vehicle.available ? (
                  <>
                    <CheckCircle2 size={18} />
                    Available At Showroom
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} />
                    Currently Unavailable
                  </>
                )}

              </div>

              {/* SPECIFICATIONS */}
              <div className="vehicle-specifications">

                {vehicle.engineCc && (
                  <div className="spec-item">
                    <Gauge size={22} />

                    <div>
                      <span>Engine</span>
                      <strong>
                        {vehicle.engineCc} cc
                      </strong>
                    </div>
                  </div>
                )}

                {vehicle.mileage && (
                  <div className="spec-item">
                    <Gauge size={22} />

                    <div>
                      <span>Mileage</span>
                      <strong>
                        {vehicle.mileage} km/l
                      </strong>
                    </div>
                  </div>
                )}

                {vehicle.fuelType && (
                  <div className="spec-item">
                    <Fuel size={22} />

                    <div>
                      <span>Fuel Type</span>
                      <strong>
                        {vehicle.fuelType}
                      </strong>
                    </div>
                  </div>
                )}

                {vehicle.transmission && (
                  <div className="spec-item">
                    <Settings2 size={22} />

                    <div>
                      <span>Transmission</span>
                      <strong>
                        {vehicle.transmission}
                      </strong>
                    </div>
                  </div>
                )}

                {vehicle.color && (
                  <div className="spec-item">

                    <div className="color-dot" />

                    <div>
                      <span>Color</span>
                      <strong>
                        {vehicle.color}
                      </strong>
                    </div>

                  </div>
                )}

                {vehicle.registrationYear && (
                  <div className="spec-item">

                    <div className="spec-icon-text">
                      {vehicle.registrationYear}
                    </div>

                    <div>
                      <span>
                        Registration Year
                      </span>

                      <strong>
                        {vehicle.registrationYear}
                      </strong>
                    </div>

                  </div>
                )}

                {vehicle.kilometersDriven && (
                  <div className="spec-item">

                    <div className="spec-icon-text">
                      KM
                    </div>

                    <div>
                      <span>
                        Kilometers Driven
                      </span>

                      <strong>
                        {vehicle.kilometersDriven.toLocaleString(
                          "en-IN"
                        )}{" "}
                        km
                      </strong>
                    </div>

                  </div>
                )}

                {vehicle.ownerCount && (
                  <div className="spec-item">

                    <div className="spec-icon-text">
                      {vehicle.ownerCount}
                    </div>

                    <div>
                      <span>
                        Previous Owners
                      </span>

                      <strong>
                        {vehicle.ownerCount}
                      </strong>
                    </div>

                  </div>
                )}

              </div>

              {/* DESCRIPTION */}
              {vehicle.description && (
                <div className="vehicle-description">

                  <h3>About This Vehicle</h3>

                  <p>
                    {vehicle.description}
                  </p>

                </div>
              )}

              {/* ACTIONS */}
              <div className="vehicle-detail-actions">

                <Link
                  to={`/test-ride/${vehicle.id}`}
                  className="btn btn-primary"
                >
                  <CalendarDays size={18} />
                  Book Test Ride
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to={`/enquiry/${vehicle.id}`}
                  className="btn btn-secondary"
                >
                  Enquire Now
                </Link>

              </div>

              <p className="vehicle-contact-note">
                Contact Shri Hari Suzuki for current
                pricing, offers and availability.
              </p>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
};

export default VehicleDetailsPage;