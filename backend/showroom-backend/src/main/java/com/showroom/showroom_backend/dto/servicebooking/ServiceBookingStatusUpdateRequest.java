package com.showroom.showroom_backend.dto.servicebooking;

import jakarta.validation.constraints.NotBlank;

public class ServiceBookingStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private Double estimatedCost;

    private String adminNotes;

    public ServiceBookingStatusUpdateRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
