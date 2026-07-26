import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const ProtectedRoute = () => {

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    api.get("accounts/me/")
      .then((res) => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;