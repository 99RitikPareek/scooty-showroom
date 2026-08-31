package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.vehicle.VehicleImageRequest;
import com.showroom.showroom_backend.dto.vehicle.VehicleImageResponse;
import com.showroom.showroom_backend.service.VehicleImageService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles/{vehicleId}/images")
public class VehicleImageController {

    private final VehicleImageService vehicleImageService;

    public VehicleImageController(
            VehicleImageService vehicleImageService) {

        this.vehicleImageService = vehicleImageService;
    }

    // MULTIPART FILE UPLOAD (FormData)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VehicleImageResponse> uploadImage(
            @PathVariable Long vehicleId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        vehicleImageService.uploadImage(
                                vehicleId,
                                file,
                                altText,
                                displayOrder
                        )
                );
    }

    // JSON URL UPLOAD (Backward compatibility)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<VehicleImageResponse> addImage(
            @PathVariable Long vehicleId,
            @Valid @RequestBody VehicleImageRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        vehicleImageService.addImage(
                                vehicleId,
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<VehicleImageResponse>> getVehicleImages(
            @PathVariable Long vehicleId) {

        return ResponseEntity.ok(
                vehicleImageService.getVehicleImages(vehicleId)
        );
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long vehicleId,
            @PathVariable Long imageId) {

        vehicleImageService.deleteImage(
                vehicleId,
                imageId
        );

        return ResponseEntity.noContent().build();
    }
}