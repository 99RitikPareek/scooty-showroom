package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.admin.*;
import com.showroom.showroom_backend.entity.Admin;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.AdminRepository;
import com.showroom.showroom_backend.service.AdminService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private ShowroomSettingsDTO currentSettings;

    public AdminServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentSettings = new ShowroomSettingsDTO();
    }

    @Override
    public AdminResponse registerAdmin(AdminRequest request) {

        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Admin already exists with email: " + request.getEmail()
            );
        }

        Admin admin = new Admin();

        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        admin.setRole("ADMIN");
        admin.setActive(true);

        Admin savedAdmin = adminRepository.save(admin);

        return mapToResponse(savedAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminResponse getAdminByEmail(String email) {

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin not found with email: " + email
                        )
                );

        return mapToResponse(admin);
    }

    @Override
    public AdminResponse updateProfile(String email, UpdateProfileRequest request) {

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin not found with email: " + email
                        )
                );

        admin.setName(request.getName().trim());
        Admin updatedAdmin = adminRepository.save(admin);

        return mapToResponse(updatedAdmin);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin not found with email: " + email
                        )
                );

        // Validate Current Password
        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        // Validate New Password & Confirm Password
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as the current password.");
        }

        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public ShowroomSettingsDTO getSettings() {
        return this.currentSettings;
    }

    @Override
    public ShowroomSettingsDTO updateSettings(ShowroomSettingsDTO settings) {
        if (settings != null) {
            this.currentSettings = settings;
        }
        return this.currentSettings;
    }

    private AdminResponse mapToResponse(Admin admin) {

        return new AdminResponse(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getRole(),
                admin.getActive(),
                admin.getCreatedAt(),
                admin.getUpdatedAt()
        );
    }
}