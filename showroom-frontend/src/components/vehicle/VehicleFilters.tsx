import { Search, SlidersHorizontal, X } from "lucide-react";

interface VehicleFiltersProps {
  search: string;
  type: string;
  category: string;
  model: string;
  fuelType: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onFuelTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

const VehicleFilters = ({
  search,
  type,
  category,
  model,
  fuelType,
  sortBy,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onModelChange,
  onFuelTypeChange,
  onSortChange,
  onClear,
}: VehicleFiltersProps) => {
  const hasFilters =
    search.trim() !== "" ||
    type !== "" ||
    category !== "" ||
    model !== "" ||
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

        {/* CATEGORY */}
        <div className="filter-field">
          <label htmlFor="vehicle-category">
            Category
          </label>

          <select
            id="vehicle-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="SCOOTER">🛵 Scooty / Scooter</option>
            <option value="BIKE">🏍️ Bike / Motorcycle</option>
            <option value="ELECTRIC">⚡ EV / Electric</option>
          </select>
        </div>

        {/* SPECIFIC MODEL */}
        <div className="filter-field">
          <label htmlFor="vehicle-model">
            Model
          </label>

          <select
            id="vehicle-model"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
          >
            <option value="">All Models</option>
            {(!category || category === "SCOOTER") && (
              <optgroup label="Scooters">
                <option value="Access">Access 125</option>
                <option value="Avenis">Avenis 125</option>
                <option value="Burgman">Burgman Street</option>
              </optgroup>
            )}
            {(!category || category === "BIKE") && (
              <optgroup label="Bikes">
                <option value="Gixxer">Gixxer</option>
                <option value="SF">Gixxer SF</option>
              </optgroup>
            )}
            {(!category || category === "ELECTRIC") && (
              <optgroup label="Electric EV">
                <option value="Access">e-Access (EV Access)</option>
                <option value="Burgman">e-Burgman (EV Burgman)</option>
              </optgroup>
            )}
          </select>
        </div>

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
