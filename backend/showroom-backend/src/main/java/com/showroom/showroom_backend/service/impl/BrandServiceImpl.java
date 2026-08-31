package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.brand.BrandRequest;
import com.showroom.showroom_backend.dto.brand.BrandResponse;
import com.showroom.showroom_backend.entity.Brand;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.BrandRepository;
import com.showroom.showroom_backend.service.BrandService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public BrandResponse createBrand(BrandRequest request) {

        brandRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(brand -> {
                    throw new IllegalArgumentException(
                            "Brand already exists"
                    );
                });

        Brand brand = new Brand();

        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setActive(true);

        Brand savedBrand = brandRepository.save(brand);

        return mapToResponse(savedBrand);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponse> getAllBrands() {

        return brandRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponse getBrandById(Long id) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Brand not found with id: " + id
                        ));

        return mapToResponse(brand);
    }

    @Override
    public BrandResponse updateBrand(
            Long id,
            BrandRequest request) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Brand not found with id: " + id
                        ));

        brandRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(existingBrand -> {

                    if (!existingBrand.getId().equals(id)) {
                        throw new IllegalArgumentException(
                                "Brand already exists"
                        );
                    }
                });

        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());

        Brand updatedBrand = brandRepository.save(brand);

        return mapToResponse(updatedBrand);
    }

    @Override
    public void deleteBrand(Long id) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Brand not found with id: " + id
                        ));

        brand.setActive(false);

        brandRepository.save(brand);
    }

    private BrandResponse mapToResponse(Brand brand) {

        return new BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getLogoUrl(),
                brand.getActive()
        );
    }
}