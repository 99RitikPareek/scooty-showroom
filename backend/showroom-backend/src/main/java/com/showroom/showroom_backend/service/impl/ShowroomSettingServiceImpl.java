package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.showroom.ShowroomSettingRequest;
import com.showroom.showroom_backend.dto.showroom.ShowroomSettingResponse;
import com.showroom.showroom_backend.entity.ShowroomSetting;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.ShowroomSettingRepository;
import com.showroom.showroom_backend.service.ShowroomSettingService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ShowroomSettingServiceImpl
        implements ShowroomSettingService {

    private final ShowroomSettingRepository showroomSettingRepository;

    public ShowroomSettingServiceImpl(
            ShowroomSettingRepository showroomSettingRepository) {

        this.showroomSettingRepository = showroomSettingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ShowroomSettingResponse getSettings() {

        ShowroomSetting setting =
                showroomSettingRepository.findAll()
                        .stream()
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Showroom settings not found"
                                )
                        );

        return mapToResponse(setting);
    }

    @Override
    public ShowroomSettingResponse createSettings(
            ShowroomSettingRequest request) {

        // Only one showroom setting record is allowed.
        if (showroomSettingRepository.count() > 0) {
            throw new IllegalStateException(
                    "Showroom settings already exist"
            );
        }

        ShowroomSetting setting = new ShowroomSetting();

        updateEntityFromRequest(setting, request);

        ShowroomSetting savedSetting =
                showroomSettingRepository.save(setting);

        return mapToResponse(savedSetting);
    }

    @Override
    public ShowroomSettingResponse updateSettings(
            ShowroomSettingRequest request) {

        ShowroomSetting setting =
                showroomSettingRepository.findAll()
                        .stream()
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Showroom settings not found"
                                )
                        );

        updateEntityFromRequest(setting, request);

        ShowroomSetting updatedSetting =
                showroomSettingRepository.save(setting);

        return mapToResponse(updatedSetting);
    }

    private void updateEntityFromRequest(
            ShowroomSetting setting,
            ShowroomSettingRequest request) {

        setting.setShowroomName(request.getShowroomName());
        setting.setAddress(request.getAddress());
        setting.setPhone(request.getPhone());
        setting.setEmail(request.getEmail());
        setting.setWhatsapp(request.getWhatsapp());
        setting.setOpeningHours(request.getOpeningHours());
        setting.setAbout(request.getAbout());
        setting.setGoogleMapsUrl(request.getGoogleMapsUrl());
        setting.setInstagramUrl(request.getInstagramUrl());
        setting.setFacebookUrl(request.getFacebookUrl());
        setting.setYoutubeUrl(request.getYoutubeUrl());
    }

    private ShowroomSettingResponse mapToResponse(
            ShowroomSetting setting) {

        return new ShowroomSettingResponse(
                setting.getId(),
                setting.getShowroomName(),
                setting.getAddress(),
                setting.getPhone(),
                setting.getEmail(),
                setting.getWhatsapp(),
                setting.getOpeningHours(),
                setting.getAbout(),
                setting.getGoogleMapsUrl(),
                setting.getInstagramUrl(),
                setting.getFacebookUrl(),
                setting.getYoutubeUrl(),
                setting.getUpdatedAt()
        );
    }
}