package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.entity.OtpToken;
import com.showroom.showroom_backend.repository.OtpTokenRepository;
import com.showroom.showroom_backend.service.OtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpServiceImpl.class);
    private final OtpTokenRepository otpTokenRepository;
    private final Random random = new Random();

    public OtpServiceImpl(OtpTokenRepository otpTokenRepository) {
        this.otpTokenRepository = otpTokenRepository;
    }

    @Override
    @Transactional
    public String sendOtp(String phone) {
        String cleanPhone = phone.trim();

        // Generate 6-digit random OTP
        String otp = String.format("%06d", random.nextInt(1000000));

        OtpToken otpToken = new OtpToken();
        otpToken.setPhone(cleanPhone);
        otpToken.setOtp(otp);
        otpToken.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpToken.setVerified(false);

        otpTokenRepository.save(otpToken);

        // TODO(security): Replace console SMS logger with actual SMS Gateway API (Fast2SMS / Twilio / MSG91)
        logger.info("=================================================");
        logger.info("SMS OTP for mobile [{}]: {}", cleanPhone, otp);
        logger.info("=================================================");

        return otp;
    }

    @Override
    @Transactional
    public boolean verifyOtp(String phone, String otp) {
        String cleanPhone = phone.trim();
        String cleanOtp = otp.trim();

        Optional<OtpToken> optionalOtpToken = otpTokenRepository.findTopByPhoneOrderByCreatedAtDesc(cleanPhone);

        if (optionalOtpToken.isEmpty()) {
            return false;
        }

        OtpToken otpToken = optionalOtpToken.get();

        if (otpToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        if (otpToken.getOtp().equals(cleanOtp)) {
            otpToken.setVerified(true);
            otpTokenRepository.save(otpToken);
            return true;
        }

        return false;
    }
}
