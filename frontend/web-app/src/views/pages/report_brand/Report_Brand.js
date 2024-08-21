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
import { AppSidebar, AppFooter, AppHeader } from "../../../components/index";

import BudgetStatistics from "./BudgetStatistics";
import VoucherStatistics from "./VoucherStatistics";

const BrandReport = () => {
  const [activeTab, setActiveTab] = useState("budget");

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 m-4">
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Brand Report</CCardHeader>
                <CCardBody>
                  <CNav variant="tabs" className="mb-3">
                    <CNavItem>
                      <CNavLink
                        active={activeTab === "budget"}
                        onClick={() => setActiveTab("budget")}
                      >
                        Budget Statistics
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === "voucher"}
                        onClick={() => setActiveTab("voucher")}
                      >
                        Voucher Statistics
                      </CNavLink>
                    </CNavItem>
                  </CNav>

                  <CTabContent>
                    <CTabPane visible={activeTab === "budget"}>
                      <BudgetStatistics />
                    </CTabPane>

                    <CTabPane visible={activeTab === "voucher"}>
                      <VoucherStatistics />
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

export default BrandReport;
