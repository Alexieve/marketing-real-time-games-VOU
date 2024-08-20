import React from "react";
import GuestGuard from "./guards/GuestGuard";
import RoleBasedGuard from "./guards/RoleBasedGuard";

// Import các component cần thiết
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const UserManagement = React.lazy(
  () => import("./views/pages/user_management/UserManagement"),
);
const ReportAdmin = React.lazy(
  () => import("./views/pages/report_admin/Report_Admin"),
);
const ReportBrand = React.lazy(
  () => import("./views/pages/report_brand/Report_Brand"),
);
const Event = React.lazy(() => import("./views/pages/event_management/Event"));
const EventCreate = React.lazy(
  () => import("./views/pages/event_management/Event_create"),
);
const Voucher = React.lazy(
  () => import("./views/pages/voucher_management/Voucher"),
);
const VoucherCreate = React.lazy(
  () => import("./views/pages/voucher_management/Voucher_create"),
);
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const routes = [
  {
    path: "/login",
    name: "Login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "/register",
    name: "Register",
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
  },
  {
    path: "/user-management",
    name: "User Management",
    element: (
      <RoleBasedGuard accessibleRoles={["Admin"]}>
        <UserManagement />
      </RoleBasedGuard>
    ),
  },
  // Bổ sung Game ở đây
  {
    path: "/report/admin",
    name: "Admin Report",
    element: (
      <RoleBasedGuard accessibleRoles={["Admin"]}>
        <ReportAdmin />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/report/brand",
    name: "Brand Report",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <ReportBrand />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/event",
    name: "Event",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <Event />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/event/create/:id",
    name: "Create Event",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <EventCreate />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/voucher",
    name: "Voucher",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <Voucher />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/voucher/create/:id",
    name: "Create Voucher",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <VoucherCreate />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/404",
    name: "Page 404",
    element: <Page404 />,
  },
  {
    path: "/500",
    name: "Page 500",
    element: <Page500 />,
  },
];

export default routes;
