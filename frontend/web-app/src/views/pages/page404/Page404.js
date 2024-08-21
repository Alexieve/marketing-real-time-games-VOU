import React from "react";
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass } from "@coreui/icons";
import { AppSidebar, AppHeader, AppFooter } from "../../../components";

const Page404 = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 m-4">
          <div className="bg-body-tertiary min-vh-50 d-flex flex-row align-items-center">
            <CContainer>
              <CRow className="justify-content-center">
                <CCol md={6}>
                  <div className="clearfix">
                    <h1 className="float-start display-3 me-4">404</h1>
                    <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
                    <p className="text-body-secondary float-start">
                      The page you are looking for was not found.
                    </p>
                  </div>
                  <CInputGroup className="input-prepend">
                    <CInputGroupText>
                      <CIcon icon={cilMagnifyingGlass} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="What are you looking for?"
                    />
                    <CButton color="info">Search</CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default Page404;
