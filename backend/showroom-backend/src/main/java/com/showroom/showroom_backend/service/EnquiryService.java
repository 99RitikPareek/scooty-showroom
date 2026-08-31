package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.enquiry.EnquiryRequest;
import com.showroom.showroom_backend.dto.enquiry.EnquiryResponse;

import java.util.List;

public interface EnquiryService {

    EnquiryResponse createEnquiry(EnquiryRequest request);

    List<EnquiryResponse> getAllEnquiries();

    EnquiryResponse getEnquiryById(Long id);

    List<EnquiryResponse> getEnquiriesByVehicle(Long vehicleId);

    List<EnquiryResponse> getEnquiriesByStatus(String status);

    EnquiryResponse updateEnquiry(Long id, EnquiryRequest request);

    void deleteEnquiry(Long id);
}