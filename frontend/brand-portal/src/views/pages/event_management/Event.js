import React, { useEffect, useState } from 'react';
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    CInputGroup,
    CInputGroupText,
    CCardImage,
    CBadge,
    CAlert,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react'
import {
    cilSearch,
    cilInfo
} from '@coreui/icons';
import '../../../scss/event/event.scss';
import CustomDateRangePicker from './CustomDateRangePicker';

const Event = () => {
    const [eventData, setEventData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState({ startTime: '', endTime: '' });

    useEffect(() => {
        const fetchData = () => {
            axios.get('http://localhost:8000/events')
                .then(response => {
                    setEventData(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching event data:', error);
                });
        };
        fetchData();
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/events/${id}`)
            .then(response => {
                if (response.status === 200) {
                    // Remove the deleted event from the eventData state
                    setEventData(eventData.filter((event) => event.id !== id));
                    console.log('Event deleted successfully');
                } else {
                    console.error('Failed to delete event');
                }
            })
            .catch(error => {
                console.error('Error deleting event:', error);
            });
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

    const filteredItems = eventData.filter(event => {
        const matchesSearchQuery = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateRange = ((event.startTime >= dateRange.startTime || dateRange.startTime == '') && (event.endTime <= dateRange.endTime || dateRange.endTime == ''));
        return matchesSearchQuery && matchesDateRange;
    });

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1 m-4">
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                            type="text"
                            placeholder="Search events"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="flex-grow-1">
                            <CustomDateRangePicker onDateRangeChange={handleDateRangeChange} />
                        </div>
                        <Link to={`/event/create/${-1}`} className="btn btn-success text-white">
                            Create Event
                        </Link>
                    </div>
                    {currentItems.length > 0 ? (
                        <CRow>
                            {currentItems.map((event) => (
                                <CCol md="4" key={event.id} className='mb-4'>
                                    <Link to={`/event/create/${event.id}`} className="card-link">
                                        <CCard className="shadow-sm card-hover">
                                            <CCardImage className="card-image" orientation="top" src={event.imageUrl} />
                                            <CCardBody style={{ padding: '1rem' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{event.name}</CCardTitle>
                                                </div>
                                                <CCardText style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                    Start time: {formatDateTime(event.startTime)}
                                                </CCardText>
                                                <CCardText style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                    End time: {formatDateTime(event.endTime)}
                                                </CCardText>
                                                <div className='d-flex justify-content-end'>
                                                    <CButton color="danger" className="btn-sm" onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDelete(event.id); }}>Delete</CButton>
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
                                <div>No event found</div>
                            </CAlert>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CPagination>
                            <CPaginationItem disabled={currentPage === 1} onClick={handlePreviousPage}>
                                Previous
                            </CPaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <CPaginationItem key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </CPaginationItem>
                            ))}
                            <CPaginationItem disabled={currentPage === totalPages} onClick={handleNextPage}>
                                Next
                            </CPaginationItem>
                        </CPagination>
                    </div>
                </div>
                <AppFooter />
            </div>
        </div >
    );
};

export default Event;