package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findTopByPhoneOrderByCreatedAtDesc(String phone);

    void deleteByExpiryTimeBefore(LocalDateTime now);
}
