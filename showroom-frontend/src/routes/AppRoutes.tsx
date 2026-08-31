import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/home/HomePage";
import Vehicles from "../pages/vehicles/VehiclesPage";
import VehicleDetails from "../pages/vehicle-details/VehicleDetailsPage";
import TestRide from "../pages/test-ride/TestRidePage";
import Enquiry from "../pages/enquiry/EnquiryPage";
import Contact from "../pages/contact/ContactPage";

import Offers from "../pages/offers/OffersPage";
import EnquiryPage from "../pages/enquiry/EnquiryPage";
import ServicePage from "../pages/service/ServicePage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminVehiclesPage from "../pages/admin/AdminVehiclesPage";
import AdminVehicleFormPage from "../pages/admin/AdminVehicleFormPage";
import AdminTestRidesPage from "../pages/admin/AdminTestRidesPage";
import AdminEnquiriesPage from "../pages/admin/AdminEnquiriesPage";
import AdminOffersPage from "../pages/admin/AdminOffersPage";
import AdminOfferFormPage from "../pages/admin/AdminOfferFormPage";
import AdminServiceBookingsPage from "../pages/admin/AdminServiceBookingsPage";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Vehicles */}
        <Route
          path="/vehicles"
          element={<Vehicles />}
        />

        {/* Vehicle Details */}
        <Route
          path="/vehicles/:id"
          element={<VehicleDetails />}
        />

        {/* Public Vehicle Service Booking & Tracking */}
        <Route
          path="/service"
          element={<ServicePage />}
        />

        {/* Test Ride */}
        <Route
          path="/test-ride"
          element={<TestRide />}
        />

        <Route
          path="/test-ride/:vehicleId"
          element={<TestRide />}
        />

        {/* Enquiry */}
        <Route
          path="/enquiry/:vehicleId"
          element={<Enquiry />}
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Offers */}
        <Route
          path="/offers"
          element={<Offers />}
        />

        <Route
          path="/enquiry"
          element={<EnquiryPage />}
        />
      </Route>


      {/* ================= ADMIN LOGIN ================= */}

      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />


      {/* ================= ADMIN PANEL ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>

        {/* Dashboard */}
        <Route
          path="/admin"
          element={<AdminDashboardPage />}
        />

        {/* Service Bookings */}
        <Route
          path="/admin/service-bookings"
          element={<AdminServiceBookingsPage />}
        />

        {/* Vehicles */}
        <Route
          path="/admin/vehicles"
          element={<AdminVehiclesPage />}
        />

        {/* Add Vehicle */}
        <Route
          path="/admin/vehicles/new"
          element={<AdminVehicleFormPage />}
        />

        {/* Edit Vehicle */}
        <Route
          path="/admin/vehicles/:id/edit"
          element={<AdminVehicleFormPage />}
        />

        {/* Test Rides */}
        <Route
          path="/admin/test-rides"
          element={<AdminTestRidesPage />}
        />

        {/* Enquiries */}
        <Route
          path="/admin/enquiries"
          element={<AdminEnquiriesPage />}
        />

        {/* Offers */}
        <Route
          path="/admin/offers"
          element={<AdminOffersPage />}
        />

        {/* Add Offer */}
        <Route
          path="/admin/offers/new"
          element={<AdminOfferFormPage />}
        />

        {/* Edit Offer */}
        <Route
          path="/admin/offers/:id/edit"
          element={<AdminOfferFormPage />}
        />

        {/* Settings */}
        <Route
          path="/admin/settings"
          element={<AdminSettingsPage />}
        />

        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;
