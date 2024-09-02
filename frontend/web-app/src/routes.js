import React from "react";
import GuestGuard from "./guards/GuestGuard";
import RoleBasedGuard from "./guards/RoleBasedGuard";

// Import các component cần thiết
const Login = React.lazy(() => import("./views/login/Login"));
const Register = React.lazy(() => import("./views/register/Register"));
const UserManagement = React.lazy(
  () => import("./views/user_management/UserManagement"),
);
const GameManagement = React.lazy(() => import("./views/game_management/game"));
const ReportAdmin = React.lazy(
  () => import("./views/report_admin/Report_Admin"),
);
const ReportBrand = React.lazy(
  () => import("./views/report_brand/Report_Brand"),
);
const Event = React.lazy(() => import("./views/event_management/Event"));
const EventCreateEdit = React.lazy(
  () => import("./views/event_management/Event_create_edit"),
);
const Voucher = React.lazy(() => import("./views//voucher_management/Voucher"));
const VoucherCreate = React.lazy(
  () => import("./views/voucher_management/Voucher_create"),
);
const VoucherEdit = React.lazy(
  () => import("./views/voucher_management/Voucher_edit"),
);
const Page404 = React.lazy(() => import("./views/page404/Page404"));
const Page500 = React.lazy(() => import("./views/page500/Page500"));

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
  {
    path: "/game",
    name: "Game Management",
    element: (
      <RoleBasedGuard accessibleRoles={["Admin"]}>
        <GameManagement />
      </RoleBasedGuard>
    ),
  },
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
    path: "/events",
    name: "Event",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <Event />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/events/create",
    name: "Create Event",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <EventCreateEdit />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/events/edit/:eventID",
    name: "Edit Event",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <EventCreateEdit />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/vouchers",
    name: "Voucher",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <Voucher />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/vouchers/create",
    name: "Create Voucher",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <VoucherCreate />
      </RoleBasedGuard>
    ),
  },
  {
    path: "/vouchers/edit/:id",
    name: "Edit Voucher",
    element: (
      <RoleBasedGuard accessibleRoles={["Brand"]}>
        <VoucherEdit />
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
  {
    path: "*",
    element: <Page404 />,
  },
];

export default routes;
