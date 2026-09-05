import { getImageUrl } from "../../utils/imageUtils";
import { Link } from "react-router-dom";
import { ArrowRight, Bike } from "lucide-react";

import type { Vehicle } from "../../types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const imageUrl =
    vehicle.primaryImageUrl || vehicle.images?.[0]?.imageUrl;

  const detailUrl = `/vehicles/${vehicle.id}`;

  return (
    <article className="vehicle-card">
      <Link to={detailUrl} className="vehicle-card-image-link">
        <div className="vehicle-card-image">
          {imageUrl ? (
            <img
              src={getImageUrl(imageUrl)}
              alt={`${vehicle.brandName} ${vehicle.name}`}
            />
          ) : (
            <div className="vehicle-image-placeholder">
              <Bike size={48} />
            </div>
          )}

          <span className="vehicle-type-badge">
            {vehicle.vehicleType === "NEW"
              ? "NEW"
              : "PRE-OWNED"}
          </span>
        </div>
      </Link>

      <div className="vehicle-card-content">
        <span className="vehicle-brand">
          {vehicle.brandName}
        </span>

        <h3>
          <Link to={detailUrl} className="vehicle-card-title-link">
            {vehicle.name}
          </Link>
        </h3>

        <p className="vehicle-model">
          {vehicle.model}

          {vehicle.variant && (
            <> • {vehicle.variant}</>
          )}
        </p>

        <div className="vehicle-specs">
          {vehicle.engineCc && (
            <span>{vehicle.engineCc} cc</span>
          )}

          {vehicle.mileage && (
            <span>{vehicle.mileage} km/l</span>
          )}

          {vehicle.fuelType && (
            <span>{vehicle.fuelType}</span>
          )}
        </div>

        <div className="vehicle-card-bottom">
          <strong>
            ₹{Number(vehicle.price).toLocaleString("en-IN")}
          </strong>

          <Link
            to={detailUrl}
            className="vehicle-view-btn"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
