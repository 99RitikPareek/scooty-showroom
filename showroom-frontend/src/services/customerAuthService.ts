import api from "./api";
import type {
  CustomerAuthResponse,
  CustomerRegisterRequest,
  CustomerLoginRequest,
  CustomerUser,
} from "../types/customerAuth";

const CUSTOMER_TOKEN_KEY = "customer_token";
const CUSTOMER_USER_KEY = "customer_user";

const customerAuthService = {
  // Send 6-Digit OTP to mobile
  async sendOtp(phone: string): Promise<{ message: string; otp?: string }> {
    const response = await api.post<{ message: string; otp?: string }>(
      "/customer/auth/send-otp",
      { phone }
    );
    return response.data;
  },

  // Verify OTP and Log In
  async verifyOtp(phone: string, otp: string): Promise<CustomerAuthResponse> {
    const response = await api.post<CustomerAuthResponse>(
      "/customer/auth/verify-otp",
      { phone, otp }
    );

    if (response.data.token) {
      this.setSession(response.data);
    }
    return response.data;
  },

  // Register New Customer Account
  async register(data: CustomerRegisterRequest): Promise<CustomerAuthResponse> {
    const response = await api.post<CustomerAuthResponse>(
      "/customer/auth/register",
      data
    );

    if (response.data.token) {
      this.setSession(response.data);
    }
    return response.data;
  },

  // Login via Email/Phone + Password
  async login(data: CustomerLoginRequest): Promise<CustomerAuthResponse> {
    const response = await api.post<CustomerAuthResponse>(
      "/customer/auth/login",
      data
    );

    if (response.data.token) {
      this.setSession(response.data);
    }
    return response.data;
  },

  // Fetch Current Logged In Profile
  async getProfile(): Promise<CustomerUser> {
    const response = await api.get<CustomerUser>("/customer/auth/me");
    if (response.data) {
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(response.data));
    }
    return response.data;
  },

  // Session storage helpers
  setSession(authData: CustomerAuthResponse) {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, authData.token);
    const user: CustomerUser = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      phone: authData.phone,
      address: authData.address,
      role: authData.role,
    };
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  getCustomer(): CustomerUser | null {
    const userStr = localStorage.getItem(CUSTOMER_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token !== "null" && token !== "undefined";
  },

  logout() {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_USER_KEY);
  },
};

export default customerAuthService;
