import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilAlbum,
  cilChart,
  cilGamepad,
  cilGift,
  cilUser,
} from "@coreui/icons";
import { CNavItem } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "User Management",
    to: "/user-management",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    roles: ["Admin"], // Chỉ Admin có thể truy cập
  },
  {
    component: CNavItem,
    name: "Events",
    to: "/events",
    icon: <CIcon icon={cilAlbum} customClassName="nav-icon" />,
    roles: ["Brand"], // Chỉ Brand có thể truy cập
  },
  {
    component: CNavItem,
    name: "Vouchers",
    to: "/voucher",
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
    roles: ["Brand"], // Chỉ Brand có thể truy cập
  },
  {
    component: CNavItem,
    name: "Games",
    to: "/game",
    icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
    roles: ["Admin"], // Chỉ Admin có thể truy cập
  },
  {
    component: CNavItem,
    name: "Reports",
    to: "/report",
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    roles: ["Admin", "Brand"], // Cả Admin và Brand đều có thể truy cập
  },
];

export default _nav;
