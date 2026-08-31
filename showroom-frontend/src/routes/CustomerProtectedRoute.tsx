import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import customerAuthService from "../services/customerAuthService";

const CustomerProtectedRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = customerAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default CustomerProtectedRoute;
