package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.vehicle.*;
import com.showroom.showroom_backend.entity.VehicleType;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleService {

    VehicleResponse createVehicle(VehicleRequest request);

    List<VehicleResponse> getAllVehicles();

    VehiclePageResponse getAllVehicles(
            int page,
            int size,
            String sortBy,
            String sortDir
    );
    VehiclePageResponse filterVehicles(
            String keyword,
            Long brandId,
            VehicleType vehicleType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean available,
            Boolean featured,
            String fuelType,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    VehicleResponse getVehicleById(Long id);
    List<VehicleResponse> searchVehicles(String keyword);
    VehiclePageResponse searchVehicles(
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    );
    List<VehicleResponse> getVehiclesByType(VehicleType vehicleType);

    List<VehicleResponse> getAvailableVehicles();

    List<VehicleResponse> getFeaturedVehicles();

    List<VehicleResponse> getVehiclesByBrand(Long brandId);

    VehicleResponse updateVehicle(Long id, VehicleRequest request);

    void deleteVehicle(Long id);
    List<VehicleImageResponse> getVehicleImages(Long vehicleId);

    VehicleImageResponse addVehicleImage(
            Long vehicleId,
            VehicleImageRequest request
    );

    void deleteVehicleImage(Long vehicleId, Long imageId);
}