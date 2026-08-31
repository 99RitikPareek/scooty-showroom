package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingRequest;
import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingResponse;
import com.showroom.showroom_backend.dto.servicebooking.ServiceBookingStatusUpdateRequest;
import com.showroom.showroom_backend.entity.ServiceBooking;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.ServiceBookingRepository;
import com.showroom.showroom_backend.service.ServiceBookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ServiceBookingServiceImpl implements ServiceBookingService {

    private final ServiceBookingRepository repository;
    private final Random random = new Random();

    public ServiceBookingServiceImpl(ServiceBookingRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public ServiceBookingResponse createBooking(ServiceBookingRequest request) {
        ServiceBooking booking = new ServiceBooking();
        booking.setBookingCode(generateUniqueBookingCode());
        booking.setCustomerName(request.getCustomerName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setVehicleModel(request.getVehicleModel());
        booking.setRegistrationNumber(request.getRegistrationNumber());
        booking.setServiceType(request.getServiceType());
        booking.setPreferredDate(request.getPreferredDate());
        booking.setPreferredTimeSlot(request.getPreferredTimeSlot());
        booking.setNotes(request.getNotes());
        booking.setStatus("PENDING");

        ServiceBooking saved = repository.save(booking);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceBookingResponse> getAllBookings(String status, String query) {
        List<ServiceBooking> bookings;

        if (query != null && !query.trim().isEmpty()) {
            String q = query.trim();
            bookings = repository.findByBookingCodeContainingIgnoreCaseOrCustomerNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(q, q, q);
        } else if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            bookings = repository.findByStatusOrderByPreferredDateAsc(status.trim().toUpperCase());
        } else {
            bookings = repository.findAllByOrderByCreatedAtDesc();
        }

        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceBookingResponse getBookingById(Long id) {
        ServiceBooking booking = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service booking not found with id: " + id));
        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceBookingResponse getBookingByCode(String bookingCode) {
        ServiceBooking booking = repository.findByBookingCode(bookingCode.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Service booking not found with code: " + bookingCode));
        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceBookingResponse> getBookingsByPhone(String phone) {
        return repository.findByPhoneOrderByCreatedAtDesc(phone.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceBookingResponse> trackBooking(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String cleaned = identifier.trim();

        // First check if it matches a booking code exactly
        if (cleaned.toUpperCase().startsWith("SRV-")) {
            return repository.findByBookingCode(cleaned.toUpperCase())
                    .map(b -> List.of(mapToResponse(b)))
                    .orElse(new ArrayList<>());
        }

        // Check by phone number
        List<ServiceBooking> byPhone = repository.findByPhoneOrderByCreatedAtDesc(cleaned);
        if (!byPhone.isEmpty()) {
            return byPhone.stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        // Try case-insensitive booking code lookup
        return repository.findByBookingCode(cleaned)
                .map(b -> List.of(mapToResponse(b)))
                .orElse(new ArrayList<>());
    }

    @Override
    @Transactional
    public ServiceBookingResponse updateBookingStatus(Long id, ServiceBookingStatusUpdateRequest request) {
        ServiceBooking booking = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service booking not found with id: " + id));

        booking.setStatus(request.getStatus().toUpperCase());
        if (request.getEstimatedCost() != null) {
            booking.setEstimatedCost(request.getEstimatedCost());
        }
        if (request.getAdminNotes() != null) {
            booking.setAdminNotes(request.getAdminNotes());
        }

        ServiceBooking updated = repository.save(booking);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public ServiceBookingResponse updateBooking(Long id, ServiceBookingRequest request) {
        ServiceBooking booking = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service booking not found with id: " + id));

        booking.setCustomerName(request.getCustomerName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setVehicleModel(request.getVehicleModel());
        booking.setRegistrationNumber(request.getRegistrationNumber());
        booking.setServiceType(request.getServiceType());
        booking.setPreferredDate(request.getPreferredDate());
        booking.setPreferredTimeSlot(request.getPreferredTimeSlot());
        booking.setNotes(request.getNotes());

        ServiceBooking updated = repository.save(booking);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        ServiceBooking booking = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service booking not found with id: " + id));
        repository.delete(booking);
    }

    private String generateUniqueBookingCode() {
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String code;
        do {
            String randomChars = generateRandomAlphanumeric(4);
            code = "SRV-" + datePrefix + "-" + randomChars;
        } while (repository.findByBookingCode(code).isPresent());

        return code;
    }

    private String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private ServiceBookingResponse mapToResponse(ServiceBooking entity) {
        ServiceBookingResponse response = new ServiceBookingResponse();
        response.setId(entity.getId());
        response.setBookingCode(entity.getBookingCode());
        response.setCustomerName(entity.getCustomerName());
        response.setEmail(entity.getEmail());
        response.setPhone(entity.getPhone());
        response.setVehicleModel(entity.getVehicleModel());
        response.setRegistrationNumber(entity.getRegistrationNumber());
        response.setServiceType(entity.getServiceType());
        response.setPreferredDate(entity.getPreferredDate());
        response.setPreferredTimeSlot(entity.getPreferredTimeSlot());
        response.setNotes(entity.getNotes());
        response.setStatus(entity.getStatus());
        response.setEstimatedCost(entity.getEstimatedCost());
        response.setAdminNotes(entity.getAdminNotes());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}
