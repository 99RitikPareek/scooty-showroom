package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.brand.BrandRequest;
import com.showroom.showroom_backend.dto.brand.BrandResponse;

import java.util.List;

public interface BrandService {

    BrandResponse createBrand(BrandRequest request);

    List<BrandResponse> getAllBrands();

    BrandResponse getBrandById(Long id);

    BrandResponse updateBrand(Long id, BrandRequest request);

    void deleteBrand(Long id);
}