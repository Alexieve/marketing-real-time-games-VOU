/* eslint-disable react/prop-types */
import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CSpinner } from "@coreui/react";
import "./scss/style.scss";
import { request } from "./hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./stores/authSlice";
import routes from "./routes";

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

// Guards
import AuthGuard from "./guards/AuthGuard";

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await request("/api/auth/currentuser");
        dispatch(
          authActions.initialize({
            isAuthenticated: true,
            user: user.currentUser,
          }),
        );
      } catch (error) {
        console.log("Error during auth check:", error); // Đảm bảo rằng lỗi được log ra nếu có
        dispatch(
          authActions.initialize({ isAuthenticated: false, user: null }),
        );
      }
    };

    checkAuth();
  }, [dispatch]);

  if (!isInitialized) {
    // console.log("Waiting for initialization..."); // Kiểm tra xem isInitialized đã được cập nhật chưa
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          {user?.role === "Admin" && (
            <>
              <Route
                path="/"
                element={<Navigate to="/user-management" replace />}
              />
              <Route
                path="/report"
                element={<Navigate to="/report/admin" replace />}
              />
            </>
          )}
          {user?.role === "Brand" && (
            <>
              <Route path="/" element={<Navigate to="/event" replace />} />
              <Route
                path="/report"
                element={<Navigate to="/report/brand" replace />}
              />
            </>
          )}
          <Route
            path="*"
            element={
              <AuthGuard>
                <DefaultLayout />
              </AuthGuard>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
