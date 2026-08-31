import api from "./api";

import type {
  TestRideRequest,
  TestRideResponse,
} from "../types/testRide";

const testRideService = {

  // ================= CREATE =================

  async create(
    data: TestRideRequest
  ): Promise<TestRideResponse> {

    const response =
      await api.post<TestRideResponse>(
        "/test-rides",
        data
      );

    return response.data;
  },


  // ================= GET ALL =================

  async getAll(): Promise<TestRideResponse[]> {

    const response =
      await api.get<TestRideResponse[]>(
        "/test-rides"
      );

    return response.data;
  },


  // ================= GET BY ID =================

  async getById(
    id: number
  ): Promise<TestRideResponse> {

    const response =
      await api.get<TestRideResponse>(
        `/test-rides/${id}`
      );

    return response.data;
  },


  // ================= GET BY VEHICLE =================

  async getByVehicle(
    vehicleId: number
  ): Promise<TestRideResponse[]> {

    const response =
      await api.get<TestRideResponse[]>(
        `/test-rides/vehicle/${vehicleId}`
      );

    return response.data;
  },


  // ================= GET BY STATUS =================

  async getByStatus(
    status: string
  ): Promise<TestRideResponse[]> {

    const response =
      await api.get<TestRideResponse[]>(
        `/test-rides/status/${status}`
      );

    return response.data;
  },


  // ================= UPDATE =================

  async update(
    id: number,
    data: TestRideRequest
  ): Promise<TestRideResponse> {

    const response =
      await api.put<TestRideResponse>(
        `/test-rides/${id}`,
        data
      );

    return response.data;
  },


  // ================= DELETE =================

  async delete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/test-rides/${id}`
    );
  },

};

export default testRideService;