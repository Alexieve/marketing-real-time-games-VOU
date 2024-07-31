/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { request } from '../../../hooks/useRequest';
import 'react-toastify/dist/ReactToastify.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

const Login = () => {
  const [validated, setValidated] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // check if logged in, if so, redirect to home
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        await request('api/users/currentuser', 'get', null);
        navigate('/');
      } catch (error) {
        console.error(error);
      }
    }
    checkLoggedIn();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value} = e.target;
    let errors = { ...formErrors };

    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(value)) {
        delete errors.email;
      } else {
        errors.email = 'Please provide a valid email address.';
      }
    }

    if (name === 'password') {
      if (value.length >= 6 && value.length <= 20) {
        delete errors.password;
      } else {
        errors.password = 'Password must be between 6 to 20 characters long.';
      }
    }

    setFormErrors(errors);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());


    if (form.checkValidity()) {
      try {
        const data = await request('api/users/login', 'post', formValues);
        form.reset();
        setValidated(false);
        toast.success('Login successful!');
        navigate('/');
      } catch (errors) {
        if (errors.length > 0) {
          toast.error(errors[0].message);
        } else {
          toast.error('An error occurred. Please try again later');
        }
      }
    } else {
      setValidated(true);
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm noValidate validated={validated} onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        floatingLabel="Email"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                        feedback={formErrors.email}
                        invalid={formErrors.email}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        floatingLabel="Password"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        minLength={6}
                        maxLength={20}
                        required
                        onChange={handleChange}
                        feedback={formErrors.password}
                        invalid={formErrors.password}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Don't have an account?</p>
                    <p>Register now and get access to the best events!</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
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
        transition: Bounce
      />
    </div>
  )
}

export default Login
