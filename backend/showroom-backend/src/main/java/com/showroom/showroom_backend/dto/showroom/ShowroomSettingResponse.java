package com.showroom.showroom_backend.dto.showroom;

import java.time.LocalDateTime;

public class ShowroomSettingResponse {

    private Long id;

    private String showroomName;
    private String address;
    private String phone;
    private String email;
    private String whatsapp;
    private String openingHours;
    private String about;
    private String googleMapsUrl;
    private String instagramUrl;
    private String facebookUrl;
    private String youtubeUrl;

    private LocalDateTime updatedAt;

    public ShowroomSettingResponse() {
    }

    public ShowroomSettingResponse(
            Long id,
            String showroomName,
            String address,
            String phone,
            String email,
            String whatsapp,
            String openingHours,
            String about,
            String googleMapsUrl,
            String instagramUrl,
            String facebookUrl,
            String youtubeUrl,
            LocalDateTime updatedAt) {

        this.id = id;
        this.showroomName = showroomName;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.whatsapp = whatsapp;
        this.openingHours = openingHours;
        this.about = about;
        this.googleMapsUrl = googleMapsUrl;
        this.instagramUrl = instagramUrl;
        this.facebookUrl = facebookUrl;
        this.youtubeUrl = youtubeUrl;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShowroomName() {
        return showroomName;
    }

    public void setShowroomName(String showroomName) {
        this.showroomName = showroomName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getGoogleMapsUrl() {
        return googleMapsUrl;
    }

    public void setGoogleMapsUrl(String googleMapsUrl) {
        this.googleMapsUrl = googleMapsUrl;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }

    public String getYoutubeUrl() {
        return youtubeUrl;
    }

    public void setYoutubeUrl(String youtubeUrl) {
        this.youtubeUrl = youtubeUrl;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}