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
import { cilBasket, cilPeople, cilChartPie } from "@coreui/icons";

const BrandStatistics = () => {
  return (
    <div>
      <CRow>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilBasket} height={36} />}
            color="info"
            text="Total Brands"
            title="Brands"
            value="120"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilPeople} height={36} />}
            color="success"
            text="Active Brands"
            title="Active Brands"
            value="90"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsC
            icon={<CIcon icon={cilChartPie} height={36} />}
            color="warning"
            text="Inactive Brands"
            title="Inactive Brands"
            value="30"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Brand Participation Over Time</CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: ["January", "February", "March", "April"],
                  datasets: [
                    {
                      label: "Active Brands",
                      backgroundColor: "rgba(75,192,192,0.2)",
                      borderColor: "rgba(75,192,192,1)",
                      data: [80, 85, 90, 95],
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
            <CCardHeader>Brand Categories</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: [
                    "Fashion",
                    "Technology",
                    "Food & Beverage",
                    "Others",
                  ],
                  datasets: [
                    {
                      data: [35, 25, 20, 40],
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

export default BrandStatistics;
