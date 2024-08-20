import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { sidebarActions } from "../stores/sidebarSlice";
import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { logo } from "src/assets/brand/logo";
// import { sygnet } from "src/assets/brand/sygnet";

// sidebar nav config
import navigation from "../_nav";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebar.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);
  const user = useSelector((state) => state.auth.user);

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(user.role),
  );

  const visibleChangeHandler = (visible) => {
    dispatch(sidebarActions.setSidebarShow(visible));
  };

  const clostButtonHandler = () => {
    dispatch(sidebarActions.setSidebarShow(false));
  };

  const sidebarToggleHandler = () => {
    dispatch(sidebarActions.setSidebarUnfoldable(!unfoldable));
  };

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        visibleChangeHandler(visible);
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={clostButtonHandler} />
      </CSidebarHeader>
      <AppSidebarNav items={filteredNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={sidebarToggleHandler} />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
