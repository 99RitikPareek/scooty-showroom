package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.gallery.GalleryRequest;
import com.showroom.showroom_backend.dto.gallery.GalleryResponse;

import java.util.List;

public interface GalleryService {

    GalleryResponse createGallery(GalleryRequest request);

    List<GalleryResponse> getAllGallery();

    List<GalleryResponse> getActiveGallery();

    GalleryResponse getGalleryById(Long id);

    List<GalleryResponse> getGalleryByCategory(String category);

    GalleryResponse updateGallery(Long id, GalleryRequest request);

    void deleteGallery(Long id);
}