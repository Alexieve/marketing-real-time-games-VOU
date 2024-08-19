/* eslint-disable react/prop-types */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CSpinner } from "@coreui/react";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) return <CSpinner color="primary" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default AuthGuard;
