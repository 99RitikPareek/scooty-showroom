package com.showroom.showroom_backend.security;

import com.showroom.showroom_backend.entity.Admin;
import com.showroom.showroom_backend.entity.Customer;
import com.showroom.showroom_backend.repository.AdminRepository;
import com.showroom.showroom_backend.repository.CustomerRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;

    public CustomUserDetailsService(
            AdminRepository adminRepository,
            CustomerRepository customerRepository) {
        this.adminRepository = adminRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier)
            throws UsernameNotFoundException {

        // Check if Admin
        Optional<Admin> adminOpt = adminRepository.findByEmail(identifier);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (!admin.getActive()) {
                throw new UsernameNotFoundException("Admin account is inactive");
            }
            return User.builder()
                    .username(admin.getEmail())
                    .password(admin.getPassword())
                    .roles(admin.getRole())
                    .disabled(!admin.getActive())
                    .build();
        }

        // Check if Customer
        Optional<Customer> customerOpt = customerRepository.findByEmailOrPhone(identifier, identifier);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if ("INACTIVE".equalsIgnoreCase(customer.getStatus())) {
                throw new UsernameNotFoundException("Customer account is inactive");
            }
            String password = customer.getPassword() != null && !customer.getPassword().isEmpty()
                    ? customer.getPassword()
                    : "$2a$10$e8R4a.1234567890dummyPasswordHashForOtpUsersOnly";

            return User.builder()
                    .username(customer.getPhone())
                    .password(password)
                    .roles("CUSTOMER")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with identifier: " + identifier);
    }
}