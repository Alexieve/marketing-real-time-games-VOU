import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import { AppSidebar, AppFooter, AppHeader } from "../../components/index";

import BrandStatistics from "./BrandStatistics";
import PlayerStatistics from "./PlayerStatistics";
import GameStatistics from "./GameStatistics";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("brands");

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 m-4">
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Admin Report</CCardHeader>
                <CCardBody>
                  <CNav variant="tabs" className="mb-3">
                    <CNavItem>
                      <CNavLink
                        active={activeTab === "brands"}
                        onClick={() => setActiveTab("brands")}
                      >
                        Brands Statistics
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === "players"}
                        onClick={() => setActiveTab("players")}
                      >
                        Players Statistics
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === "games"}
                        onClick={() => setActiveTab("games")}
                      >
                        Games Statistics
                      </CNavLink>
                    </CNavItem>
                  </CNav>

                  <CTabContent>
                    <CTabPane visible={activeTab === "brands"}>
                      <BrandStatistics />
                    </CTabPane>

                    <CTabPane visible={activeTab === "players"}>
                      <PlayerStatistics />
                    </CTabPane>

                    <CTabPane visible={activeTab === "games"}>
                      <GameStatistics />
                    </CTabPane>
                  </CTabContent>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;
