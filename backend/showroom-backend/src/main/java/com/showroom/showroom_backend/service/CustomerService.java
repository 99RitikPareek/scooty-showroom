package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.customer.CustomerAuthResponse;
import com.showroom.showroom_backend.dto.customer.CustomerLoginRequest;
import com.showroom.showroom_backend.dto.customer.CustomerRegisterRequest;
import com.showroom.showroom_backend.dto.customer.VerifyOtpRequest;

public interface CustomerService {

    CustomerAuthResponse register(CustomerRegisterRequest request);

    CustomerAuthResponse loginWithOtp(VerifyOtpRequest request);

    CustomerAuthResponse loginWithPassword(CustomerLoginRequest request);

    CustomerAuthResponse getProfile(String identifier);
}
