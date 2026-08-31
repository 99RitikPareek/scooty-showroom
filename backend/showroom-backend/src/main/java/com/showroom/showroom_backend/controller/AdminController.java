package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.admin.*;
import com.showroom.showroom_backend.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/me")
    public ResponseEntity<AdminResponse> getCurrentAdmin(
            Authentication authentication) {

        String email = authentication.getName();
        AdminResponse admin = adminService.getAdminByEmail(email);

        return ResponseEntity.ok(admin);
    }

    @PutMapping("/profile")
    public ResponseEntity<AdminResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        String email = authentication.getName();
        AdminResponse updatedAdmin = adminService.updateProfile(email, request);

        return ResponseEntity.ok(updatedAdmin);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();
        adminService.changePassword(email, request);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    @GetMapping("/settings")
    public ResponseEntity<ShowroomSettingsDTO> getSettings() {
        return ResponseEntity.ok(adminService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<ShowroomSettingsDTO> updateSettings(
            @RequestBody ShowroomSettingsDTO settings) {

        return ResponseEntity.ok(adminService.updateSettings(settings));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard(
            Authentication authentication) {

        return ResponseEntity.ok(
                "Welcome Admin: " + authentication.getName()
        );
    }
}
