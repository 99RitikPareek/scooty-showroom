package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.customer.CustomerAuthResponse;
import com.showroom.showroom_backend.dto.customer.CustomerLoginRequest;
import com.showroom.showroom_backend.dto.customer.CustomerRegisterRequest;
import com.showroom.showroom_backend.dto.customer.VerifyOtpRequest;
import com.showroom.showroom_backend.entity.Customer;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.CustomerRepository;
import com.showroom.showroom_backend.security.JwtService;
import com.showroom.showroom_backend.service.CustomerService;
import com.showroom.showroom_backend.service.OtpService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            OtpService otpService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.customerRepository = customerRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public CustomerAuthResponse register(CustomerRegisterRequest request) {
        String cleanPhone = request.getPhone().trim();

        if (customerRepository.existsByPhone(cleanPhone)) {
            throw new IllegalArgumentException("Mobile number is already registered. Please login.");
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (customerRepository.existsByEmail(request.getEmail().trim())) {
                throw new IllegalArgumentException("Email is already registered. Please login.");
            }
        }

        // Verify OTP if provided
        if (request.getOtp() != null && !request.getOtp().trim().isEmpty()) {
            boolean validOtp = otpService.verifyOtp(cleanPhone, request.getOtp());
            if (!validOtp) {
                throw new IllegalArgumentException("Invalid or expired OTP. Please try again.");
            }
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(cleanPhone);
        customer.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        customer.setAddress(request.getAddress());
        customer.setStatus("ACTIVE");

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Customer saved = customerRepository.save(customer);

        String token = jwtService.generateToken(saved.getPhone(), "CUSTOMER");
        return mapToAuthResponse(saved, token);
    }

    @Override
    @Transactional
    public CustomerAuthResponse loginWithOtp(VerifyOtpRequest request) {
        String cleanPhone = request.getPhone().trim();

        boolean validOtp = otpService.verifyOtp(cleanPhone, request.getOtp());
        if (!validOtp) {
            throw new IllegalArgumentException("Invalid or expired OTP. Please try again.");
        }

        Customer customer = customerRepository.findByPhone(cleanPhone)
                .orElseGet(() -> {
                    // Auto-register customer if login via OTP first time
                    Customer newCustomer = new Customer();
                    newCustomer.setName("Customer (" + cleanPhone.substring(6) + ")");
                    newCustomer.setPhone(cleanPhone);
                    newCustomer.setStatus("ACTIVE");
                    return customerRepository.save(newCustomer);
                });

        String token = jwtService.generateToken(customer.getPhone(), "CUSTOMER");
        return mapToAuthResponse(customer, token);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerAuthResponse loginWithPassword(CustomerLoginRequest request) {
        String identifier = request.getIdentifier().trim();

        Customer customer = customerRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found with provided phone/email."));

        if (customer.getPassword() == null || customer.getPassword().isEmpty()) {
            throw new IllegalArgumentException("No password set for this account. Please login using Mobile OTP.");
        }

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new IllegalArgumentException("Incorrect password. Please try again or login via OTP.");
        }

        String token = jwtService.generateToken(customer.getPhone(), "CUSTOMER");
        return mapToAuthResponse(customer, token);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerAuthResponse getProfile(String identifier) {
        Customer customer = customerRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found."));

        return mapToAuthResponse(customer, null);
    }

    private CustomerAuthResponse mapToAuthResponse(Customer customer, String token) {
        CustomerAuthResponse response = new CustomerAuthResponse();
        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setAddress(customer.getAddress());
        response.setRole("CUSTOMER");
        response.setToken(token);
        return response;
    }
}
