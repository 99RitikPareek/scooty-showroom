import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import authService from "../services/authService";

const ProtectedRoute = () => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean>(
    authService.isAuthenticated()
  );

  useEffect(() => {
    // Re-verify authentication on every route location change
    setAuthenticated(authService.isAuthenticated());
  }, [location]);

  if (!authenticated || !authService.isAuthenticated()) {
    return (
      <Navigate
        to="/admin/login"
        state={{ message: "Please login to access the admin panel." }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
