import { getImageUrl } from "../../utils/imageUtils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Bike,
  RefreshCw,
} from "lucide-react";

import vehicleService from "../../services/vehicleService";
import type { Vehicle } from "../../types/vehicle";

const AdminVehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");

  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await vehicleService.getAll();

      setVehicles(data);
    } catch (err) {
      console.error("Admin Vehicles Error:", err);

      setVehicles([]);
      setError("Unable to load vehicles from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const filteredVehicles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !keyword ||
        vehicle.name?.toLowerCase().includes(keyword) ||
        vehicle.model?.toLowerCase().includes(keyword) ||
        vehicle.brandName?.toLowerCase().includes(keyword) ||
        vehicle.variant?.toLowerCase().includes(keyword);

      const matchesType =
        !typeFilter ||
        vehicle.vehicleType === typeFilter;

      const matchesFuel =
        !fuelFilter ||
        vehicle.fuelType === fuelFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesFuel
      );
    });
  }, [vehicles, search, typeFilter, fuelFilter]);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await vehicleService.delete(id);

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (vehicle) => vehicle.id !== id
        )
      );
    } catch (err) {
      console.error("Delete Vehicle Error:", err);

      alert(
        "Unable to delete this vehicle. Please try again."
      );
    }
  };

  const getPrimaryImage = (vehicle: Vehicle) => {
    if (
      vehicle.images &&
      vehicle.images.length > 0
    ) {
      return vehicle.images
        .slice()
        .sort(
          (a, b) =>
            (a.displayOrder ?? 0) -
            (b.displayOrder ?? 0)
        )[0]?.imageUrl;
    }

    return null;
  };

  return (
    <main className="admin-page">

      {/* HEADER */}
      <div className="admin-page-header">

        <div>
          <span className="admin-page-eyebrow">
            INVENTORY MANAGEMENT
          </span>

          <h1>Vehicles</h1>

          <p>
            Manage your showroom vehicle inventory.
          </p>
        </div>

        <div className="admin-page-header-actions">

          <button
            type="button"
            className="admin-icon-btn"
            onClick={loadVehicles}
            title="Refresh vehicles"
          >
            <RefreshCw
              size={18}
              className={loading ? "spin" : ""}
            />
          </button>

          <Link
            to="/admin/vehicles/new"
            className="admin-primary-btn"
          >
            <Plus size={18} />
            Add Vehicle
          </Link>

        </div>

      </div>

      {/* FILTER PANEL */}
      <section className="admin-filter-card">

        <div className="admin-search-box">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search vehicle, model, brand..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="admin-filter-select">

          <label>Vehicle Type</label>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="">
              All Vehicles
            </option>

            <option value="NEW">
              New
            </option>

            <option value="USED">
              Pre-Owned
            </option>
          </select>

        </div>

        <div className="admin-filter-select">

          <label>Fuel Type</label>

          <select
            value={fuelFilter}
            onChange={(e) =>
              setFuelFilter(e.target.value)
            }
          >
            <option value="">
              All Fuel Types
            </option>

            <option value="PETROL">
              Petrol
            </option>

            <option value="ELECTRIC">
              Electric
            </option>

            <option value="CNG">
              CNG
            </option>
          </select>

        </div>

      </section>

      {/* RESULT COUNT */}
      {!loading && !error && (
        <div className="admin-result-info">
          <span>
            Showing{" "}
            <strong>
              {filteredVehicles.length}
            </strong>{" "}
            of{" "}
            <strong>
              {vehicles.length}
            </strong>{" "}
            vehicles
          </span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <section className="admin-state-card">

          <RefreshCw
            size={38}
            className="spin"
          />

          <h2>Loading Vehicles</h2>

          <p>
            Fetching vehicle inventory from the
            backend.
          </p>

        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="admin-state-card admin-error-state">

          <XCircle size={42} />

          <h2>Unable to Load Vehicles</h2>

          <p>{error}</p>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={loadVehicles}
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </section>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        filteredVehicles.length === 0 && (
          <section className="admin-state-card">

            <Bike size={42} />

            <h2>
              {vehicles.length === 0
                ? "No Vehicles Found"
                : "No Matching Vehicles"}
            </h2>

            <p>
              {vehicles.length === 0
                ? "There are no vehicles in the showroom inventory yet."
                : "Try changing your search or filters."}
            </p>

            {vehicles.length === 0 && (
              <Link
                to="/admin/vehicles/new"
                className="admin-primary-btn"
              >
                <Plus size={17} />
                Add First Vehicle
              </Link>
            )}

          </section>
        )}

      {/* VEHICLE TABLE */}
      {!loading &&
        !error &&
        filteredVehicles.length > 0 && (
          <section className="admin-table-card">

            <div className="admin-table-wrapper">

              <table className="admin-vehicles-table">

                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Fuel</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredVehicles.map(
                    (vehicle) => {
                      const image =
                        getPrimaryImage(vehicle);

                      return (
                        <tr key={vehicle.id}>

                          {/* VEHICLE */}
                          <td>
                            <div className="admin-vehicle-info">

                              <div className="admin-vehicle-image">

                                {image ? (
                                  <img
                                    src={getImageUrl(image)}
                                    alt={
                                      vehicle.name
                                    }
                                  />
                                ) : (
                                  <Bike
                                    size={27}
                                  />
                                )}

                              </div>

                              <div>

                                <strong>
                                  {
                                    vehicle.name
                                  }
                                </strong>

                                <span>
                                  {
                                    vehicle.brandName
                                  }{" "}
                                  •{" "}
                                  {
                                    vehicle.model
                                  }

                                  {vehicle.variant
                                    ? ` • ${vehicle.variant}`
                                    : ""}
                                </span>

                              </div>

                            </div>
                          </td>

                          {/* TYPE */}
                          <td>
                            <span
                              className={`admin-type-badge ${
                                vehicle.vehicleType ===
                                "NEW"
                                  ? "new"
                                  : "used"
                              }`}
                            >
                              {vehicle.vehicleType ===
                              "NEW"
                                ? "NEW"
                                : "PRE-OWNED"}
                            </span>
                          </td>

                          {/* PRICE */}
                          <td>
                            <strong>
                              ₹
                              {Number(
                                vehicle.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </td>

                          {/* FUEL */}
                          <td>
                            {vehicle.fuelType ||
                              "—"}
                          </td>

                          {/* AVAILABLE */}
                          <td>

                            {vehicle.available ? (
                              <span className="admin-status available">
                                <CheckCircle2
                                  size={15}
                                />
                                Available
                              </span>
                            ) : (
                              <span className="admin-status unavailable">
                                <XCircle
                                  size={15}
                                />
                                Unavailable
                              </span>
                            )}

                          </td>

                          {/* FEATURED */}
                          <td>

                            {vehicle.featured ? (
                              <span className="admin-featured">
                                <Star
                                  size={15}
                                  fill="currentColor"
                                />
                                Featured
                              </span>
                            ) : (
                              <span className="admin-not-featured">
                                —
                              </span>
                            )}

                          </td>

                          {/* ACTIONS */}
                          <td>

                            <div className="admin-action-buttons">

                              <Link
                                to={`/admin/vehicles/${vehicle.id}/edit`}
                                className="admin-action-btn edit"
                                title="Edit vehicle"
                              >
                                <Pencil
                                  size={17}
                                />
                              </Link>

                              <button
                                type="button"
                                className="admin-action-btn delete"
                                title="Delete vehicle"
                                onClick={() =>
                                  handleDelete(
                                    vehicle.id
                                  )
                                }
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

    </main>
  );
};

export default AdminVehiclesPage;