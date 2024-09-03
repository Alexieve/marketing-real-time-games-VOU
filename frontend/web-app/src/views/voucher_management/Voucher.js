import React, { useEffect, useState } from 'react';
import { AppSidebar, AppFooter, AppHeader } from '../../components/index';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import moment from 'moment';
import {
    CCard,
    CCardBody,
    CPagination,
    CPaginationItem,
    CFormInput,
    CRow,
    CCol,
    CCardTitle,
    CCardText,
    CButton,
    CCardImage,
    CInputGroup,
    CInputGroupText,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CAlert
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react'
import { cilSearch, cilInfo } from '@coreui/icons';
import '../../scss/event/event.scss';

const Voucher = () => {
    const [voucherData, setVoucherData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [visible, setVisible] = useState(false); // For modal visibility
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchData = () => {
            axios.get(`/api/event_command/get_vouchers/${user.id}`)
                .then(response => {
                    setVoucherData(response.data);
                })
                .catch(error => {
                    if (error.response.data.errors.length > 0) {
                        for (let i = 0; i < error.response.data.errors.length; i++) {
                            toast.error(error.response.data.errors[i].message);
                        }
                    } else {
                        toast.error("An error occurred. Please try again later");
                    }
                });
        };
        fetchData();
    }, []);

    const handleDelete = (_id) => {
        axios.delete(`/api/event_command/voucher/delete/${_id}`)
            .then(response => {
                if (response.status === 200) {
                    // Remove the deleted voucher from the voucherData state
                    setVoucherData(voucherData.filter((voucher) => voucher._id !== _id));
                    console.log('Voucher deleted successfully');
                } else {
                    console.error('Failed to delete voucher');
                }
            })
            .catch(error => {
                if (error.response.data.errors.length > 0) {
                    for (let i = 0; i < error.response.data.errors.length; i++) {
                        toast.error(error.response.data.errors[i].message);
                    }
                } else {
                    toast.error("An error occurred. Please try again later");
                }
            });
    };

    const openDeleteConfirmation = (voucher) => {
        setSelectedVoucher(voucher);
        setVisible(true); // Show modal
    };

    const confirmDelete = () => {
        if (selectedVoucher) {
            handleDelete(selectedVoucher._id);
            setVisible(false); // Close modal
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredItems = voucherData.filter(voucher =>
        voucher.code && voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1 m-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <CInputGroup>
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput
                                type="text"
                                placeholder="Search vouchers"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </CInputGroup>
                        <Link to="/vouchers/create" className="btn btn-success text-white no-wrap mx-2">
                            Create Voucher
                        </Link>
                    </div>
                    {currentItems.length > 0 ? (
                        <CRow>
                            {currentItems.map((voucher) => (
                                <CCol md="4" key={voucher._id} className='mb-4'>
                                    <Link to={`/vouchers/edit/${voucher._id}`} className="card-link">
                                        <CCard className="shadow-sm card-hover">
                                            <div className="imageContainer">
                                                <CCardImage className="image" src={voucher.imageUrl} />
                                            </div>
                                            <CCardBody style={{ padding: '1rem' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                        {voucher.code}
                                                    </CCardTitle>
                                                </div>
                                                <CCardText style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                    <strong>Price:</strong> {voucher.price}
                                                </CCardText>
                                                <CCardText style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                    <strong>Quantity:</strong> {voucher.quantity}
                                                </CCardText>
                                                <CCardText style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                    <strong>Expiration Time:</strong> {moment(voucher.expTime).format("L") + ' ' + moment(voucher.expTime).format("LT")}
                                                </CCardText>
                                                <div className="d-flex justify-content-end">
                                                    <CButton color="danger" className="btn-sm" onClick={(e) => {
                                                        e.stopPropagation(); e.preventDefault(); openDeleteConfirmation(voucher);
                                                    }}>Delete</CButton>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </Link>
                                </CCol>
                            ))}
                        </CRow>
                    ) : (
                        <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CAlert color="primary" className="d-flex align-items-center">
                                <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} height={24} />
                                <div>No voucher found</div>
                            </CAlert>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CPagination>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <CPaginationItem key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </CPaginationItem>
                            ))}
                        </CPagination>
                    </div>
                </div>
                <AppFooter />
            </div>
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <h5>Confirm Deletion</h5>
                </CModalHeader>
                <CModalBody>
                    {selectedVoucher?.eventID ? 'This voucher is belonged to an event, are you sure you want to delete this voucher?' : 'Are you sure you want to delete this voucher?'}
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDelete}>Delete</CButton>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
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
        </div >
    );
};

export default Voucher;
