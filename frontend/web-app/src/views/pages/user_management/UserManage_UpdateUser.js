/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CFormInput,
  CButton,
  CFormSwitch,
} from "@coreui/react";
// import './EditUserModal.scss';
import CIcon from "@coreui/icons-react";
import { cilUser, cilEnvelopeClosed, cilPhone } from "@coreui/icons";
import { request } from "../../../hooks/useRequest";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditUserModal = ({
  isVisible,
  onCancel,
  currentUser,
  form,
  setSelectedRole,
  setSearchTerm,
}) => {
  const [name, setName] = useState(currentUser?.name || "");
  const [isActive, setIsActive] = useState(currentUser?.status ? true : false);
  const navigate = useNavigate();

  useEffect(() => {
    setName(currentUser?.name || "");
    setIsActive(currentUser?.status ? true : false);
  }, [currentUser]);

  const handleSwitchChange = (e) => {
    setIsActive(e.target.checked);
  };

  const handleFormSubmit = async () => {
    const updatedUser = {
      name,
      status: isActive,
    };

    try {
      await request(
        `api/user-management/update/${currentUser.id}`,
        "post",
        updatedUser,
      );
      toast.success("Update information successful. Reload after 2 second...");
      onCancel();
      setTimeout(() => {
        setSearchTerm("");
        setSelectedRole(currentUser.role);
        // navigate("/user-management");
      }, 2000); // Delay một chút để đảm bảo toast hiện ra trước khi reload
    } catch (errors) {
      console.log(errors);
      if (errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  };

  return (
    <>
      <CModal
        visible={isVisible}
        onClose={onCancel}
        backdrop="static"
        className="user-management-modal"
      >
        <CModalHeader>
          <h5>{"Edit Information"}</h5>
        </CModalHeader>
        <CModalBody>
          <CForm form={form} layout="vertical" id="user-form">
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormInput
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon-email">
                <CIcon icon={cilEnvelopeClosed} />
              </CInputGroupText>
              <CFormInput
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon-email"
                type="email"
                value={currentUser?.email || ""}
                readOnly
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon-phone">
                <CIcon icon={cilPhone} />
              </CInputGroupText>
              <CFormInput
                type="tel"
                placeholder="Phone Number"
                aria-label="Phone Number"
                aria-describedby="basic-addon-phone"
                value={currentUser?.phonenum || ""}
                readOnly
              />
            </CInputGroup>
            <CFormSwitch
              id="isActive"
              label="Active"
              checked={isActive}
              onChange={handleSwitchChange}
              className="form-item mb-3 switch-large"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCancel}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleFormSubmit}>
            {"Update"}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        transition:Slide
      /> */}
    </>
  );
};

export default EditUserModal;
