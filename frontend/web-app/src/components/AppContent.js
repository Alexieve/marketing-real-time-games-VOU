import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";
import ProtectedRoute from "../components/ProtectedRoute";

const AppContent = () => {
  const renderRoutes = (routesArray) => {
    return routesArray.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={
          <ProtectedRoute publicRoute={!route.protected}>
            <route.element />
          </ProtectedRoute>
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {renderRoutes(routes)}
          <Route path="/" element={<Navigate to="user-management" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
