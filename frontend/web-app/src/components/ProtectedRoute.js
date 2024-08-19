/* eslint-disable react/prop-types */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, publicRoute = false }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated && publicRoute) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && !publicRoute) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
