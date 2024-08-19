import React, { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import routes from "../routes";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";

const AppContent = () => {
  const renderRoutes = (routesArray) => {
    return routesArray.map((route) => {
      const RouteGuard = route.protected ? AuthGuard : GuestGuard;

      return {
        path: route.path,
        element: <RouteGuard>{route.element}</RouteGuard>,
        children: route.children ? renderRoutes(route.children) : null,
      };
    });
  };

  const routing = useRoutes([
    ...renderRoutes(routes),
    { path: "/", element: <Navigate to="/user-management" replace /> },
  ]);

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>{routing}</Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
