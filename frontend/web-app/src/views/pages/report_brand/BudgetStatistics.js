import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsC,
} from "@coreui/react";
import { CChartPie } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilMoney } from "@coreui/icons";

const BudgetStatistics = () => {
  return (
    <div>
      <CRow>
        <CCol sm={6} lg={6}>
          <CWidgetStatsC
            icon={<CIcon icon={cilMoney} height={36} />}
            color="info"
            text="Total Budget"
            title="Budget"
            value="$120,000"
          />
        </CCol>
        <CCol sm={6} lg={6}>
          <CWidgetStatsC
            icon={<CIcon icon={cilMoney} height={36} />}
            color="success"
            text="Total Spent"
            title="Spent"
            value="$90,000"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Budget Allocation</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ["Spent", "Remaining"],
                  datasets: [
                    {
                      data: [90000, 30000],
                      backgroundColor: ["#FF6384", "#36A2EB"],
                      hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default BudgetStatistics;
