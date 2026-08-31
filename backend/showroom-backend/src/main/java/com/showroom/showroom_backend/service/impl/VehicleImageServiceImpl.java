package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.vehicle.VehicleImageRequest;
import com.showroom.showroom_backend.dto.vehicle.VehicleImageResponse;
import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.entity.VehicleImage;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.VehicleImageRepository;
import com.showroom.showroom_backend.repository.VehicleRepository;
import com.showroom.showroom_backend.service.VehicleImageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VehicleImageServiceImpl implements VehicleImageService {

    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/pjpeg",
            "image/x-png"
    );

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".jfif"
    );

    private final VehicleImageRepository vehicleImageRepository;
    private final VehicleRepository vehicleRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public VehicleImageServiceImpl(
            VehicleImageRepository vehicleImageRepository,
            VehicleRepository vehicleRepository) {

        this.vehicleImageRepository = vehicleImageRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleImageResponse addImage(
            Long vehicleId,
            VehicleImageRequest request) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: " + vehicleId
                        ));

        VehicleImage image = new VehicleImage();

        image.setVehicle(vehicle);
        image.setImageUrl(request.getImageUrl());
        image.setAltText(request.getAltText());
        image.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        VehicleImage savedImage =
                vehicleImageRepository.save(image);

        return mapToResponse(savedImage);
    }

    @Override
    public VehicleImageResponse uploadImage(
            Long vehicleId,
            MultipartFile file,
            String altText,
            Integer displayOrder) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: " + vehicleId
                        ));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file cannot be empty");
        }

        // Validate File Type
        String contentType = file.getContentType();
        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : ""
        );
        String extension = getFileExtension(originalFilename).toLowerCase();

        boolean isValidMime = contentType != null && ALLOWED_MIME_TYPES.contains(contentType.toLowerCase());
        boolean isValidExt = ALLOWED_EXTENSIONS.contains(extension);

        if (!isValidMime && !isValidExt) {
            throw new IllegalArgumentException("Invalid file type. Only JPG, JPEG, PNG, and WEBP images are supported.");
        }

        try {
            Path targetDir = Paths.get(uploadDir, "vehicles").toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String uniqueFilename = UUID.randomUUID() + "_" + System.currentTimeMillis() + (extension.isEmpty() ? ".jpg" : extension);
            Path targetFile = targetDir.resolve(uniqueFilename).normalize();

            // Security check against Path Traversal
            if (!targetFile.startsWith(targetDir)) {
                throw new IllegalArgumentException("Invalid target file path");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            }

            String imageUrl = "/uploads/vehicles/" + uniqueFilename;

            VehicleImage image = new VehicleImage();
            image.setVehicle(vehicle);
            image.setImageUrl(imageUrl);
            image.setAltText(altText);
            image.setDisplayOrder(displayOrder != null ? displayOrder : 0);

            VehicleImage savedImage = vehicleImageRepository.save(image);
            return mapToResponse(savedImage);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store uploaded image file", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleImageResponse> getVehicleImages(
            Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException(
                    "Vehicle not found with id: " + vehicleId
            );
        }

        return vehicleImageRepository
                .findByVehicleIdOrderByDisplayOrderAsc(vehicleId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteImage(
            Long vehicleId,
            Long imageId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException(
                    "Vehicle not found with id: " + vehicleId
            );
        }

        VehicleImage image = vehicleImageRepository.findById(imageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle image not found with id: " + imageId
                        ));

        if (!image.getVehicle().getId().equals(vehicleId)) {
            throw new IllegalArgumentException(
                    "Image does not belong to this vehicle"
            );
        }

        // Delete physical file if uploaded locally
        if (image.getImageUrl() != null && image.getImageUrl().startsWith("/uploads/vehicles/")) {
            try {
                String filename = image.getImageUrl().substring("/uploads/vehicles/".length());
                Path filePath = Paths.get(uploadDir, "vehicles", filename).toAbsolutePath().normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete local image file: " + e.getMessage());
            }
        }

        vehicleImageRepository.delete(image);
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    private VehicleImageResponse mapToResponse(
            VehicleImage image) {

        return new VehicleImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getDisplayOrder()
        );
    }
}