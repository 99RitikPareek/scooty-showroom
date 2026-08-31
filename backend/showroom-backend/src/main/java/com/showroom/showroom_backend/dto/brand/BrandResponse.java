package com.showroom.showroom_backend.dto.brand;

public class BrandResponse {

    private Long id;
    private String name;
    private String logoUrl;
    private Boolean active;

    public BrandResponse() {
    }

    public BrandResponse(Long id, String name, String logoUrl, Boolean active) {
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}