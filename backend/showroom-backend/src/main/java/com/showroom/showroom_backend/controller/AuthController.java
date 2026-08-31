package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.admin.AdminRequest;
import com.showroom.showroom_backend.dto.admin.AdminResponse;
import com.showroom.showroom_backend.dto.admin.LoginRequest;
import com.showroom.showroom_backend.dto.admin.LoginResponse;
import com.showroom.showroom_backend.entity.Admin;
import com.showroom.showroom_backend.repository.AdminRepository;
import com.showroom.showroom_backend.security.JwtService;
import com.showroom.showroom_backend.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            AdminService adminService,
            AdminRepository adminRepository,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.adminService = adminService;
        this.adminRepository = adminRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AdminResponse> register(
            @Valid @RequestBody AdminRequest request) {

        AdminResponse response =
                adminService.registerAdmin(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        Admin admin = adminRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Admin not found")
                );

        String token = jwtService.generateToken(
                admin.getEmail(),
                admin.getRole()
        );

        LoginResponse response =
                new LoginResponse(
                        token,
                        "Bearer",
                        admin.getId(),
                        admin.getName(),
                        admin.getEmail(),
                        admin.getRole()
                );

        return ResponseEntity.ok(response);
    }
}
