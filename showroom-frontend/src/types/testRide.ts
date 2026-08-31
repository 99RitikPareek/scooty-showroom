export interface TestRideRequest {
  vehicleId: number;
  customerName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime?: string;
  status?: string;
  message?: string;
}

export interface TestRideResponse {
  id: number;
  vehicleId: number;
  vehicleName?: string;
  customerName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime?: string | null;
  status?: string;
  message?: string | null;
  createdAt?: string;
  updatedAt?: string;
}