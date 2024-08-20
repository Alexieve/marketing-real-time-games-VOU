import React from 'react'
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
  CWidgetStatsC,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilBraille, cilChartPie } from '@coreui/icons'
import './Report_Admin.scss' // Import SCSS
import { AppSidebar, AppFooter, AppHeader } from "../../../components/index";

const Report_Admin_User = () => {
  // Dữ liệu cho biểu đồ line
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Issued Vouchers',
        data: [30, 50, 70, 40, 60, 90, 85], // Dữ liệu cho biểu đồ
        fill: false,
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        tension: 0.1,
      },
      {
        label: 'Used Vouchers',
        data: [20, 40, 60, 30, 50, 80, 70], // Dữ liệu cho biểu đồ
        fill: false,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        tension: 0.1,
      },
    ],
  }

  return (
    <div>
    <AppSidebar />
    <div className="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div className="body flex-grow-1 m-4">  
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Report Page</CCardHeader>
          <CCardBody>
            <CNav variant="tabs" className="mb-3">
              <CNavItem>
                <CNavLink href="/report" >Brand</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="/report/users" active>User</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="/report/game">Game</CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CRow>
                <CCol sm={6} md={3}>
                  <CCard className="text-center mb-4 custom-card">
                    <CCardHeader>Total User</CCardHeader>
                    <CCardBody>
                      <h3>125</h3> {/* Số liệu thực tế */}
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={6} md={3}>
                  <CCard className="text-center mb-4 custom-card">
                    <CCardHeader>Total User Active</CCardHeader>
                    <CCardBody>
                      <h3>300</h3> {/* Số liệu thực tế */}
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={6} md={3}>
                  <CCard className="text-center mb-4 custom-card">
                    <CCardHeader>Total User Inactive</CCardHeader>
                    <CCardBody>
                      <h3>150</h3> {/* Số liệu thực tế */}
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={6} md={3}>
                  <CCard className="text-center mb-4 custom-card">
                    <CCardHeader>Average Daily Play Time</CCardHeader>
                    <CCardBody>
                      <h3>30</h3> {/* Số liệu thực tế */}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <CWidgetStatsC
                    className="mb-3 widget-stats-c"
                    icon={<CIcon icon={cilChartPie} height={36} />}
                    progress={{ color: 'success', value: 50 }}
                    text="Widget helper text"
                    title="Issued Rate"
                    value="50%"
                  />
                </CCol>
                <CCol xs={6}>
                  <CWidgetStatsC
                    className="mb-3 widget-stats-c"
                    icon={<CIcon icon={cilBraille} height={36} />}
                    color="success"
                    inverse
                    progress={{ value: 75 }}
                    text="Widget helper text"
                    title="Join Rate"
                    value="89.9%"
                  />
                </CCol>
              </CRow>
              <CTabPane id="tab2" visible>
                <CCard className="mb-4">
                  <CCardBody className="chart-container">
                    <CChartLine data={lineData} />
                  </CCardBody>
                </CCard>
              </CTabPane>
              {/* Thêm nội dung cho các tab khác */}
              <CTabPane id="tab2">
                {/* Nội dung cho tab User */}
              </CTabPane>
              <CTabPane id="tab3">
                {/* Nội dung cho tab Game */}
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
  )
}

export default Report_Admin_User
