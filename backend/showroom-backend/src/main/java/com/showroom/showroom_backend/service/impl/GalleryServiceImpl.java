package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.gallery.GalleryRequest;
import com.showroom.showroom_backend.dto.gallery.GalleryResponse;
import com.showroom.showroom_backend.entity.Gallery;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.GalleryRepository;
import com.showroom.showroom_backend.service.GalleryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;

    public GalleryServiceImpl(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @Override
    public GalleryResponse createGallery(GalleryRequest request) {

        Gallery gallery = new Gallery();

        gallery.setImageUrl(request.getImageUrl());
        gallery.setTitle(request.getTitle());
        gallery.setDescription(request.getDescription());
        gallery.setCategory(request.getCategory());
        gallery.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
        gallery.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        Gallery savedGallery = galleryRepository.save(gallery);

        return mapToResponse(savedGallery);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GalleryResponse> getAllGallery() {

        return galleryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GalleryResponse> getActiveGallery() {

        return galleryRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GalleryResponse getGalleryById(Long id) {

        Gallery gallery = galleryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Gallery image not found with id: " + id
                        )
                );

        return mapToResponse(gallery);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GalleryResponse> getGalleryByCategory(
            String category) {

        return galleryRepository
                .findByCategoryAndActiveTrueOrderByDisplayOrderAsc(
                        category
                )
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GalleryResponse updateGallery(
            Long id,
            GalleryRequest request) {

        Gallery gallery = galleryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Gallery image not found with id: " + id
                        )
                );

        gallery.setImageUrl(request.getImageUrl());
        gallery.setTitle(request.getTitle());
        gallery.setDescription(request.getDescription());
        gallery.setCategory(request.getCategory());

        if (request.getActive() != null) {
            gallery.setActive(request.getActive());
        }

        if (request.getDisplayOrder() != null) {
            gallery.setDisplayOrder(request.getDisplayOrder());
        }

        Gallery updatedGallery =
                galleryRepository.save(gallery);

        return mapToResponse(updatedGallery);
    }

    @Override
    public void deleteGallery(Long id) {

        Gallery gallery = galleryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Gallery image not found with id: " + id
                        )
                );

        galleryRepository.delete(gallery);
    }

    private GalleryResponse mapToResponse(Gallery gallery) {

        return new GalleryResponse(
                gallery.getId(),
                gallery.getImageUrl(),
                gallery.getTitle(),
                gallery.getDescription(),
                gallery.getCategory(),
                gallery.getActive(),
                gallery.getDisplayOrder(),
                gallery.getCreatedAt(),
                gallery.getUpdatedAt()
        );
    }
}