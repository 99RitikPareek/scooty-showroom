package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.testride.TestRideRequest;
import com.showroom.showroom_backend.dto.testride.TestRideResponse;

import java.util.List;

public interface TestRideService {

    TestRideResponse createTestRide(TestRideRequest request);

    List<TestRideResponse> getAllTestRides();

    TestRideResponse getTestRideById(Long id);

    List<TestRideResponse> getTestRidesByVehicle(Long vehicleId);

    List<TestRideResponse> getTestRidesByStatus(String status);

    TestRideResponse updateTestRide(Long id, TestRideRequest request);

    void deleteTestRide(Long id);
}