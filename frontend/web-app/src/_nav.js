import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilAlbum,
  cilChart,
  cilGamepad,
  cilGift,
  cilSpeedometer,
  cilUser,
} from "@coreui/icons";
import { CNavItem } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      // text: "NEW",
    },
  },
  // {
  //   component: CNavTitle,
  //   name: "Theme",
  // },
  {
    component: CNavItem,
    name: "User Management",
    to: "/user-management",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Events",
    to: "/event",
    icon: <CIcon icon={cilAlbum} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Vouchers",
    to: "/voucher",
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Games",
    to: "/game",
    icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Reprts",
    to: "/report",
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
];

export default _nav;
