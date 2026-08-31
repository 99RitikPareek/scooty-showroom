package com.showroom.showroom_backend.dto.admin;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    private String token;

    @JsonProperty("tokenType")
    private String tokenType;

    @JsonProperty("adminId")
    private Long adminId;

    private String name;
    private String email;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String tokenType,
            Long adminId,
            String name,
            String email,
            String role) {

        this.token = token;
        this.tokenType = tokenType;
        this.adminId = adminId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    @JsonProperty("type")
    public String getType() {
        return tokenType;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    @JsonProperty("id")
    public Long getId() {
        return adminId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}