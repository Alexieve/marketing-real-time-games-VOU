import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsC,
} from "@coreui/react";
import { CChartBar, CChartPie } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilGamepad } from "@coreui/icons";

const GameStatistics = () => {
  return (
    <div>
      <CRow>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilGamepad} height={36} />}
            color="warning"
            text="Total Games"
            title="Games"
            value="15"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilGamepad} height={36} />}
            color="success"
            text="Active Games"
            title="Active Games"
            value="12"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilGamepad} height={36} />}
            color="danger"
            text="Inactive Games"
            title="Inactive Games"
            value="3"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Game Performance Over Time</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ["Game 1", "Game 2", "Game 3"],
                  datasets: [
                    {
                      label: "Players Participated",
                      backgroundColor: "#FF6384",
                      data: [200, 300, 400],
                    },
                    {
                      label: "Games Completed",
                      backgroundColor: "#36A2EB",
                      data: [180, 280, 350],
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
            <CCardHeader>Game Categories</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ["Quiz", "Puzzle", "Adventure", "Other"],
                  datasets: [
                    {
                      data: [5, 3, 4, 3],
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                      ],
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

export default GameStatistics;
