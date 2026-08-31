package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.enquiry.EnquiryRequest;
import com.showroom.showroom_backend.dto.enquiry.EnquiryResponse;
import com.showroom.showroom_backend.entity.Enquiry;
import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.EnquiryRepository;
import com.showroom.showroom_backend.repository.VehicleRepository;
import com.showroom.showroom_backend.service.EnquiryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnquiryServiceImpl implements EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final VehicleRepository vehicleRepository;

    public EnquiryServiceImpl(
            EnquiryRepository enquiryRepository,
            VehicleRepository vehicleRepository) {

        this.enquiryRepository = enquiryRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public EnquiryResponse createEnquiry(EnquiryRequest request) {

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: "
                                        + request.getVehicleId()
                        )
                );

        Enquiry enquiry = new Enquiry();

        enquiry.setVehicle(vehicle);
        enquiry.setCustomerName(request.getCustomerName());
        enquiry.setEmail(request.getEmail());
        enquiry.setPhone(request.getPhone());
        enquiry.setMessage(request.getMessage());

        // New enquiry always starts as NEW
        enquiry.setStatus("NEW");

        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        return mapToResponse(savedEnquiry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnquiryResponse> getAllEnquiries() {

        return enquiryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EnquiryResponse getEnquiryById(Long id) {

        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Enquiry not found with id: " + id
                        )
                );

        return mapToResponse(enquiry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnquiryResponse> getEnquiriesByVehicle(
            Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException(
                    "Vehicle not found with id: " + vehicleId
            );
        }

        return enquiryRepository.findByVehicleId(vehicleId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnquiryResponse> getEnquiriesByStatus(
            String status) {

        return enquiryRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EnquiryResponse updateEnquiry(
            Long id,
            EnquiryRequest request) {

        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Enquiry not found with id: " + id
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

        enquiry.setVehicle(vehicle);
        enquiry.setCustomerName(request.getCustomerName());
        enquiry.setEmail(request.getEmail());
        enquiry.setPhone(request.getPhone());
        enquiry.setMessage(request.getMessage());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            enquiry.setStatus(request.getStatus());
        }

        Enquiry updatedEnquiry =
                enquiryRepository.save(enquiry);

        return mapToResponse(updatedEnquiry);
    }

    @Override
    public void deleteEnquiry(Long id) {

        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Enquiry not found with id: " + id
                        )
                );

        enquiryRepository.delete(enquiry);
    }

    private EnquiryResponse mapToResponse(
            Enquiry enquiry) {

        return new EnquiryResponse(
                enquiry.getId(),
                enquiry.getVehicle().getId(),
                enquiry.getVehicle().getName(),
                enquiry.getCustomerName(),
                enquiry.getEmail(),
                enquiry.getPhone(),
                enquiry.getMessage(),
                enquiry.getStatus(),
                enquiry.getCreatedAt(),
                enquiry.getUpdatedAt()
        );
    }
}