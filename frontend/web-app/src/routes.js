import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));

const UserManagement = React.lazy(
  () => import("./views/pages/user_management/UserManagement"),
);

const routes = [
  // { path: "/", exact: true, name: "Home" },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: Dashboard,
    protected: true,
  },
  { path: "/login", name: "Login", element: Login, protected: false },
  { path: "/register", name: "Register", element: Register, protected: false },
  {
    path: "/user-management",
    name: "User Management",
    element: UserManagement,
    protected: true,
  },
];

export default routes;
