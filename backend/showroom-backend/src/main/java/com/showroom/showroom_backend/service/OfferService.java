package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.offer.OfferRequest;
import com.showroom.showroom_backend.dto.offer.OfferResponse;

import java.util.List;

public interface OfferService {

    OfferResponse createOffer(OfferRequest request);

    List<OfferResponse> getAllOffers();

    OfferResponse getOfferById(Long id);

    List<OfferResponse> getActiveOffers();

    List<OfferResponse> getOffersByVehicle(Long vehicleId);

    OfferResponse updateOffer(Long id, OfferRequest request);

    void deleteOffer(Long id);
}