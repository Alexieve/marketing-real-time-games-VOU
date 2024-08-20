import React, { useState, useRef } from 'react';
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../scss/event/event.scss';
import axios from 'axios';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CCardImage,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CFormTextarea,
    CInputGroup,
    CInputGroupText
} from '@coreui/react';

const VoucherCreate = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const [voucherData, setVoucherData] = useState({
        code: "",
        qrCodeUrl: "",
        imageUrl: "",
        price: "",
        description: "",
        quantity: 0,
        expTime: "",
        status: "active",
        brand: state ? state.name : ""
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setVoucherData((prevData) => ({
            ...prevData,
            imageUrl: file
        }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucherData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { code, qrCodeUrl, imageUrl, price, description, quantity, expTime, status, brand } = voucherData;

        if (!code || !qrCodeUrl || !imageUrl || !price || !description || !quantity || !expTime || !status || !brand) {
            toast.warning("Please fill in all fields");
            return;
        }
        if (quantity < 0) {
            toast.warning("Quantity must be a positive number");
            return;
        }
        if (price < 0) {
            toast.warning("Price must be a positive number");
            return;
        }
        if (new Date(expTime) < new Date()) {
            toast.warning("Expiration time must be in the future");
            return;
        }

        try {
            // Create a new Formdata object
            const formData = new FormData();
            formData.append('code', code);
            formData.append('imageUrl', imageUrl);
            formData.append('qrCodeUrl', qrCodeUrl);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('quantity', quantity);
            formData.append('expTime', expTime);
            formData.append('status', status);
            formData.append('brand', brand);

            const response = await axios.post('/api/vouchers/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            window.scrollTo(0, 0);
            toast.success("Voucher created successfully");

        } catch (error) {
            if (error.response.data.errors.length > 0) {
                for (let i = 0; i < error.response.data.errors.length; i++) {
                    toast.error(error.response.data.errors[i].message);
                }
            } else {
                toast.error("An error occurred. Please try again later");
            }
        }
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1 px-3">
                    <CRow className="justify-content-center mb-4">
                        <CCol md="6">
                            <CCard className="shadow-lg">
                                <CCardHeader className="bg-primary text-white">Create New Voucher</CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit}>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Code</CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                id="code"
                                                name="code"
                                                value={voucherData.code}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">QR Code URL</CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                id="qrCodeUrl"
                                                name="qrCodeUrl"
                                                value={voucherData.qrCodeUrl}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Image URL</CInputGroupText>
                                            <CFormInput
                                                type="file"
                                                id="imageUrl"
                                                name="imageUrl"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </CInputGroup>
                                        {imagePreview && <CCardImage className="card-image mb-3" orientation="top" src={imagePreview} />}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Price</CInputGroupText>
                                            <CFormInput
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={voucherData.price}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Description</CInputGroupText>
                                            <CFormTextarea
                                                id="description"
                                                name="description"
                                                value={voucherData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Quantity</CInputGroupText>
                                            <CFormInput
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                value={voucherData.quantity}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Expiration Time</CInputGroupText>
                                            <CFormInput
                                                type="datetime-local"
                                                id="expTime"
                                                name="expTime"
                                                value={voucherData.expTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Status</CInputGroupText>
                                            <CFormSelect
                                                id="status"
                                                name="status"
                                                value={voucherData.status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </CFormSelect>
                                        </CInputGroup>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Brand</CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                id="brand"
                                                name="brand"
                                                value={voucherData.brand}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>
                                        <CButton type="submit" style={{ backgroundColor: '#7ED321' }} className="w-100 mt-4">Create Voucher</CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
                <AppFooter />
            </div>
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

export default VoucherCreate;
