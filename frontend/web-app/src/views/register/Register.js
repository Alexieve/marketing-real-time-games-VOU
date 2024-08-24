import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../hooks/useRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cil3d,
  cilAddressBook,
  cilLockLocked,
  cilPhone,
  cilUser,
} from "@coreui/icons";
import { authActions } from "../../../stores/authSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errors = { ...formErrors };

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(value)) {
        delete errors.email;
      } else {
        errors.email = "Please provide a valid email address.";
      }
    }

    if (name === "password") {
      if (value.length >= 6 && value.length <= 20) {
        delete errors.password;
      } else {
        errors.password = "Password must be between 6 to 20 characters long.";
      }
    }

    setFormErrors(errors);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    if (formValues.password !== formValues.repeatPassword) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        repeatPassword: "Passwords must match.",
      }));
      return;
    }

    const { repeatPassword, ...errors } = formErrors;
    setFormErrors(errors);

    if (form.checkValidity()) {
      try {
        const user = await request(
          "api/auth/register/brand",
          "POST",
          formValues,
        );
        dispatch(authActions.login({ user }));
        // toast.success("Registration successful!");
        navigate("/");
      } catch (errors) {
        console.log(errors);
        if (errors.length > 0) {
          toast.error(errors[0].message);
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm noValidate onSubmit={handleRegister}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      floatingLabel="Brand name"
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Brand name"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cil3d} />
                    </CInputGroupText>
                    <CFormInput
                      floatingLabel="Field"
                      type="text"
                      id="field"
                      name="field"
                      placeholder="Field"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilAddressBook} />
                    </CInputGroupText>
                    <CFormInput
                      floatingLabel="Address"
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Address"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      floatingLabel="Email"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      feedback={formErrors.email}
                      required
                      invalid={formErrors.email}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      floatingLabel="Phone number"
                      type="tel"
                      id="phonenum"
                      name="phonenum"
                      placeholder="Phone number"
                      onChange={handleChange}
                      feedback={formErrors.phone}
                      required
                      invalid={formErrors.phone}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
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
                      onChange={handleChange}
                      feedback={formErrors.password}
                      required
                      invalid={formErrors.password}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      floatingLabel="Repeat password"
                      type="password"
                      id="repeatPassword"
                      name="repeatPassword"
                      placeholder="Repeat password"
                      minLength={6}
                      maxLength={20}
                      onChange={handleChange}
                      feedback={formErrors.repeatPassword}
                      required
                      invalid={formErrors.repeatPassword}
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton type="submit" color="primary">
                      Register
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
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
        transition:Bounce
      />
    </div>
  );
};

export default Register;
