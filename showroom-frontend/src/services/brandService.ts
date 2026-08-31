import api from "./api";
import type { Brand, BrandRequest } from "../types/brand";

const BASE_URL = "/brands";

export const brandService = {
  async getAll(): Promise<Brand[]> {
    const response = await api.get<Brand[]>(BASE_URL);
    return response.data;
  },

  async getById(id: number): Promise<Brand> {
    const response = await api.get<Brand>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(data: BrandRequest): Promise<Brand> {
    const response = await api.post<Brand>(BASE_URL, data);
    return response.data;
  },

  async update(id: number, data: BrandRequest): Promise<Brand> {
    const response = await api.put<Brand>(
      `${BASE_URL}/${id}`,
      data
    );

    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};