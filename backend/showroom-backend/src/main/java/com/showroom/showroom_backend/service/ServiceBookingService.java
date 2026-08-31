package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingRequest;
import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingResponse;
import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingStatusUpdateRequest;

import java.util.List;

public interface ServiceBookingService {

    ServiceBookingResponse createBooking(ServiceBookingRequest request);

    List<ServiceBookingResponse> getAllBookings(String status, String query);

    ServiceBookingResponse getBookingById(Long id);

    ServiceBookingResponse getBookingByCode(String bookingCode);

    List<ServiceBookingResponse> getBookingsByPhone(String phone);

    List<ServiceBookingResponse> trackBooking(String identifier);

    ServiceBookingResponse updateBookingStatus(Long id, ServiceBookingStatusUpdateRequest request);

    ServiceBookingResponse updateBooking(Long id, ServiceBookingRequest request);

    void deleteBooking(Long id);
}
