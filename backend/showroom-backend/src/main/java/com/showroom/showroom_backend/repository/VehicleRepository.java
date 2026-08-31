package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VehicleRepository
        extends JpaRepository<Vehicle, Long>,
        JpaSpecificationExecutor<Vehicle>  {

    List<Vehicle> findByVehicleType(VehicleType vehicleType);

    List<Vehicle> findByAvailableTrue();

    List<Vehicle> findByFeaturedTrue();

    List<Vehicle> findByBrandId(Long brandId);

    List<Vehicle> findByNameContainingIgnoreCaseOrModelContainingIgnoreCaseOrVariantContainingIgnoreCase(
            String name,
            String model,
            String variant
    );
    Page<Vehicle> findByNameContainingIgnoreCaseOrModelContainingIgnoreCaseOrVariantContainingIgnoreCase(
            String name,
            String model,
            String variant,
            Pageable pageable
    );
}