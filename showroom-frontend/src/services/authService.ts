import api from "./api";
import { STORAGE_KEYS } from "../utils/constants";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type?: string;
  tokenType?: string;
  id?: number;
  adminId?: number;
  name: string;
  email: string;
  role: string;
}

const authService = {
  async login(
    data: LoginRequest
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      data
    );

    const admin = response.data;
    const token = admin.token;

    if (!token) {
      throw new Error("No authentication token received from server");
    }

    // Normalize response object
    const normalizedAdmin: LoginResponse = {
      ...admin,
      id: admin.id ?? admin.adminId ?? 0,
      type: admin.type ?? admin.tokenType ?? "Bearer",
    };

    localStorage.setItem(
      STORAGE_KEYS.ACCESS_TOKEN,
      token
    );
    localStorage.setItem(
      STORAGE_KEYS.ADMIN,
      JSON.stringify(normalizedAdmin)
    );

    return normalizedAdmin;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN);
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getAdmin(): LoginResponse | null {
    const admin = localStorage.getItem(STORAGE_KEYS.ADMIN);

    if (!admin) {
      return null;
    }

    try {
      return JSON.parse(admin) as LoginResponse;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
};

export default authService;
