package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.enquiry.EnquiryRequest;
import com.showroom.showroom_backend.dto.enquiry.EnquiryResponse;
import com.showroom.showroom_backend.service.EnquiryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<EnquiryResponse> createEnquiry(
            @Valid @RequestBody EnquiryRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(enquiryService.createEnquiry(request));
    }

    @GetMapping
    public ResponseEntity<List<EnquiryResponse>> getAllEnquiries() {

        return ResponseEntity.ok(
                enquiryService.getAllEnquiries()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnquiryResponse> getEnquiryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                enquiryService.getEnquiryById(id)
        );
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<EnquiryResponse>> getEnquiriesByVehicle(
            @PathVariable Long vehicleId) {

        return ResponseEntity.ok(
                enquiryService.getEnquiriesByVehicle(vehicleId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EnquiryResponse>> getEnquiriesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                enquiryService.getEnquiriesByStatus(status)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnquiryResponse> updateEnquiry(
            @PathVariable Long id,
            @Valid @RequestBody EnquiryRequest request) {

        return ResponseEntity.ok(
                enquiryService.updateEnquiry(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnquiry(
            @PathVariable Long id) {

        enquiryService.deleteEnquiry(id);

        return ResponseEntity.noContent().build();
    }
}