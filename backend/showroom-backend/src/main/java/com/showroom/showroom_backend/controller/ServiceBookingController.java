package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingRequest;
import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingResponse;
import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingStatusUpdateRequest;
import com.showroom.showroom_backend.service.ServiceBookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-bookings")
public class ServiceBookingController {

    private final ServiceBookingService serviceBookingService;

    public ServiceBookingController(ServiceBookingService serviceBookingService) {
        this.serviceBookingService = serviceBookingService;
    }

    // Public Endpoint: Create a new service booking
    @PostMapping
    public ResponseEntity<ServiceBookingResponse> createBooking(
            @Valid @RequestBody ServiceBookingRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(serviceBookingService.createBooking(request));
    }

    // Public Endpoint: Track service status by booking code or phone number
    @GetMapping("/track/{identifier}")
    public ResponseEntity<List<ServiceBookingResponse>> trackBooking(
            @PathVariable String identifier) {
        return ResponseEntity.ok(serviceBookingService.trackBooking(identifier));
    }

    // Admin Endpoint: Get all bookings (filterable by status or search query)
    @GetMapping
    public ResponseEntity<List<ServiceBookingResponse>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(serviceBookingService.getAllBookings(status, query));
    }

    // Admin Endpoint: Get booking details by ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceBookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceBookingService.getBookingById(id));
    }

    // Admin Endpoint: Update booking status, cost, and notes
    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceBookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody ServiceBookingStatusUpdateRequest request) {
        return ResponseEntity.ok(serviceBookingService.updateBookingStatus(id, request));
    }

    // Admin Endpoint: Full update of booking details
    @PutMapping("/{id}")
    public ResponseEntity<ServiceBookingResponse> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody ServiceBookingRequest request) {
        return ResponseEntity.ok(serviceBookingService.updateBooking(id, request));
    }

    // Admin Endpoint: Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        serviceBookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
