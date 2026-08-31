import api from "./api";

import type {
  EnquiryRequest,
  EnquiryResponse,
} from "../types/enquiry";

const enquiryService = {

  async create(
    data: EnquiryRequest
  ): Promise<EnquiryResponse> {

    const response =
      await api.post<EnquiryResponse>(
        "/enquiries",
        data
      );

    return response.data;
  },

  async getAll(): Promise<EnquiryResponse[]> {

    const response =
      await api.get<EnquiryResponse[]>(
        "/enquiries"
      );

    return response.data;
  },

  async getById(
    id: number
  ): Promise<EnquiryResponse> {

    const response =
      await api.get<EnquiryResponse>(
        `/enquiries/${id}`
      );

    return response.data;
  },

  async getByVehicle(
    vehicleId: number
  ): Promise<EnquiryResponse[]> {

    const response =
      await api.get<EnquiryResponse[]>(
        `/enquiries/vehicle/${vehicleId}`
      );

    return response.data;
  },

  async getByStatus(
    status: string
  ): Promise<EnquiryResponse[]> {

    const response =
      await api.get<EnquiryResponse[]>(
        `/enquiries/status/${status}`
      );

    return response.data;
  },

  async update(
    id: number,
    data: EnquiryRequest
  ): Promise<EnquiryResponse> {

    const response =
      await api.put<EnquiryResponse>(
        `/enquiries/${id}`,
        data
      );

    return response.data;
  },

  async delete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/enquiries/${id}`
    );
  },
};

export default enquiryService;