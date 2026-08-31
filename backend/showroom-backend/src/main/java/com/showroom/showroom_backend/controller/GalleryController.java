package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.gallery.GalleryRequest;
import com.showroom.showroom_backend.dto.gallery.GalleryResponse;
import com.showroom.showroom_backend.service.GalleryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @PostMapping
    public ResponseEntity<GalleryResponse> createGallery(
            @Valid @RequestBody GalleryRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(galleryService.createGallery(request));
    }

    @GetMapping
    public ResponseEntity<List<GalleryResponse>> getAllGallery() {

        return ResponseEntity.ok(
                galleryService.getAllGallery()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<GalleryResponse>> getActiveGallery() {

        return ResponseEntity.ok(
                galleryService.getActiveGallery()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalleryResponse> getGalleryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                galleryService.getGalleryById(id)
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GalleryResponse>> getGalleryByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                galleryService.getGalleryByCategory(category)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<GalleryResponse> updateGallery(
            @PathVariable Long id,
            @Valid @RequestBody GalleryRequest request) {

        return ResponseEntity.ok(
                galleryService.updateGallery(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGallery(
            @PathVariable Long id) {

        galleryService.deleteGallery(id);

        return ResponseEntity.noContent().build();
    }
}