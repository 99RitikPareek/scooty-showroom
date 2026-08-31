package com.showroom.showroom_backend.specification;

import com.showroom.showroom_backend.entity.Vehicle;
import com.showroom.showroom_backend.entity.VehicleType;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    private VehicleSpecification() {
    }

    public static Specification<Vehicle> filterVehicles(
            String keyword,
            Long brandId,
            VehicleType vehicleType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean available,
            Boolean featured,
            String fuelType) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Keyword search
            if (keyword != null && !keyword.trim().isEmpty()) {

                String searchKeyword =
                        "%" + keyword.trim().toLowerCase() + "%";

                Predicate namePredicate =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                searchKeyword
                        );

                Predicate modelPredicate =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("model")),
                                searchKeyword
                        );

                Predicate variantPredicate =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("variant")),
                                searchKeyword
                        );

                predicates.add(
                        criteriaBuilder.or(
                                namePredicate,
                                modelPredicate,
                                variantPredicate
                        )
                );
            }

            // Brand filter
            if (brandId != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("brand").get("id"),
                                brandId
                        )
                );
            }

            // Vehicle type filter
            if (vehicleType != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("vehicleType"),
                                vehicleType
                        )
                );
            }

            // Minimum price
            if (minPrice != null) {

                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("price"),
                                minPrice
                        )
                );
            }

            // Maximum price
            if (maxPrice != null) {

                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("price"),
                                maxPrice
                        )
                );
            }

            // Available filter
            if (available != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("available"),
                                available
                        )
                );
            }

            // Featured filter
            if (featured != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("featured"),
                                featured
                        )
                );
            }

            // Fuel type filter
            if (fuelType != null && !fuelType.trim().isEmpty()) {

                predicates.add(
                        criteriaBuilder.equal(
                                criteriaBuilder.lower(
                                        root.get("fuelType")
                                ),
                                fuelType.trim().toLowerCase()
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}