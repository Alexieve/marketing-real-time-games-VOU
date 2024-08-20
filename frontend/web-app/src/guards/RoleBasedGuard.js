/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { CAlert, CContainer } from "@coreui/react";

const RoleBasedGuard = ({ children, accessibleRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!accessibleRoles.includes(user.role)) {
    return (
      <CContainer
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <CAlert color="danger">
          <h4>Permission Denied</h4>
          You do not have permission to access this page.
        </CAlert>
      </CContainer>
    );
  }

  return <>{children}</>;
};

export default RoleBasedGuard;
