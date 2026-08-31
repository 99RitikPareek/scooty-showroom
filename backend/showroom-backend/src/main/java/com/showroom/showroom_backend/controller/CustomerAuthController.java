package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.customer.*;
import com.showroom.showroom_backend.service.CustomerService;
import com.showroom.showroom_backend.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/auth")
public class CustomerAuthController {

    private final CustomerService customerService;
    private final OtpService otpService;

    public CustomerAuthController(CustomerService customerService, OtpService otpService) {
        this.customerService = customerService;
        this.otpService = otpService;
    }

    // Public Endpoint: Request 6-digit Mobile OTP
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String otp = otpService.sendOtp(request.getPhone());
        return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully to " + request.getPhone(),
                "otp", otp // Provided for development/testing UI display
        ));
    }

    // Public Endpoint: Login or verify via Mobile OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<CustomerAuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(customerService.loginWithOtp(request));
    }

    // Public Endpoint: Register new customer account
    @PostMapping("/register")
    public ResponseEntity<CustomerAuthResponse> register(@Valid @RequestBody CustomerRegisterRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(customerService.register(request));
    }

    // Public Endpoint: Password Login
    @PostMapping("/login")
    public ResponseEntity<CustomerAuthResponse> login(@Valid @RequestBody CustomerLoginRequest request) {
        return ResponseEntity.ok(customerService.loginWithPassword(request));
    }

    // Protected Endpoint: Get current logged in customer profile
    @GetMapping("/me")
    public ResponseEntity<CustomerAuthResponse> getCurrentCustomer(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(customerService.getProfile(authentication.getName()));
    }
}
