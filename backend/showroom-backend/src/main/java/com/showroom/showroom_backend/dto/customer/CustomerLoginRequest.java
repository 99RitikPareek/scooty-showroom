package com.showroom.showroom_backend.dto.customer;

import jakarta.validation.constraints.NotBlank;

public class CustomerLoginRequest {

    @NotBlank(message = "Phone number or email is required")
    private String identifier;

    private String password;

    private String otp;

    public CustomerLoginRequest() {
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
