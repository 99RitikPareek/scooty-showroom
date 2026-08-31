package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.showroom.ShowroomSettingRequest;
import com.showroom.showroom_backend.dto.showroom.ShowroomSettingResponse;

public interface ShowroomSettingService {

    ShowroomSettingResponse getSettings();

    ShowroomSettingResponse createSettings(
            ShowroomSettingRequest request
    );

    ShowroomSettingResponse updateSettings(
            ShowroomSettingRequest request
    );
}