import api from "./api";
import type {
  ServiceBooking,
  ServiceBookingRequest,
  ServiceBookingStatusUpdateRequest,
} from "../types/serviceBooking";

const serviceBookingService = {

  // Public: Create Service Booking
  async create(data: ServiceBookingRequest): Promise<ServiceBooking> {
    const response = await api.post<ServiceBooking>("/service-bookings", data);
    return response.data;
  },

  // Public: Track Service Booking by Booking Code or Phone Number
  async track(identifier: string): Promise<ServiceBooking[]> {
    const response = await api.get<ServiceBooking[]>(
      `/service-bookings/track/${encodeURIComponent(identifier)}`
    );
    return response.data;
  },

  // Admin: Get all service bookings with optional status / search query filter
  async getAll(status?: string, query?: string): Promise<ServiceBooking[]> {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (query) params.query = query;

    const response = await api.get<ServiceBooking[]>("/service-bookings", {
      params,
    });
    return response.data;
  },

  // Admin: Get by ID
  async getById(id: number): Promise<ServiceBooking> {
    const response = await api.get<ServiceBooking>(`/service-bookings/${id}`);
    return response.data;
  },

  // Admin: Update Status, Estimated Cost, and Admin Notes
  async updateStatus(
    id: number,
    data: ServiceBookingStatusUpdateRequest
  ): Promise<ServiceBooking> {
    const response = await api.put<ServiceBooking>(
      `/service-bookings/${id}/status`,
      data
    );
    return response.data;
  },

  // Admin: Update Booking Details
  async update(
    id: number,
    data: ServiceBookingRequest
  ): Promise<ServiceBooking> {
    const response = await api.put<ServiceBooking>(
      `/service-bookings/${id}`,
      data
    );
    return response.data;
  },

  // Admin: Delete Service Booking
  async delete(id: number): Promise<void> {
    await api.delete(`/service-bookings/${id}`);
  },
};

export default serviceBookingService;
