import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsC,
} from "@coreui/react";
import { CChartLine, CChartPie } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilPeople, cilUser } from "@coreui/icons";

const PlayerStatistics = () => {
  return (
    <div>
      <CRow>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilUser} height={36} />}
            color="info"
            text="Total Players"
            title="Players"
            value="4875"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilPeople} height={36} />}
            color="success"
            text="Active Players"
            title="Active Players"
            value="3500"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilUser} height={36} />}
            color="warning"
            text="Inactive Players"
            title="Inactive Players"
            value="1375"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Player Activity Over Time</CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: ["January", "February", "March", "April"],
                  datasets: [
                    {
                      label: "Active Players",
                      backgroundColor: "rgba(153, 102, 255, 0.2)",
                      borderColor: "rgba(153, 102, 255, 1)",
                      data: [3000, 3200, 3500, 3600],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Player Demographics</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ["Male", "Female", "Other"],
                  datasets: [
                    {
                      data: [2750, 2000, 125],
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default PlayerStatistics;
