import api from "./api";

import type {
  OfferRequest,
  OfferResponse,
} from "../types/offer";

const offerService = {

  async create(
    data: OfferRequest
  ): Promise<OfferResponse> {

    const response =
      await api.post<OfferResponse>(
        "/offers",
        data
      );

    return response.data;
  },

  async getAll(): Promise<OfferResponse[]> {

    const response =
      await api.get<OfferResponse[]>(
        "/offers"
      );

    return response.data;
  },

  async getById(
    id: number
  ): Promise<OfferResponse> {

    const response =
      await api.get<OfferResponse>(
        `/offers/${id}`
      );

    return response.data;
  },

  async getActive(): Promise<OfferResponse[]> {

    const response =
      await api.get<OfferResponse[]>(
        "/offers/active"
      );

    return response.data;
  },

  async getByVehicle(
    vehicleId: number
  ): Promise<OfferResponse[]> {

    const response =
      await api.get<OfferResponse[]>(
        `/offers/vehicle/${vehicleId}`
      );

    return response.data;
  },

  async update(
    id: number,
    data: OfferRequest
  ): Promise<OfferResponse> {

    const response =
      await api.put<OfferResponse>(
        `/offers/${id}`,
        data
      );

    return response.data;
  },

  async delete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/offers/${id}`
    );
  },
};

export default offerService;