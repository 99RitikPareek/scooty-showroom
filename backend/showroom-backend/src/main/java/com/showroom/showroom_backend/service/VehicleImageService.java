package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.vehicle.VehicleImageRequest;
import com.showroom.showroom_backend.dto.vehicle.VehicleImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface VehicleImageService {

    VehicleImageResponse addImage(
            Long vehicleId,
            VehicleImageRequest request
    );

    VehicleImageResponse uploadImage(
            Long vehicleId,
            MultipartFile file,
            String altText,
            Integer displayOrder
    );

    List<VehicleImageResponse> getVehicleImages(
            Long vehicleId
    );

    void deleteImage(
            Long vehicleId,
            Long imageId
    );
}