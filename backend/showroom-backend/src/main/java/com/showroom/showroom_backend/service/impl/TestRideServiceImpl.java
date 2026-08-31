package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.testride.TestRideRequest;
import com.showroom.showroom_backend.dto.testride.TestRideResponse;
import com.showroom.showroom_backend.entity.TestRide;
import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.TestRideRepository;
import com.showroom.showroom_backend.repository.VehicleRepository;
import com.showroom.showroom_backend.service.TestRideService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TestRideServiceImpl implements TestRideService {

    private final TestRideRepository testRideRepository;
    private final VehicleRepository vehicleRepository;

    public TestRideServiceImpl(
            TestRideRepository testRideRepository,
            VehicleRepository vehicleRepository) {

        this.testRideRepository = testRideRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public TestRideResponse createTestRide(TestRideRequest request) {

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: "
                                        + request.getVehicleId()
                        )
                );

        TestRide testRide = new TestRide();

        testRide.setVehicle(vehicle);
        testRide.setCustomerName(request.getCustomerName());
        testRide.setEmail(request.getEmail());
        testRide.setPhone(request.getPhone());
        testRide.setPreferredDate(request.getPreferredDate());
        testRide.setPreferredTime(request.getPreferredTime());
        testRide.setMessage(request.getMessage());

        // New test ride always starts as PENDING
        testRide.setStatus("PENDING");

        TestRide savedTestRide =
                testRideRepository.save(testRide);

        return mapToResponse(savedTestRide);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestRideResponse> getAllTestRides() {

        return testRideRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TestRideResponse getTestRideById(Long id) {

        TestRide testRide = testRideRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Test ride not found with id: " + id
                        )
                );

        return mapToResponse(testRide);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestRideResponse> getTestRidesByVehicle(
            Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException(
                    "Vehicle not found with id: " + vehicleId
            );
        }

        return testRideRepository.findByVehicleId(vehicleId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestRideResponse> getTestRidesByStatus(
            String status) {

        return testRideRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TestRideResponse updateTestRide(
            Long id,
            TestRideRequest request) {

        TestRide testRide = testRideRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Test ride not found with id: " + id
                        )
                );

        Vehicle vehicle = vehicleRepository.findById(
                request.getVehicleId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Vehicle not found with id: "
                                + request.getVehicleId()
                )
        );

        testRide.setVehicle(vehicle);
        testRide.setCustomerName(request.getCustomerName());
        testRide.setEmail(request.getEmail());
        testRide.setPhone(request.getPhone());
        testRide.setPreferredDate(request.getPreferredDate());
        testRide.setPreferredTime(request.getPreferredTime());
        testRide.setMessage(request.getMessage());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            testRide.setStatus(request.getStatus());
        }

        TestRide updatedTestRide =
                testRideRepository.save(testRide);

        return mapToResponse(updatedTestRide);
    }

    @Override
    public void deleteTestRide(Long id) {

        TestRide testRide = testRideRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Test ride not found with id: " + id
                        )
                );

        testRideRepository.delete(testRide);
    }

    private TestRideResponse mapToResponse(
            TestRide testRide) {

        return new TestRideResponse(
                testRide.getId(),
                testRide.getVehicle().getId(),
                testRide.getVehicle().getName(),
                testRide.getCustomerName(),
                testRide.getEmail(),
                testRide.getPhone(),
                testRide.getPreferredDate(),
                testRide.getPreferredTime(),
                testRide.getStatus(),
                testRide.getMessage(),
                testRide.getCreatedAt(),
                testRide.getUpdatedAt()
        );
    }
}