import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Bike,
  AlertCircle,
} from "lucide-react";

import VehicleCard from "../../components/vehicle/VehicleCard";
import VehicleFilters from "../../components/vehicle/VehicleFilters";
import VehicleSkeleton from "../../components/vehicle/VehicleSkeleton";

import vehicleService from "../../services/vehicleService";
import type {
  Vehicle,
  VehicleFilters as VehicleFilterParams,
} from "../../types/vehicle";

const PAGE_SIZE = 12;

const VehiclesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = searchParams.get("type");
  const urlCategory = searchParams.get("category");
  const urlModel = searchParams.get("model");

  const type =
    urlType === "NEW" || urlType === "USED"
      ? urlType
      : null;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"" | "NEW" | "USED">(type ?? "");
  const [category, setCategory] = useState(urlCategory || "");
  const [modelFilter, setModelFilter] = useState(urlModel || "");
  const [fuelType, setFuelType] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const clearFilters = () => {
    setSearch("");
    setFilterType("");
    setCategory("");
    setModelFilter("");
    setFuelType("");
    setSortBy("");
    setSearchParams({});
  };

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /*
   * ============================================================
   * LOAD VEHICLES FROM BACKEND
   * ============================================================
   */

  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters: VehicleFilterParams = {
        keyword: search.trim() || undefined,

        vehicleType:
          filterType === "NEW" || filterType === "USED"
            ? filterType
            : undefined,

        category: category || undefined,
        model: modelFilter || undefined,
        fuelType: fuelType || undefined,

        page,
        size: PAGE_SIZE,

        sortBy,
        sortDir,

        available: true,
      };

      const response = await vehicleService.filter(filters);

      setVehicles(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
      setTotalElements(response.totalElements ?? 0);
    } catch (err) {
      console.error("Vehicle API Error:", err);

      setVehicles([]);
      setTotalPages(0);
      setTotalElements(0);

      setError(
        "Unable to load vehicles right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [
    search,
    filterType,
    category,
    modelFilter,
    fuelType,
    page,
    sortBy,
    sortDir,
  ]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  /*
   * ============================================================
   * URL SYNC
   * ============================================================
   */

  useEffect(() => {
    setFilterType(type ?? "");
    setCategory(urlCategory || "");
    setModelFilter(urlModel || "");
    setPage(0);
  }, [type, urlCategory, urlModel]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleTypeChange = (value: string) => {
    const newType =
      value === "NEW" || value === "USED"
        ? value
        : "";

    setFilterType(newType);
    setPage(0);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setModelFilter("");
    setPage(0);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("category", value);
    } else {
      newParams.delete("category");
    }
    newParams.delete("model");
    setSearchParams(newParams);
  };

  const handleModelChange = (value: string) => {
    setModelFilter(value);
    setPage(0);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("model", value);
    } else {
      newParams.delete("model");
    }
    setSearchParams(newParams);
  };

  const handleFuelTypeChange = (value: string) => {
    setFuelType(value);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    if (value === "price-asc") {
      setSortBy("price");
      setSortDir("asc");
    } else if (value === "price-desc") {
      setSortBy("price");
      setSortDir("desc");
    } else if (value === "name-asc") {
      setSortBy("name");
      setSortDir("asc");
    } else {
      setSortBy("createdAt");
      setSortDir("desc");
    }

    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((current) => current - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((current) => current + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const title =
    modelFilter
      ? `Suzuki ${modelFilter} Models`
      : category === "SCOOTER"
        ? "Suzuki Scooters (Scooty)"
        : category === "BIKE"
          ? "Suzuki Motorcycles (Bikes)"
          : category === "ELECTRIC"
            ? "Suzuki Electric Vehicles (EV)"
            : type === "NEW"
              ? "New Suzuki Vehicles"
              : type === "USED"
                ? "Pre-Owned Vehicles"
                : "Our Vehicles";

  const description =
    "Explore Access 125, Avenis 125, Burgman Street, Gixxer, Gixxer SF & Electric mobility at Shri Hari Suzuki.";

  return (
    <main className="vehicles-page">

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <span>SHRI HARI SUZUKI</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      {/* VEHICLES SECTION */}
      <section className="section">
        <div className="container">

          {/* TOOLBAR */}
          <div className="vehicle-toolbar">
            <div>
              <h2>Available Vehicles</h2>

              {!loading && !error && (
                <p>
                  {totalElements}{" "}
                  {totalElements === 1 ? "vehicle" : "vehicles"}{" "}
                  available
                </p>
              )}

              {loading && <p>Loading vehicles...</p>}
            </div>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="category-filter-pills-bar">
            <button
              type="button"
              className={`category-pill ${!category ? 'active' : ''}`}
              onClick={() => handleCategoryChange("")}
            >
              All Vehicles
            </button>
            <button
              type="button"
              className={`category-pill ${category === 'SCOOTER' ? 'active' : ''}`}
              onClick={() => handleCategoryChange("SCOOTER")}
            >
              🛵 Scooty / Scooters
            </button>
            <button
              type="button"
              className={`category-pill ${category === 'BIKE' ? 'active' : ''}`}
              onClick={() => handleCategoryChange("BIKE")}
            >
              🏍️ Bikes / Motorcycles
            </button>
            <button
              type="button"
              className={`category-pill ${category === 'ELECTRIC' ? 'active' : ''}`}
              onClick={() => handleCategoryChange("ELECTRIC")}
            >
              ⚡ EV / Electric
            </button>
          </div>

          {/* SEARCH + FILTERS */}
          <VehicleFilters
            search={search}
            type={filterType}
            category={category}
            model={modelFilter}
            fuelType={fuelType}
            sortBy={
              sortBy === "price" && sortDir === "asc"
                ? "price-asc"
                : sortBy === "price" && sortDir === "desc"
                  ? "price-desc"
                  : sortBy === "name" && sortDir === "asc"
                    ? "name-asc"
                    : ""
            }
            onSearchChange={handleSearchChange}
            onTypeChange={handleTypeChange}
            onCategoryChange={handleCategoryChange}
            onModelChange={handleModelChange}
            onFuelTypeChange={handleFuelTypeChange}
            onSortChange={handleSortChange}
            onClear={clearFilters}
          />

          {/* LOADING */}
          {loading && (
            <div className="vehicles-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <VehicleSkeleton key={index} />
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="vehicle-state error-state">
              <AlertCircle size={42} />
              <h3>Unable to load vehicles</h3>
              <p>{error}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={loadVehicles}
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && vehicles.length === 0 && (
            <div className="vehicle-state">
              <Bike size={42} />
              <h3>No Vehicles Found</h3>
              <p>There are currently no vehicles matching your selected model or filter criteria.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* VEHICLE GRID */}
          {!loading && !error && vehicles.length > 0 && (
            <>
              <div className="vehicles-grid">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="vehicle-pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={page === 0}
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>

                  <span className="pagination-info">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={page >= totalPages - 1}
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

    </main>
  );
};

export default VehiclesPage;
