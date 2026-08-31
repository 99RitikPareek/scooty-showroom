package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.vehicle.VehicleRequest;
import com.showroom.showroom_backend.dto.vehicle.VehicleResponse;
import com.showroom.showroom_backend.entity.VehicleType;
import com.showroom.showroom_backend.service.VehicleService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.showroom.showroom_backend.dto.vehicle.VehiclePageResponse;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(vehicleService.createVehicle(request));
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {

        return ResponseEntity.ok(
                vehicleService.getAllVehicles()
        );
    }
    @GetMapping("/page")
    public ResponseEntity<VehiclePageResponse> getAllVehiclesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        return ResponseEntity.ok(
                vehicleService.getAllVehicles(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }
    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> searchVehicles(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                vehicleService.searchVehicles(keyword)
        );
    }
    @GetMapping("/search/page")
    public ResponseEntity<VehiclePageResponse> searchVehiclesPaginated(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        return ResponseEntity.ok(
                vehicleService.searchVehicles(
                        keyword,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }
    @GetMapping("/filter")
    public ResponseEntity<VehiclePageResponse> filterVehicles(

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) Long brandId,

            @RequestParam(required = false) VehicleType vehicleType,

            @RequestParam(required = false) BigDecimal minPrice,

            @RequestParam(required = false) BigDecimal maxPrice,

            @RequestParam(required = false) Boolean available,

            @RequestParam(required = false) Boolean featured,

            @RequestParam(required = false) String fuelType,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "createdAt") String sortBy,

            @RequestParam(defaultValue = "desc") String sortDir) {

        return ResponseEntity.ok(
                vehicleService.filterVehicles(
                        keyword,
                        brandId,
                        vehicleType,
                        minPrice,
                        maxPrice,
                        available,
                        featured,
                        fuelType,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                vehicleService.getVehicleById(id)
        );
    }


    @GetMapping("/type/{vehicleType}")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByType(
            @PathVariable VehicleType vehicleType) {

        return ResponseEntity.ok(
                vehicleService.getVehiclesByType(vehicleType)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponse>> getAvailableVehicles() {

        return ResponseEntity.ok(
                vehicleService.getAvailableVehicles()
        );
    }

    @GetMapping("/featured")
    public ResponseEntity<List<VehicleResponse>> getFeaturedVehicles() {

        return ResponseEntity.ok(
                vehicleService.getFeaturedVehicles()
        );
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByBrand(
            @PathVariable Long brandId) {

        return ResponseEntity.ok(
                vehicleService.getVehiclesByBrand(brandId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {

        return ResponseEntity.ok(
                vehicleService.updateVehicle(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(
            @PathVariable Long id) {

        vehicleService.deleteVehicle(id);

        return ResponseEntity.noContent().build();
    }
}