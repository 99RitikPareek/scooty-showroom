package com.showroom.showroom_backend.dto.vehicle;

import com.showroom.showroom_backend.entity.VehicleType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class VehicleRequest {

    @NotNull(message = "Brand ID is required")
    private Long brandId;

    @NotBlank(message = "Vehicle name is required")
    @Size(max = 150, message = "Vehicle name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Model is required")
    @Size(max = 100, message = "Model cannot exceed 100 characters")
    private String model;

    @Size(max = 100, message = "Variant cannot exceed 100 characters")
    private String variant;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @Size(max = 30, message = "Category cannot exceed 30 characters")
    private String category;
    private String featuresJson;
    private String specificationsJson;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 1, message = "Engine capacity must be greater than 0")
    private Integer engineCc;

    @DecimalMin(value = "0.0", inclusive = false, message = "Mileage must be greater than 0")
    private BigDecimal mileage;

    @Size(max = 50, message = "Fuel type cannot exceed 50 characters")
    private String fuelType;

    @Size(max = 50, message = "Transmission cannot exceed 50 characters")
    private String transmission;

    @Size(max = 50, message = "Color cannot exceed 50 characters")
    private String color;
    @Size(
            max = 2000,
            message = "Description cannot exceed 2000 characters"
    )
    private String description;
    private Boolean featured = false;

    private Boolean available = true;

    // Used vehicle fields
    private Integer registrationYear;

    @Min(value = 1, message = "Owner count must be at least 1")
    private Integer ownerCount;

    @Min(value = 0, message = "Kilometers driven cannot be negative")
    private Integer kilometersDriven;

    @Size(max = 50, message = "Condition cannot exceed 50 characters")
    private String condition;

    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    private String registrationNumber;

    private LocalDate insuranceValidUntil;

    public VehicleRequest() {
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }

    public String getFeaturesJson() {
        return featuresJson;
    }

    public void setFeaturesJson(String featuresJson) {
        this.featuresJson = featuresJson;
    }

    public String getSpecificationsJson() {
        return specificationsJson;
    }

    public void setSpecificationsJson(String specificationsJson) {
        this.specificationsJson = specificationsJson;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getEngineCc() {
        return engineCc;
    }

    public void setEngineCc(Integer engineCc) {
        this.engineCc = engineCc;
    }

    public BigDecimal getMileage() {
        return mileage;
    }

    public void setMileage(BigDecimal mileage) {
        this.mileage = mileage;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Integer getRegistrationYear() {
        return registrationYear;
    }

    public void setRegistrationYear(Integer registrationYear) {
        this.registrationYear = registrationYear;
    }

    public Integer getOwnerCount() {
        return ownerCount;
    }

    public void setOwnerCount(Integer ownerCount) {
        this.ownerCount = ownerCount;
    }

    public Integer getKilometersDriven() {
        return kilometersDriven;
    }

    public void setKilometersDriven(Integer kilometersDriven) {
        this.kilometersDriven = kilometersDriven;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public LocalDate getInsuranceValidUntil() {
        return insuranceValidUntil;
    }

    public void setInsuranceValidUntil(LocalDate insuranceValidUntil) {
        this.insuranceValidUntil = insuranceValidUntil;
    }
}