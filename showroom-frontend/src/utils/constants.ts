export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "showroom_access_token",
  ADMIN: "showroom_admin",
} as const;

export const VEHICLE_TYPES = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "USED",
    label: "Used",
  },
] as const;

export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
] as const;

export const SORT_OPTIONS = [
  {
    value: "createdAt-desc",
    label: "Newest First",
  },
  {
    value: "createdAt-asc",
    label: "Oldest First",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Name: A-Z",
  },
] as const;