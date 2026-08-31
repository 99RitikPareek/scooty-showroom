package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.admin.*;

public interface AdminService {

    AdminResponse registerAdmin(AdminRequest request);

    AdminResponse getAdminByEmail(String email);

    AdminResponse updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

    ShowroomSettingsDTO getSettings();

    ShowroomSettingsDTO updateSettings(ShowroomSettingsDTO settings);
}