package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.TestRide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRideRepository extends JpaRepository<TestRide, Long> {

    List<TestRide> findByVehicleId(Long vehicleId);

    List<TestRide> findByStatus(String status);
}