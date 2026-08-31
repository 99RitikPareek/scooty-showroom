import api from "./api";

import type {
  Vehicle,
  VehicleFilters,
  VehicleImage,
  VehicleImageRequest,
  VehiclePageResponse,
  VehicleRequest,
} from "../types/vehicle";

const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>("/vehicles");
    return response.data;
  },

  async getById(id: number): Promise<Vehicle> {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  async getByType(type: "NEW" | "USED"): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>(
      `/vehicles/type/${type}`
    );

    return response.data;
  },

  async getAvailable(): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>(
      "/vehicles/available"
    );

    return response.data;
  },

  async getFeatured(): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>(
      "/vehicles/featured"
    );

    return response.data;
  },

  async getByBrand(brandId: number): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>(
      `/vehicles/brand/${brandId}`
    );

    return response.data;
  },

  async search(keyword: string): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>(
      "/vehicles/search",
      {
        params: {
          keyword,
        },
      }
    );

    return response.data;
  },

  async getPage(
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<VehiclePageResponse> {
    const response = await api.get<VehiclePageResponse>(
      "/vehicles/page",
      {
        params: {
          page,
          size,
          sortBy,
          sortDir,
        },
      }
    );

    return response.data;
  },

  async filter(
    filters: VehicleFilters
  ): Promise<VehiclePageResponse> {
    const response = await api.get<VehiclePageResponse>(
      "/vehicles/filter",
      {
        params: removeEmptyParams(filters),
      }
    );

    return response.data;
  },

  async create(
    data: VehicleRequest
  ): Promise<Vehicle> {
    const response = await api.post<Vehicle>(
      "/vehicles",
      data
    );

    return response.data;
  },

  async update(
    id: number,
    data: VehicleRequest
  ): Promise<Vehicle> {
    const response = await api.put<Vehicle>(
      `/vehicles/${id}`,
      data
    );

    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },

  async getImages(
    vehicleId: number
  ): Promise<VehicleImage[]> {
    const response = await api.get<VehicleImage[]>(
      `/vehicles/${vehicleId}/images`
    );

    return response.data;
  },

  async addImage(
    vehicleId: number,
    data: VehicleImageRequest
  ): Promise<VehicleImage> {
    const response = await api.post<VehicleImage>(
      `/vehicles/${vehicleId}/images`,
      data
    );

    return response.data;
  },

  async uploadImage(
    vehicleId: number,
    file: File,
    altText?: string,
    displayOrder?: number
  ): Promise<VehicleImage> {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) {
      formData.append("altText", altText);
    }
    if (displayOrder !== undefined) {
      formData.append("displayOrder", displayOrder.toString());
    }

    const response = await api.post<VehicleImage>(
      `/vehicles/${vehicleId}/images`,
      formData
    );

    return response.data;
  },
  async deleteImage(
    vehicleId: number,
    imageId: number
  ): Promise<void> {
    await api.delete(
      `/vehicles/${vehicleId}/images/${imageId}`
    );
  },
};

function removeEmptyParams(
  filters: VehicleFilters
): Record<string, string | number | boolean> {
  const params: Record<
    string,
    string | number | boolean
  > = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params[key] = value;
    }
  });

  return params;
}

export default vehicleService;