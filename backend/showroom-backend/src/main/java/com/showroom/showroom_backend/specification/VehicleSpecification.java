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
            String fuelType,
            String category,
            String model) {

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

            
            // Category filter
            if (category != null && !category.trim().isEmpty()) {
                String catUpper = category.trim().toUpperCase();
                if ("ELECTRIC".equals(catUpper) || "EV".equals(catUpper)) {
                    Predicate catMatch = criteriaBuilder.equal(criteriaBuilder.upper(root.get("category")), "ELECTRIC");
                    Predicate fuelMatch = criteriaBuilder.like(criteriaBuilder.upper(root.get("fuelType")), "%ELECTRIC%");
                    Predicate evMatch = criteriaBuilder.like(criteriaBuilder.upper(root.get("fuelType")), "%EV%");
                    predicates.add(criteriaBuilder.or(catMatch, fuelMatch, evMatch));
                } else if ("BIKE".equals(catUpper)) {
                    Predicate catMatch = criteriaBuilder.equal(criteriaBuilder.upper(root.get("category")), "BIKE");
                    Predicate gixxer = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%GIXXER%");
                    Predicate strom = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%STROM%");
                    Predicate hayabusa = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%HAYABUSA%");
                    Predicate katana = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%KATANA%");
                    Predicate intruder = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%INTRUDER%");
                    predicates.add(criteriaBuilder.or(catMatch, gixxer, strom, hayabusa, katana, intruder));
                } else if ("SCOOTER".equals(catUpper) || "SCOOTY".equals(catUpper)) {
                    Predicate catMatch = criteriaBuilder.equal(criteriaBuilder.upper(root.get("category")), "SCOOTER");
                    Predicate gixxer = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%GIXXER%");
                    Predicate strom = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%STROM%");
                    Predicate hayabusa = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%HAYABUSA%");
                    Predicate katana = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%KATANA%");
                    Predicate intruder = criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%INTRUDER%");
                    Predicate fuelEv = criteriaBuilder.like(criteriaBuilder.upper(root.get("fuelType")), "%ELECTRIC%");
                    
                    Predicate notBikeOrEv = criteriaBuilder.not(criteriaBuilder.or(gixxer, strom, hayabusa, katana, intruder, fuelEv));
                    predicates.add(criteriaBuilder.or(catMatch, notBikeOrEv));
                } else {
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.upper(root.get("category")), catUpper));
                }
            }

            
            // Model filter
            if (model != null && !model.trim().isEmpty()) {
                String mLower = "%" + model.trim().toLowerCase() + "%";
                Predicate nameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), mLower);
                Predicate modelMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("model")), mLower);
                Predicate variantMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("variant")), mLower);
                predicates.add(criteriaBuilder.or(nameMatch, modelMatch, variantMatch));
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}