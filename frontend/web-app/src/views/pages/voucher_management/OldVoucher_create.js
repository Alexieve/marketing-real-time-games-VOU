import React, { useState, useEffect, useRef } from 'react';
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index';
import { useParams, useLocation } from 'react-router-dom';
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
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CInputGroup,
    CInputGroupText
} from '@coreui/react';

const EventCreate = () => {

    const { id } = useParams();
    const location = useLocation();
    const { state } = location;
    const [voucherData, setVoucherData] = useState({
        code: "",
        qrCodeUrl: "",
        imageUrl: "",
        price: "",
        description: "",
        quantity: 0,
        expTime: "",
        status: "active",
        brand: ""
    });

    const [toast, addToast] = useState(0);
    const toaster = useRef();
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('formSubmittedSuccess') === 'true') {
            addToast(successToast);
            localStorage.removeItem('formSubmittedSuccess');
        }
        if (id !== "-1") {
            axios.get(`http://localhost:8000/vouchers/${id}`)
                .then(response => {
                    setVoucherData(response.data);
                    setImagePreview(response.data.imageUrl);
                })
                .catch(error => {
                    console.error('Error fetching event data:', error);
                });
        }
        else {
            setVoucherData(
                {
                    code: "",
                    qrCodeUrl: "",
                    imageUrl: "",
                    price: "",
                    description: "",
                    quantity: 0,
                    expTime: "",
                    status: "active",
                    brand: state ? state.name : ""
                }
            );
        }
    }, []);

    const warningToast = ({ message }) => (
        <CToast>
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill="#ffcc00"></rect>
                </svg>
                <div className="fw-bold me-auto">Warning</div>
                <small>Just now</small>
            </CToastHeader>
            <CToastBody>{message}.</CToastBody>
        </CToast>
    );

    const successToast = (
        <CToast>
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill="#28a745"></rect>
                </svg>
                <div className="fw-bold me-auto">Success</div>
                <small>Just now</small>
            </CToastHeader>
            <CToastBody>Voucher {(id == -1) ? 'created' : 'edited'} successfully!</CToastBody>
        </CToast>
    );

    const ErrorToast = ({ message }) => (
        <CToast>
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill="#dc3545"></rect>
                </svg>
                <div className="fw-bold me-auto">Error</div>
                <small>Just now</small>
            </CToastHeader>
            <CToastBody>{message}</CToastBody>
        </CToast>
    );

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
            addToast(warningToast({ message: 'Please fill in all fields' }));
            return;
        }
        if (quantity < 0) {
            addToast(warningToast({ message: 'Quantity must be a positive number' }));
            return;
        }
        if (price < 0) {
            addToast(warningToast({ message: 'Price must be a positive number' }));
            return;
        }
        if (new Date(expTime) < new Date()) {
            addToast(warningToast({ message: 'Expiration time must be in the future' }));
            return;
        }
        // Convert image file to base64 string
        const toBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

        const isBase64Image = (url) => {
            const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
            return base64Pattern.test(url);
        };

        try {

            const base64Image = isBase64Image(imageUrl) ? imageUrl : await toBase64(imageUrl);

            const payload = {
                code,
                qrCodeUrl,
                imageUrl: base64Image,
                price,
                description,
                quantity,
                expTime,
                status,
                brand
            };

            let response;
            if (id == "-1") {
                response = await axios.post('http://localhost:8000/vouchers', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            else {
                response = await axios.put(`http://localhost:8000/vouchers/${id}`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            console.log(`Voucher ${(id == -1) ? 'created' : 'edited'} successfully:`, response.data);
            localStorage.setItem('formSubmittedSuccess', 'true');
            window.location.reload();

        } catch (error) {
            addToast(ErrorToast({ message: error.message }));
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
                                <CCardHeader className="bg-primary text-white">Voucher information</CCardHeader>
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
                                                required={id === "-1"}
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
                                                readOnly
                                            />
                                        </CInputGroup>
                                        <CButton type="submit" color="primary" className="w-100 mt-4">{id !== "-1" ? 'Edit Voucher' : 'Create Voucher'}</CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
                <AppFooter />
            </div>

            {/* Toasts */}
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>
    );
};

export default EventCreate;