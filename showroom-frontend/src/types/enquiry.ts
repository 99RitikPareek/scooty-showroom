export interface EnquiryRequest {
  vehicleId: number;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  status?: string;
}

export interface EnquiryResponse {
  id: number;
  vehicleId: number;
  vehicleName: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}