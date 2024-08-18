import React, { useState, useEffect } from 'react';
import { CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CForm, CFormInput, CButton, CFormSwitch } from '@coreui/react';
// import './EditUserModal.scss';  
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilPhone } from '@coreui/icons';
import { request } from '../../../hooks/useRequest';
import { notification } from 'antd'; // Assuming you're using Ant Design for notifications
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const EditUserModal = ({ isVisible, onCancel, currentUser, form }) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [isActive, setIsActive] = useState(currentUser?.status ? true : false);

  useEffect(() => {
    setName(currentUser?.name || '');
    setIsActive(currentUser?.status ? true : false);
  }, [currentUser]);

  const handleSwitchChange = (e) => {
    setIsActive(e.target.checked);
  };

  const handleFormSubmit = async () => {
    const updatedUser = {
      id: currentUser?.id,
      name,
      status: isActive, 
    };

    try {
      const result = await request('api/usermanagement/update', 'post', updatedUser);
      toast.success("Update information successful. Reload after 2 second...");
      onCancel();
      setTimeout(() => {
        window.location.reload();
      }, 2000);  // Delay một chút để đảm bảo toast hiện ra trước khi reload
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
        <h5>{'Edit Information'}</h5>
      </CModalHeader>
      <CModalBody>
        <CForm form={form} onFinish={handleFormSubmit} layout="vertical" id="user-form">
          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon1"><CIcon icon={cilUser} /></CInputGroupText>
            <CFormInput 
              placeholder="Username" 
              aria-label="Username" 
              aria-describedby="basic-addon1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon-email"><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
            <CFormInput 
              placeholder="Email" 
              aria-label="Email" 
              aria-describedby="basic-addon-email"
              type="email"
              value={currentUser?.email || ''}
              readOnly
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon-phone"><CIcon icon={cilPhone} /></CInputGroupText>
            <CFormInput 
              type="tel" 
              placeholder="Phone Number" 
              aria-label="Phone Number" 
              aria-describedby="basic-addon-phone"
              value={currentUser?.phonenum || ''}
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
        <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
        <CButton color="primary" onClick={handleFormSubmit}>
          {'Update'}
        </CButton>
      </CModalFooter>
    </CModal>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
    </>
  );
};

export default EditUserModal;
