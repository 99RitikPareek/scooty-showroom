package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.showroom.ShowroomSettingRequest;
import com.showroom.showroom_backend.dto.showroom.ShowroomSettingResponse;
import com.showroom.showroom_backend.service.ShowroomSettingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/showroom-settings")
public class ShowroomSettingController {

    private final ShowroomSettingService showroomSettingService;

    public ShowroomSettingController(
            ShowroomSettingService showroomSettingService) {

        this.showroomSettingService = showroomSettingService;
    }

    @GetMapping
    public ResponseEntity<ShowroomSettingResponse> getSettings() {

        return ResponseEntity.ok(
                showroomSettingService.getSettings()
        );
    }

    @PostMapping
    public ResponseEntity<ShowroomSettingResponse> createSettings(
            @Valid @RequestBody ShowroomSettingRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        showroomSettingService.createSettings(request)
                );
    }

    @PutMapping
    public ResponseEntity<ShowroomSettingResponse> updateSettings(
            @Valid @RequestBody ShowroomSettingRequest request) {

        return ResponseEntity.ok(
                showroomSettingService.updateSettings(request)
        );
    }
}