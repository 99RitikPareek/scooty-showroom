package com.showroom.showroom_backend.dto.admin;

public class ShowroomSettingsDTO {

    private String showroomName;
    private String phone;
    private String email;
    private String address;
    private String openingHours;
    private Boolean emailAlertsEnquiries;
    private Boolean emailAlertsTestRides;
    private Boolean autoApprovalTestRides;

    public ShowroomSettingsDTO() {
        // Defaults
        this.showroomName = "Shri Hari Suzuki";
        this.phone = "+91 98765 43210";
        this.email = "info@shriharisuzuki.com";
        this.address = "Hotel The Sara, AB Road, near Kushmoda Chauki, Gaushala Mahaveerpura, Guna, Madhya Pradesh 473001";
        this.openingHours = "Monday - Saturday: 9:00 AM - 8:00 PM | Sunday: Closed";
        this.emailAlertsEnquiries = true;
        this.emailAlertsTestRides = true;
        this.autoApprovalTestRides = false;
    }

    public String getShowroomName() {
        return showroomName;
    }

    public void setShowroomName(String showroomName) {
        this.showroomName = showroomName;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public Boolean getEmailAlertsEnquiries() {
        return emailAlertsEnquiries;
    }

    public void setEmailAlertsEnquiries(Boolean emailAlertsEnquiries) {
        this.emailAlertsEnquiries = emailAlertsEnquiries;
    }

    public Boolean getEmailAlertsTestRides() {
        return emailAlertsTestRides;
    }

    public void setEmailAlertsTestRides(Boolean emailAlertsTestRides) {
        this.emailAlertsTestRides = emailAlertsTestRides;
    }

    public Boolean getAutoApprovalTestRides() {
        return autoApprovalTestRides;
    }

    public void setAutoApprovalTestRides(Boolean autoApprovalTestRides) {
        this.autoApprovalTestRides = autoApprovalTestRides;
    }
}
