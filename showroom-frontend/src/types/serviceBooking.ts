export type ServiceBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface ServiceBookingRequest {
  customerName: string;
  email?: string;
  phone: string;
  vehicleModel: string;
  registrationNumber?: string;
  serviceType: string;
  preferredDate: string;
  preferredTimeSlot?: string;
  notes?: string;
}

export interface ServiceBookingStatusUpdateRequest {
  status: ServiceBookingStatus;
  estimatedCost?: number;
  adminNotes?: string;
}

export interface ServiceBooking {
  id: number;
  bookingCode: string;
  customerName: string;
  email?: string;
  phone: string;
  vehicleModel: string;
  registrationNumber?: string;
  serviceType: string;
  preferredDate: string;
  preferredTimeSlot?: string;
  notes?: string;
  status: ServiceBookingStatus;
  estimatedCost?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
