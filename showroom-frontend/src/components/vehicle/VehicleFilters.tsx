import { Search, SlidersHorizontal, X } from "lucide-react";

interface VehicleFiltersProps {
  search: string;
  type: string;
  fuelType: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onFuelTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

const VehicleFilters = ({
  search,
  type,
  fuelType,
  sortBy,
  onSearchChange,
  onTypeChange,
  onFuelTypeChange,
  onSortChange,
  onClear,
}: VehicleFiltersProps) => {
  const hasFilters =
    search.trim() !== "" ||
    type !== "" ||
    fuelType !== "" ||
    sortBy !== "";

  return (
    <div className="vehicle-filters-panel">

      {/* FILTER HEADER */}
      <div className="filter-heading">
        <div className="filter-heading-left">
          <SlidersHorizontal size={18} />
          <span>Filter Vehicles</span>
        </div>

        {hasFilters && (
          <button
            type="button"
            className="clear-filter-btn"
            onClick={onClear}
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="vehicle-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search vehicle, model or brand..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="vehicle-filter-row">

        {/* VEHICLE TYPE */}
        <div className="filter-field">
          <label htmlFor="vehicle-type">
            Vehicle Type
          </label>

          <select
            id="vehicle-type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">All Vehicles</option>
            <option value="NEW">New</option>
            <option value="USED">Pre-Owned</option>
          </select>
        </div>

        {/* FUEL TYPE */}
        <div className="filter-field">
          <label htmlFor="fuel-type">
            Fuel Type
          </label>

          <select
            id="fuel-type"
            value={fuelType}
            onChange={(e) => onFuelTypeChange(e.target.value)}
          >
            <option value="">All Fuel Types</option>
            <option value="PETROL">Petrol</option>
            <option value="ELECTRIC">Electric</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        {/* SORT */}
        <div className="filter-field">
          <label htmlFor="vehicle-sort">
            Sort By
          </label>

          <select
            id="vehicle-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Default</option>

            <option value="price-asc">
              Price: Low to High
            </option>

            <option value="price-desc">
              Price: High to Low
            </option>

            <option value="name-asc">
              Name: A to Z
            </option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default VehicleFilters;