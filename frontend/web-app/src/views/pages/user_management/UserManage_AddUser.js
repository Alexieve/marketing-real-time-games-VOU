import React, { useEffect, useState } from 'react'
import { CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CForm, CFormInput, CButton, CFormSwitch } from '@coreui/react'
import './AddUserModal.scss'  
import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeClosed, cilLockLocked, cilPhone } from '@coreui/icons'
import { request } from '../../../hooks/useRequest';
import { notification } from 'antd'; // Assuming you're using Ant Design for notifications

const AddUserModal = ({ isVisible, onCancel, form }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [status, setStatus] = useState(true);
  useEffect(() => {
    if (isVisible) {
      setName('');
      setEmail('');
      setEmailError('');
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPhone('');
      setPhoneError('');
      setStatus(true);
    }
  }, [isVisible]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setEmailError('Please provide a valid email address.');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePasswords(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePasswords(password, value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    // Kiểm tra số điện thoại hợp lệ
    if (value) {
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(value)) {
        setPhoneError('Phone number must be 10 digits long and include only numbers.');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    let error = '';
    
    if (password && (password.length < 6 || password.length > 20)) {
      error = 'Password must be between 6 and 20 characters.';
    } else if (password && confirmPassword && password !== confirmPassword) {
      error = 'Passwords do not match.';
    }

    setPasswordError(error);
  };

  const handleFormSubmit = async () => {
    // const updatedUser = {
    //   name,
    //   email,
    //   phone,
    //   password,
    //   role: 'Admin',
    //   status: isActive, 
    // };
     const updatedUser = {
      name: 'a',
      email: 'a@a.com',
      phone: '1111111111',
      password: '123456',
      role: 'Admin',
      status: true, 
    };
    if (!emailError && !passwordError && !phoneError) {
      try {
        await request('api/usermanagement/addadmin', 'post', updatedUser);
        notification.success({
          message: 'User create successfully',
        });
        onCancel(); // Đóng modal sau khi cập nhật thành công
      } catch (error) {
        notification.error({
          message: 'Error create user',
          description: error.message,
        });
      }
    }
    else
    {
      notification.error({
        message: 'Valid information create user',
        description: error.message,
      });
    }

  };

  return (
    <CModal
      visible={isVisible}
      onClose={onCancel}
      backdrop="static"
      className="user-management-modal"
    >
      <CModalHeader>
        <h5>{'Add Admin'}</h5>
      </CModalHeader>
      <CModalBody>
        <CForm form={form} onFinish={handleFormSubmit} layout="vertical" id="user-form">
          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon1"><CIcon icon={cilUser} /></CInputGroupText>
            <CFormInput
              name="username"
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
              name="email"
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </CInputGroup>
          {emailError && <div className="error-message">{emailError}</div>}

          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon-password"><CIcon icon={cilLockLocked} /></CInputGroupText>
            <CFormInput
              name="password"
              type="password"
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon-password"
              value={password}
              onChange={handlePasswordChange}
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon-confirm-password"><CIcon icon={cilLockLocked} /></CInputGroupText>
            <CFormInput
              name="confirm-password"
              type="password"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              aria-describedby="basic-addon-confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </CInputGroup>
          {passwordError && <div className="error-message">{passwordError}</div>}

          <CInputGroup className="mb-3">
            <CInputGroupText id="basic-addon-phone"><CIcon icon={cilPhone} /></CInputGroupText>
            <CFormInput 
              type="tel" 
              placeholder="Phone Number" 
              aria-label="Phone Number" 
              aria-describedby="basic-addon-phone"
              value={phone}
              onChange={handlePhoneChange}
            />
          </CInputGroup>
          {phoneError && <div className="error-message">{phoneError}</div>}

          <CFormSwitch
            id="isActive"
            label="Active"
            checked={status}
            name="active"
            onChange={(e) => setStatus(e.target.checked)}
            className="form-item mb-3"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
        <CButton color="primary" onClick={handleFormSubmit}>
          {'Add'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddUserModal;
