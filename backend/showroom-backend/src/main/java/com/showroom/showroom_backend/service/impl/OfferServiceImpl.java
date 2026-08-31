package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.offer.OfferRequest;
import com.showroom.showroom_backend.dto.offer.OfferResponse;
import com.showroom.showroom_backend.entity.Offer;
import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.OfferRepository;
import com.showroom.showroom_backend.repository.VehicleRepository;
import com.showroom.showroom_backend.service.OfferService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final VehicleRepository vehicleRepository;

    public OfferServiceImpl(
            OfferRepository offerRepository,
            VehicleRepository vehicleRepository) {

        this.offerRepository = offerRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public OfferResponse createOffer(OfferRequest request) {

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: "
                                        + request.getVehicleId()
                        )
                );

        Offer offer = new Offer();

        offer.setVehicle(vehicle);
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setDiscountType(request.getDiscountType());
        offer.setDiscountValue(request.getDiscountValue());
        offer.setStartDate(request.getStartDate());
        offer.setEndDate(request.getEndDate());
        offer.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );

        Offer savedOffer = offerRepository.save(offer);

        return mapToResponse(savedOffer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getAllOffers() {

        return offerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OfferResponse getOfferById(Long id) {

        Offer offer = offerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Offer not found with id: " + id
                        )
                );

        return mapToResponse(offer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getActiveOffers() {

        return offerRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByVehicle(Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException(
                    "Vehicle not found with id: " + vehicleId
            );
        }

        return offerRepository.findByVehicleId(vehicleId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OfferResponse updateOffer(
            Long id,
            OfferRequest request) {

        Offer offer = offerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Offer not found with id: " + id
                        )
                );

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with id: "
                                        + request.getVehicleId()
                        )
                );

        offer.setVehicle(vehicle);
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setDiscountType(request.getDiscountType());
        offer.setDiscountValue(request.getDiscountValue());
        offer.setStartDate(request.getStartDate());
        offer.setEndDate(request.getEndDate());

        if (request.getActive() != null) {
            offer.setActive(request.getActive());
        }

        Offer updatedOffer = offerRepository.save(offer);

        return mapToResponse(updatedOffer);
    }

    @Override
    public void deleteOffer(Long id) {

        Offer offer = offerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Offer not found with id: " + id
                        )
                );

        offerRepository.delete(offer);
    }

    private OfferResponse mapToResponse(Offer offer) {

        return new OfferResponse(
                offer.getId(),
                offer.getVehicle().getId(),
                offer.getVehicle().getName(),
                offer.getTitle(),
                offer.getDescription(),
                offer.getDiscountType(),
                offer.getDiscountValue(),
                offer.getStartDate(),
                offer.getEndDate(),
                offer.getActive(),
                offer.getCreatedAt(),
                offer.getUpdatedAt()
        );
    }
}