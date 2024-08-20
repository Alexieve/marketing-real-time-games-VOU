/* eslint-disable react/prop-types */
import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CSpinner } from "@coreui/react";
import "./scss/style.scss";
import { request } from "./hooks/useRequest";
import { useDispatch } from "react-redux";
import { authActions } from "./stores/authSlice";

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const Event = React.lazy(() => import("./views/pages/event_management/Event"));
const EventCreateEdit = React.lazy(
  () => import("./views/pages/event_management/Event_create_edit"),
);
const VoucherEdit = React.lazy(
  () => import("./views/pages/voucher_management/Voucher_edit"),
);
const VoucherCreate = React.lazy(
  () => import("./views/pages/voucher_management/Voucher_create"),
);
const Voucher = React.lazy(
  () => import("./views/pages/voucher_management/Voucher"),
);
const UserManagement = React.lazy(
  () => import("./views/pages/user_management/UserManagement"),
);

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await request("/api/users/currentuser");
        dispatch(authActions.setIsAuthenticated(true));
      } catch (error) {
        dispatch(authActions.setIsAuthenticated(false));
      }
      // dispatch(authActions.setIsAuthenticated(true));
    };

    checkAuth();
  }, []);

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/events"
            name="Event Management Page"
            element={
              // <ProtectedRoute>
              <Event />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            name="Event Create Page"
            element={
              // <ProtectedRoute>
              <EventCreateEdit />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/usermanagement"
            element={
              <ProtectedRoute><UserManagement /></ProtectedRoute>
            }
          />
          <Route
            path="/events/edit/:eventId"
            name="Event Create Page"
            element={
              // <ProtectedRoute>
              <EventCreateEdit />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/voucher/create"
            element={
              // <ProtectedRoute>
              <VoucherCreate />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/voucher"
            element={
              // <ProtectedRoute>
              <Voucher />
              // </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/voucher/edit/:id"
            name="Voucher edit Page"
            element={<VoucherEdit />}
          />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
