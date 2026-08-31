package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByActiveTrue();

    List<Offer> findByVehicleId(Long vehicleId);
}