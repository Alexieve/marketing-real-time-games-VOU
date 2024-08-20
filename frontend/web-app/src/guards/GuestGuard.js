/* eslint-disable react/prop-types */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CSpinner } from "@coreui/react";

const GuestGuard = ({ children }) => {
  const { isInitialized, isAuthenticated } = useSelector((state) => state.auth);

  if (!isInitialized) return <CSpinner color="primary" />;

  if (isAuthenticated) return <Navigate to="/" />;

  return <>{children}</>;
};

export default GuestGuard;
