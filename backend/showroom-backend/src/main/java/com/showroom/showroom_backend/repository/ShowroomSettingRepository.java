package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.ShowroomSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowroomSettingRepository
        extends JpaRepository<ShowroomSetting, Long> {
}