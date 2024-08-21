import React, { useEffect, useState } from 'react';
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
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
    CModalFooter
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';
import '../../../scss/event/event.scss';

const Voucher = () => {
    const [voucherData, setVoucherData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [visible, setVisible] = useState(false); // For modal visibility
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchData = () => {
            axios.get(`/api/events_query/get_vouchers/${user.name}`)
                .then(response => {
                    setVoucherData(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching voucher data:', error);
                });
        };
        fetchData();
    }, []);

    const handleDelete = (_id) => {
        axios.delete(`/api/vouchers/delete/${_id}`)
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
                console.error('Error deleting voucher:', error);
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

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-GB', options);
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
                <div className="body flex-grow-1 m-2">
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
                        <Link to="/voucher/create" className="btn btn-success text-white no-wrap mx-2">
                            Create Voucher
                        </Link>
                    </div>
                    <CRow className='m-0'>
                        {currentItems.map((voucher) => (
                            <CCol md="4" key={voucher._id} className='mb-4'>
                                <Link to={`/voucher/edit/${voucher._id}`} className="card-link">
                                    <CCard>
                                        <CCardImage className="card-image" orientation="top" src={voucher.imageUrl} />
                                        <CCardBody>
                                            <CCardTitle>{voucher.code}</CCardTitle>
                                            <CCardText>Price: {voucher.price}</CCardText>
                                            <CCardText>Quantity: {voucher.quantity}</CCardText>
                                            <CCardText>Expiration Time: {moment(voucher.expTime).format("L") + ' ' + moment(voucher.expTime).format("LT")}</CCardText>
                                            <CButton color="danger" onClick={(e) => { e.stopPropagation(); e.preventDefault(); openDeleteConfirmation(voucher); }}>Delete</CButton>
                                        </CCardBody>
                                    </CCard>
                                </Link>
                            </CCol>
                        ))}
                    </CRow>
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
                    Are you sure you want to delete this voucher?
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDelete}>Delete</CButton>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
                </CModalFooter>
            </CModal>
        </div >
    );
};

export default Voucher;
