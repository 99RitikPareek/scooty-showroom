package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.offer.OfferRequest;
import com.showroom.showroom_backend.dto.offer.OfferResponse;
import com.showroom.showroom_backend.service.OfferService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(
            @Valid @RequestBody OfferRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(offerService.createOffer(request));
    }

    @GetMapping
    public ResponseEntity<List<OfferResponse>> getAllOffers() {

        return ResponseEntity.ok(
                offerService.getAllOffers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOfferById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                offerService.getOfferById(id)
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<OfferResponse>> getActiveOffers() {

        return ResponseEntity.ok(
                offerService.getActiveOffers()
        );
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<OfferResponse>> getOffersByVehicle(
            @PathVariable Long vehicleId) {

        return ResponseEntity.ok(
                offerService.getOffersByVehicle(vehicleId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferResponse> updateOffer(
            @PathVariable Long id,
            @Valid @RequestBody OfferRequest request) {

        return ResponseEntity.ok(
                offerService.updateOffer(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(
            @PathVariable Long id) {

        offerService.deleteOffer(id);

        return ResponseEntity.noContent().build();
    }
}