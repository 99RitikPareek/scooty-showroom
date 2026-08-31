export interface OfferRequest {
  vehicleId: number;
  title: string;
  description?: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  active?: boolean;
}

export interface OfferResponse {
  id: number;
  vehicleId: number;
  vehicleName?: string;
  title: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}