import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsC,
} from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilGift } from "@coreui/icons";

const VoucherStatistics = () => {
  return (
    <div>
      <CRow>
        <CCol sm={6} lg={6}>
          <CWidgetStatsC
            icon={<CIcon icon={cilGift} height={36} />}
            color="warning"
            text="Vouchers Issued"
            title="Issued"
            value="45,000"
          />
        </CCol>
        <CCol sm={6} lg={6}>
          <CWidgetStatsC
            icon={<CIcon icon={cilGift} height={36} />}
            color="success"
            text="Vouchers Used"
            title="Used"
            value="30,000"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Voucher Performance</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ["Campaign 1", "Campaign 2", "Campaign 3"],
                  datasets: [
                    {
                      label: "Vouchers Issued",
                      backgroundColor: "#36A2EB",
                      data: [12000, 15000, 18000],
                    },
                    {
                      label: "Vouchers Used",
                      backgroundColor: "#FF6384",
                      data: [10000, 13000, 16000],
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

export default VoucherStatistics;
