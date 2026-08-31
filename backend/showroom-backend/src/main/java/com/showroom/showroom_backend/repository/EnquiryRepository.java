package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findByVehicleId(Long vehicleId);

    List<Enquiry> findByStatus(String status);
}