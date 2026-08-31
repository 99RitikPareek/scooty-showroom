export type VehicleType = "NEW" | "USED";

export interface VehicleImage {
  id: number;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
}

export interface Vehicle {
  id: number;

  brandId: number;
  brandName: string;

  name: string;
  model: string;
  variant?: string | null;

  vehicleType: VehicleType;

  price: number;
  engineCc?: number | null;
  mileage?: number | null;

  fuelType?: string | null;
  transmission?: string | null;
  color?: string | null;
  description?: string | null;

  featured: boolean;
  available: boolean;

  registrationYear?: number | null;
  ownerCount?: number | null;
  kilometersDriven?: number | null;
  condition?: string | null;
  registrationNumber?: string | null;
  insuranceValidUntil?: string | null;

  images: VehicleImage[];
  primaryImageUrl?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFilters {
  keyword?: string;
  brandId?: number;
  vehicleType?: VehicleType;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  featured?: boolean;
  fuelType?: string;

  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface VehiclePageResponse {
  content: Vehicle[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface VehicleRequest {
  brandId: number;
  name: string;
  model: string;
  variant?: string;
  vehicleType: VehicleType;

  price: number;
  engineCc?: number;
  mileage?: number;

  fuelType?: string;
  transmission?: string;
  color?: string;
  description?: string;

  featured?: boolean;
  available?: boolean;

  registrationYear?: number;
  ownerCount?: number;
  kilometersDriven?: number;
  condition?: string;
  registrationNumber?: string;
  insuranceValidUntil?: string;
}

export interface VehicleImageRequest {
  imageUrl: string;
  altText?: string;
  displayOrder?: number;
}
