import React, { useState, useEffect, useRef } from 'react';
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../scss/event/event.scss';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
    CCard, CCardBody, CCardHeader, CForm, CFormInput, CCardImage, CCardTitle,
    CCardText, CFormCheck, CButton, CRow, CCol, CFormTextarea, CAlert, CModal,
    CModalHeader, CModalBody, CModalFooter, CInputGroup, CInputGroupText
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react'
import {
    cilSearch,
    cilInfo
} from '@coreui/icons';

const EventCreate = () => {

    const { eventId } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [eventData, setEventData] = useState({
        name: "",
        imageUrl: "",
        description: "",
        startTime: "",
        endTime: "",
        brand: user ? user.id : ""
    });
    const [selectedGames, setSelectedGames] = useState([]);
    const [selectedGamesModal, setSelectedGamesModal] = useState([]);
    const [games, setGames] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const [selectedVouchersModal, setSelectedVouchersModal] = useState([]);
    const [showGameModal, setShowGameModal] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (eventId !== undefined) {
                    const response = await axios.get(`/api/event_command/event_detail/${eventId}`);
                    const { event, vouchers } = response.data;
                    const { name, imageUrl, description } = event;
                    let { startTime, endTime } = event;
                    startTime = moment(startTime).format("YYYY-MM-DDTkk:mm");
                    endTime = moment(endTime).format("YYYY-MM-DDTkk:mm");
                    setEventData({ name, imageUrl, description, startTime, endTime, brand: user ? user.id : "" });
                    setImagePreview(imageUrl);
                    setSelectedVouchers(vouchers);

                    // Fetch all games and set selected games
                    await axios.get('/api/event_query/get_games')
                        .then(response => {
                            setGames(response.data)
                            setSelectedGames(response.data.filter(game => event.gamesId.includes(game._id)));
                        })
                        .catch(error => console.error('Error fetching games data:', error));

                    const image = await fetch(imageUrl);
                    const blob = await image.blob();
                    const file = new File([blob], imageUrl.split('/').pop(), { type: blob.type });
                    setEventData((prevData) => ({
                        ...prevData,
                        imageUrl: file
                    }));
                }
            } catch (error) {
                if (error.response.data.errors.length > 0) {
                    for (let i = 0; i < error.response.data.errors.length; i++) {
                        toast.error(error.response.data.errors[i].message);
                    }
                } else {
                    toast.error("An error occurred. Please try again later");
                }
            }
        }
        fetchData();
    }, [eventId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEventData((prevData) => ({
            ...prevData,
            imageUrl: file
        }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleVoucherSelectClicked = async () => {
        await axios.get(`/api/event_command/get_vouchers/${user.id}`)
            .then(response => { setVouchers(response.data); })
            .catch(error => console.error('Error fetching vouchers data:', error));
        setSelectedVouchersModal(selectedVouchers);
        setShowVoucherModal(true);
    }

    const handleGameSelectClicked = async () => {
        await axios.get('/api/event_query/get_games')
            .then(response => setGames(response.data))
            .catch(error => console.error('Error fetching games data:', error));
        setSelectedGamesModal(selectedGames);
        setShowGameModal(true);
    }

    const [searchGameTerm, setGameSearchTerm] = React.useState('');

    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(searchGameTerm.toLowerCase())
    );

    const [searchVoucherTerm, setVoucherSearchTerm] = React.useState('');

    const filteredVouchers = vouchers.filter(voucher =>
        voucher.code.toLowerCase().includes(searchVoucherTerm.toLowerCase())
    );

    const handleGameSelect = (game) => {
        setSelectedGamesModal((prevSelectedGames) => {
            if (prevSelectedGames.some(selectedGame => selectedGame._id == game._id)) {
                return prevSelectedGames.filter((g) => g._id !== game._id);
            } else {
                return [...prevSelectedGames, game];
            }
        });
    };

    const handleVoucherSelect = (voucher) => {
        setSelectedVouchersModal((prevSelectedVouchers) => {
            if (prevSelectedVouchers.some(selectedVoucher => selectedVoucher._id == voucher._id)) {
                return prevSelectedVouchers.filter((v) => v._id !== voucher._id);
            } else {
                return [...prevSelectedVouchers, voucher];
            }
        });
    };

    const handleGameSave = () => {
        setSelectedGames(selectedGamesModal);
        setSelectedGamesModal([]);
        setShowGameModal(false);
    };

    const handleVoucherSave = () => {
        setSelectedVouchers(selectedVouchersModal);
        setSelectedVouchersModal([]);
        setShowVoucherModal(false);
    };

    const handleGameDelete = (index) => {
        const newSelectedGames = [...selectedGames];
        newSelectedGames.splice(index, 1);
        setSelectedGames(newSelectedGames);
    };

    const handleVoucherDelete = (index) => {
        const newSelectedVouchers = [...selectedVouchers];
        newSelectedVouchers.splice(index, 1);
        setSelectedVouchers(newSelectedVouchers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, imageUrl, description, startTime, endTime, brand } = eventData;
        if (!name || !imageUrl || !startTime || !description || !endTime || selectedGames.length === 0 || selectedVouchers.length === 0) {
            toast.warning('Please fill in all fields');
            return;
        }
        if (endTime < startTime) {
            toast.warning('End time must be greater than start time');
            return
        }

        try {
            // Create new FormData object
            const formData = new FormData();
            formData.append('name', name);
            formData.append('imageUrl', imageUrl);
            formData.append('description', description);
            formData.append('startTime', startTime);
            formData.append('endTime', endTime);
            formData.append('brand', brand);
            formData.append('games', JSON.stringify(selectedGames.map(game => game._id)));
            formData.append('vouchers', JSON.stringify(selectedVouchers.map(voucher => voucher._id)));

            const response = (eventId == undefined) ?
                await axios.post('/api/event_command/event/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }) :
                await axios.put(`/api/event_command/event/edit/${eventId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

            const newState = {
                name,
                imageUrl: response.data.imageUrl,
                description,
                startTime,
                endTime,
                games: selectedGames,
                vouchers: selectedVouchers
            };

            navigate(`/events/edit/${response.data._id}`, {
                replace: true,
                state: { item: newState }
            })
            window.scrollTo(0, 0);
            toast.success('Event saved successfully');

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
                                <CCardHeader className="bg-primary text-white">Event information</CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit}>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Event Name</CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={eventData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Description</CInputGroupText>
                                            <CFormTextarea
                                                id="description"
                                                name="description"
                                                value={eventData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Event Image</CInputGroupText>
                                            <CFormInput
                                                type="file"
                                                id="imageUrl"
                                                name="imageUrl"
                                                onChange={handleFileChange}
                                                required={eventId === undefined}
                                            />
                                        </CInputGroup>
                                        {imagePreview && <CCardImage className="card-image mb-3" src={imagePreview} />}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Event Start Time</CInputGroupText>
                                            <CFormInput
                                                type="datetime-local"
                                                id="startTime"
                                                name="startTime"
                                                value={eventData.startTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="basic-addon1">Event End Time</CInputGroupText>
                                            <CFormInput
                                                type="datetime-local"
                                                id="endTime"
                                                name="endTime"
                                                value={eventData.endTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </CInputGroup>
                                        <CCard className="shadow-lg mt-4">
                                            <CCardHeader className="text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#4A90E2' }}>
                                                <h6 className="mb-0">Select Games for Event</h6>
                                                <CButton className="button-custom" style={{ textDecoration: 'underline' }} onClick={handleGameSelectClicked}>Add</CButton>
                                            </CCardHeader>
                                            <CCardBody>
                                                <CRow>
                                                    {selectedGames.map((game, index) => (
                                                        <CCol md="6" key={game._id || index} className='mb-2'>
                                                            <CCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                                                <CCardImage className="card-image" orientation="top" src={game.imageUrl} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
                                                                <CCardBody style={{ padding: '1rem' }}>
                                                                    <CCardTitle className="truncate" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{game.name}</CCardTitle>
                                                                    <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Type: {game.type}</CCardText>
                                                                    <CCardText className='truncate' style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>Guide: {game.guide}</CCardText>
                                                                    <div className='d-flex justify-content-end'>
                                                                        <CButton color="danger" size="sm" className="ml-2" onClick={() => handleGameDelete(index)}>Delete</CButton>
                                                                    </div>
                                                                </CCardBody>
                                                            </CCard>
                                                        </CCol>
                                                    ))}
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                        <CCard className="shadow-lg mt-4">
                                            <CCardHeader className="text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#4A90E2' }}>
                                                <h6 className="mb-0">Select Vouchers for Event</h6>
                                                <CButton className="button-custom" style={{ textDecoration: 'underline' }} onClick={handleVoucherSelectClicked}>Add</CButton>
                                            </CCardHeader>
                                            <CCardBody>
                                                <CRow>
                                                    {selectedVouchers.map((voucher, index) => (
                                                        <CCol md="6" key={voucher._id || index} className='mb-2'>
                                                            <CCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                                                <CCardImage className="card-image" orientation="top" src={voucher.imageUrl} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
                                                                <CCardBody style={{ padding: '1rem' }}>
                                                                    <CCardTitle className="truncate" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{voucher.code}</CCardTitle>
                                                                    <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Price: {voucher.price}</CCardText>
                                                                    <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Description: {voucher.description}</CCardText>
                                                                    <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Quantity: {voucher.quantity}</CCardText>
                                                                    <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '1rem' }}>Expired Time: {voucher.expTime}</CCardText>
                                                                    <div className='d-flex justify-content-end'>
                                                                        <CButton color="danger" size="sm" className="ml-2" onClick={() => handleVoucherDelete(index)}>Delete</CButton>
                                                                    </div>
                                                                </CCardBody>
                                                            </CCard>
                                                        </CCol>
                                                    ))}
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                        <CButton type="submit" style={{ backgroundColor: '#7ED321' }} className="w-100 mt-4">{eventId !== undefined ? 'Edit Event' : 'Create Event'}</CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
                <AppFooter />
            </div>

            {/* Modal Game Selection */}
            <CModal size="xl" alignment="center" visible={showGameModal} onClose={() => setShowGameModal(false)}>
                <CModalHeader>
                    <h5 id="game-modal-title">Select Games</h5>
                </CModalHeader>
                <CModalBody style={{ height: '70vh', overflowY: 'scroll', display: 'flex', flexDirection: 'column' }} id="game-modal-description">
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="Search games..."
                            value={searchGameTerm}
                            onChange={(e) => setGameSearchTerm(e.target.value)}
                        />
                    </CInputGroup>
                    {filteredGames.length > 0 ? (
                        <CRow>
                            {filteredGames.map((game, index) => (
                                <CCol md="4" key={game._id || index} className='mb-4'>
                                    <CCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                        <CCardImage className="card-image" orientation="top" src={game.imageUrl} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
                                        <CCardBody style={{ padding: '1rem' }}>
                                            <CCardTitle className='truncate' style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{game.name}</CCardTitle>
                                            <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Type: {game.type}</CCardText>
                                            <CCardText className='truncate' style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>Guide: {game.guide}</CCardText>
                                            <div className='d-flex justify-content-end'>
                                                <CFormCheck
                                                    className='mb-3'
                                                    type="checkbox"
                                                    checked={selectedGamesModal.some(selectedGame => selectedGame._id === game._id)}
                                                    onChange={() => handleGameSelect(game)}
                                                    button={{ color: 'success', variant: 'outline' }}
                                                    id={`btn-check-outlined-${game._id || index}`} // Ensure unique ID
                                                    autoComplete="off"
                                                    label="Use"
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                            </div>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            ))}
                        </CRow>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CAlert color="primary" className="d-flex align-items-center">
                                <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} height={24} />
                                <div>No game found</div>
                            </CAlert>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleGameSave}>
                        Save
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Voucher Selection */}
            <CModal size="xl" alignment="center" visible={showVoucherModal} onClose={() => setShowVoucherModal(false)}>
                <CModalHeader>
                    <h5 id="game-modal-title">Select Voucher</h5>
                </CModalHeader>
                <CModalBody style={{ height: '70vh', overflowY: 'scroll', display: 'flex', flexDirection: 'column' }} id="voucher-modal-description">
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="Search vouchers..."
                            value={searchVoucherTerm}
                            onChange={(e) => setVoucherSearchTerm(e.target.value)}
                        />
                    </CInputGroup>
                    {filteredVouchers.length > 0 ? (
                        <CRow>
                            {filteredVouchers.map((voucher, index) => (
                                <CCol md="4" key={voucher._id || index} className='mb-4'>
                                    <CCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                        <CCardImage className="card-image" orientation="top" src={voucher.imageUrl} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
                                        <CCardBody style={{ padding: '1rem' }}>
                                            <CCardTitle className='truncate' style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{voucher.code}</CCardTitle>
                                            <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Price: {voucher.price}</CCardText>
                                            <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Description: {voucher.description}</CCardText>
                                            <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Quantity: {voucher.quantity}</CCardText>
                                            <CCardText className='truncate' style={{ fontSize: '1rem', marginBottom: '1rem' }}>Expired Time: {moment(voucher.expTime).format("L") + ' ' + moment(voucher.expTime).format("LT")}</CCardText>
                                            <div className='d-flex justify-content-end'>
                                                <CFormCheck
                                                    className='mb-3'
                                                    type="checkbox"
                                                    checked={selectedVouchersModal.some(selectedVoucher => selectedVoucher._id === voucher._id)}
                                                    onChange={() => handleVoucherSelect(voucher)}
                                                    button={{ color: 'success', variant: 'outline' }}
                                                    id={`btn-check-outlined-${voucher._id || index}`} // Ensure unique ID
                                                    autoComplete="off"
                                                    label="Use"
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                            </div>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            ))}
                        </CRow>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CAlert color="primary" className="d-flex align-items-center">
                                <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} height={24} />
                                <div>No voucher found</div>
                            </CAlert>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleVoucherSave}>
                        Save
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
        </div >
    );
};

export default EventCreate;
