package com.showroom.showroom_backend.dto.testride;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TestRideResponse {

    private Long id;

    private Long vehicleId;
    private String vehicleName;

    private String customerName;
    private String email;
    private String phone;

    private LocalDate preferredDate;
    private String preferredTime;

    private String status;
    private String message;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TestRideResponse() {
    }

    public TestRideResponse(
            Long id,
            Long vehicleId,
            String vehicleName,
            String customerName,
            String email,
            String phone,
            LocalDate preferredDate,
            String preferredTime,
            String status,
            String message,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.customerName = customerName;
        this.email = email;
        this.phone = phone;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.status = status;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}