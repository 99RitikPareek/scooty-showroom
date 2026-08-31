import api from "./api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShowroomSettings {
  showroomName: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  emailAlertsEnquiries: boolean;
  emailAlertsTestRides: boolean;
  autoApprovalTestRides: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const adminService = {
  async getCurrentAdmin(): Promise<AdminUser> {
    const response = await api.get<AdminUser>("/admin/me");
    return response.data;
  },

  async updateProfile(name: string): Promise<AdminUser> {
    const response = await api.put<AdminUser>("/admin/profile", { name });
    return response.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>("/admin/change-password", payload);
    return response.data;
  },

  async getSettings(): Promise<ShowroomSettings> {
    const response = await api.get<ShowroomSettings>("/admin/settings");
    return response.data;
  },

  async updateSettings(settings: ShowroomSettings): Promise<ShowroomSettings> {
    const response = await api.put<ShowroomSettings>("/admin/settings", settings);
    return response.data;
  },
};

export default adminService;
