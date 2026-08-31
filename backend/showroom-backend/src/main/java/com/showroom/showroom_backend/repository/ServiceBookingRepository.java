package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.ServiceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {

    Optional<ServiceBooking> findByBookingCode(String bookingCode);

    List<ServiceBooking> findByPhoneOrderByCreatedAtDesc(String phone);

    List<ServiceBooking> findByStatusOrderByPreferredDateAsc(String status);

    List<ServiceBooking> findAllByOrderByCreatedAtDesc();

    List<ServiceBooking> findByBookingCodeContainingIgnoreCaseOrCustomerNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String bookingCode, String customerName, String phone);
}
