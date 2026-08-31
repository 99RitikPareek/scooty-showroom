package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.testride.TestRideRequest;
import com.showroom.showroom_backend.dto.testride.TestRideResponse;
import com.showroom.showroom_backend.service.TestRideService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-rides")
public class TestRideController {

    private final TestRideService testRideService;

    public TestRideController(TestRideService testRideService) {
        this.testRideService = testRideService;
    }

    @PostMapping
    public ResponseEntity<TestRideResponse> createTestRide(
            @Valid @RequestBody TestRideRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(testRideService.createTestRide(request));
    }

    @GetMapping
    public ResponseEntity<List<TestRideResponse>> getAllTestRides() {

        return ResponseEntity.ok(
                testRideService.getAllTestRides()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestRideResponse> getTestRideById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                testRideService.getTestRideById(id)
        );
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<TestRideResponse>> getTestRidesByVehicle(
            @PathVariable Long vehicleId) {

        return ResponseEntity.ok(
                testRideService.getTestRidesByVehicle(vehicleId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TestRideResponse>> getTestRidesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                testRideService.getTestRidesByStatus(status)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestRideResponse> updateTestRide(
            @PathVariable Long id,
            @Valid @RequestBody TestRideRequest request) {

        return ResponseEntity.ok(
                testRideService.updateTestRide(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestRide(
            @PathVariable Long id) {

        testRideService.deleteTestRide(id);

        return ResponseEntity.noContent().build();
    }
}