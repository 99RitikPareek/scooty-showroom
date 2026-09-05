package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.vehicle.VehicleImageRequest;
import com.showroom.showroom_backend.dto.vehicle.VehicleImageResponse;
import com.showroom.showroom_backend.dto.vehicle.VehiclePageResponse;
import com.showroom.showroom_backend.dto.vehicle.VehicleRequest;
import com.showroom.showroom_backend.dto.vehicle.VehicleResponse;
import com.showroom.showroom_backend.entity.Brand;
import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.entity.VehicleImage;
import com.showroom.showroom_backend.entity.VehicleType;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.BrandRepository;
import com.showroom.showroom_backend.repository.VehicleImageRepository;
import com.showroom.showroom_backend.repository.VehicleRepository;
import com.showroom.showroom_backend.service.VehicleService;
import com.showroom.showroom_backend.specification.VehicleSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "name",
            "price",
            "createdAt",
            "updatedAt"
    );

    private final VehicleRepository vehicleRepository;
    private final BrandRepository brandRepository;
    private final VehicleImageRepository vehicleImageRepository;

    public VehicleServiceImpl(
            VehicleRepository vehicleRepository,
            BrandRepository brandRepository,
            VehicleImageRepository vehicleImageRepository) {

        this.vehicleRepository = vehicleRepository;
        this.brandRepository = brandRepository;
        this.vehicleImageRepository = vehicleImageRepository;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Brand not found with id: " + request.getBrandId()
                        ));

        Vehicle vehicle = new Vehicle();

        mapRequestToEntity(request, vehicle, brand);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(savedVehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAllVehicles() {

        return vehicleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VehiclePageResponse getAllVehicles(
            int page,
            int size,
            String sortBy,
            String sortDir) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size <= 0) {
            throw new IllegalArgumentException(
                    "Page size must be greater than 0"
            );
        }

        if (size > 100) {
            throw new IllegalArgumentException(
                    "Page size cannot exceed 100"
            );
        }

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (!sortDir.equalsIgnoreCase("asc")
                && !sortDir.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Invalid sort direction: " + sortDir
            );
        }

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VehicleResponse> vehiclePage = vehicleRepository
                .findAll(pageable)
                .map(this::mapToResponse);

        VehiclePageResponse response = new VehiclePageResponse();

        response.setContent(vehiclePage.getContent());
        response.setPage(vehiclePage.getNumber());
        response.setSize(vehiclePage.getSize());
        response.setTotalElements(vehiclePage.getTotalElements());
        response.setTotalPages(vehiclePage.getTotalPages());
        response.setFirst(vehiclePage.isFirst());
        response.setLast(vehiclePage.isLast());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: " + id
                        ));

        return mapToResponse(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> searchVehicles(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Search keyword cannot be empty"
            );
        }

        String searchKeyword = keyword.trim();

        return vehicleRepository
                .findByNameContainingIgnoreCaseOrModelContainingIgnoreCaseOrVariantContainingIgnoreCase(
                        searchKeyword,
                        searchKeyword,
                        searchKeyword
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VehiclePageResponse searchVehicles(
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Search keyword cannot be empty"
            );
        }

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size <= 0) {
            throw new IllegalArgumentException(
                    "Page size must be greater than 0"
            );
        }

        if (size > 100) {
            throw new IllegalArgumentException(
                    "Page size cannot exceed 100"
            );
        }

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (!sortDir.equalsIgnoreCase("asc")
                && !sortDir.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Invalid sort direction: " + sortDir
            );
        }

        String searchKeyword = keyword.trim();

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VehicleResponse> vehiclePage = vehicleRepository
                .findByNameContainingIgnoreCaseOrModelContainingIgnoreCaseOrVariantContainingIgnoreCase(
                        searchKeyword,
                        searchKeyword,
                        searchKeyword,
                        pageable
                )
                .map(this::mapToResponse);

        VehiclePageResponse response = new VehiclePageResponse();

        response.setContent(vehiclePage.getContent());
        response.setPage(vehiclePage.getNumber());
        response.setSize(vehiclePage.getSize());
        response.setTotalElements(vehiclePage.getTotalElements());
        response.setTotalPages(vehiclePage.getTotalPages());
        response.setFirst(vehiclePage.isFirst());
        response.setLast(vehiclePage.isLast());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByType(
            VehicleType vehicleType) {

        return vehicleRepository.findByVehicleType(vehicleType)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAvailableVehicles() {

        return vehicleRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getFeaturedVehicles() {

        return vehicleRepository.findByFeaturedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByBrand(Long brandId) {

        return vehicleRepository.findByBrandId(brandId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleImageResponse> getVehicleImages(Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException(
                    "Vehicle not found with id: " + vehicleId
            );
        }

        return vehicleImageRepository
                .findByVehicleIdOrderByDisplayOrderAsc(vehicleId)
                .stream()
                .map(this::mapImageToResponse)
                .toList();
    }

    @Override
    public VehicleImageResponse addVehicleImage(
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

        return mapImageToResponse(savedImage);
    }

    @Override
    public void deleteVehicleImage(
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

        vehicleImageRepository.delete(image);
    }

    @Override
    @Transactional(readOnly = true)
    public VehiclePageResponse filterVehicles(
            String keyword,
            Long brandId,
            VehicleType vehicleType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean available,
            Boolean featured,
            String fuelType,
            String category,
            String model,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size <= 0) {
            throw new IllegalArgumentException(
                    "Page size must be greater than 0"
            );
        }

        if (size > 100) {
            throw new IllegalArgumentException(
                    "Page size cannot exceed 100"
            );
        }

        if (minPrice != null
                && minPrice.compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalArgumentException(
                    "Minimum price cannot be negative"
            );
        }

        if (maxPrice != null
                && maxPrice.compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalArgumentException(
                    "Maximum price cannot be negative"
            );
        }

        if (minPrice != null
                && maxPrice != null
                && minPrice.compareTo(maxPrice) > 0) {

            throw new IllegalArgumentException(
                    "Minimum price cannot be greater than maximum price"
            );
        }

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (!sortDir.equalsIgnoreCase("asc")
                && !sortDir.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Invalid sort direction: " + sortDir
            );
        }

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        var specification = VehicleSpecification.filterVehicles(
                keyword,
                brandId,
                vehicleType,
                minPrice,
                maxPrice,
                available,
                featured,
                fuelType,
                category,
                model
        );

        Page<VehicleResponse> vehiclePage = vehicleRepository
                .findAll(specification, pageable)
                .map(this::mapToResponse);

        VehiclePageResponse response = new VehiclePageResponse();

        response.setContent(vehiclePage.getContent());
        response.setPage(vehiclePage.getNumber());
        response.setSize(vehiclePage.getSize());
        response.setTotalElements(vehiclePage.getTotalElements());
        response.setTotalPages(vehiclePage.getTotalPages());
        response.setFirst(vehiclePage.isFirst());
        response.setLast(vehiclePage.isLast());

        return response;
    }

    @Override
    public VehicleResponse updateVehicle(
            Long id,
            VehicleRequest request) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: " + id
                        ));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Brand not found with id: " + request.getBrandId()
                        ));

        mapRequestToEntity(request, vehicle, brand);

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: " + id
                        ));

        vehicleRepository.delete(vehicle);
    }

    private void mapRequestToEntity(
            VehicleRequest request,
            Vehicle vehicle,
            Brand brand) {

        vehicle.setBrand(brand);
        vehicle.setName(request.getName());
        vehicle.setModel(request.getModel());
        vehicle.setVariant(request.getVariant());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setPrice(request.getPrice());
        vehicle.setEngineCc(request.getEngineCc());
        vehicle.setMileage(request.getMileage());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setTransmission(request.getTransmission());
        vehicle.setColor(request.getColor());
        vehicle.setDescription(request.getDescription());
        vehicle.setCategory(request.getCategory());
        vehicle.setFeaturesJson(request.getFeaturesJson());
        vehicle.setSpecificationsJson(request.getSpecificationsJson());

        vehicle.setFeatured(
                request.getFeatured() != null
                        ? request.getFeatured()
                        : false
        );

        vehicle.setAvailable(
                request.getAvailable() != null
                        ? request.getAvailable()
                        : true
        );

        vehicle.setRegistrationYear(request.getRegistrationYear());
        vehicle.setOwnerCount(request.getOwnerCount());
        vehicle.setKilometersDriven(request.getKilometersDriven());
        vehicle.setCondition(request.getCondition());
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setInsuranceValidUntil(request.getInsuranceValidUntil());
    }

    private VehicleImageResponse mapImageToResponse(
            VehicleImage image) {

        VehicleImageResponse response =
                new VehicleImageResponse();

        response.setId(image.getId());
        response.setImageUrl(image.getImageUrl());
        response.setAltText(image.getAltText());
        response.setDisplayOrder(image.getDisplayOrder());

        return response;
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {

        VehicleResponse response = new VehicleResponse();

        response.setId(vehicle.getId());

        response.setBrandId(vehicle.getBrand().getId());
        response.setBrandName(vehicle.getBrand().getName());

        response.setName(vehicle.getName());
        response.setModel(vehicle.getModel());
        response.setVariant(vehicle.getVariant());
        response.setVehicleType(vehicle.getVehicleType());

        // Smart Category Fallback
        String cat = vehicle.getCategory();
        if (cat == null || cat.trim().isEmpty()) {
            String fuel = vehicle.getFuelType() != null ? vehicle.getFuelType().toUpperCase() : "";
            String name = vehicle.getName() != null ? vehicle.getName().toUpperCase() : "";
            if (fuel.contains("ELECTRIC") || fuel.contains("EV") || name.contains("EV") || name.contains("ELECTRIC")) {
                cat = "ELECTRIC";
            } else if (name.contains("GIXXER") || name.contains("STROM") || name.contains("HAYABUSA") || name.contains("KATANA") || name.contains("INTRUDER") || name.contains("BIKE")) {
                cat = "BIKE";
            } else {
                cat = "SCOOTER";
            }
        }
        response.setCategory(cat);
        response.setFeaturesJson(vehicle.getFeaturesJson());
        response.setSpecificationsJson(vehicle.getSpecificationsJson());

        response.setPrice(vehicle.getPrice());
        response.setEngineCc(vehicle.getEngineCc());
        response.setMileage(vehicle.getMileage());
        response.setFuelType(vehicle.getFuelType());
        response.setTransmission(vehicle.getTransmission());
        response.setColor(vehicle.getColor());
        response.setDescription(vehicle.getDescription());

        response.setFeatured(vehicle.getFeatured());
        response.setAvailable(vehicle.getAvailable());

        response.setRegistrationYear(vehicle.getRegistrationYear());
        response.setOwnerCount(vehicle.getOwnerCount());
        response.setKilometersDriven(vehicle.getKilometersDriven());
        response.setCondition(vehicle.getCondition());
        response.setRegistrationNumber(vehicle.getRegistrationNumber());
        response.setInsuranceValidUntil(vehicle.getInsuranceValidUntil());

        List<VehicleImage> imageEntities = vehicleImageRepository
                .findByVehicleIdOrderByDisplayOrderAsc(vehicle.getId());

        List<VehicleImageResponse> imageResponses = imageEntities.stream()
                .map(this::mapImageToResponse)
                .toList();

        response.setImages(imageResponses);

        response.setCreatedAt(vehicle.getCreatedAt());
        response.setUpdatedAt(vehicle.getUpdatedAt());

        return response;
    }
}