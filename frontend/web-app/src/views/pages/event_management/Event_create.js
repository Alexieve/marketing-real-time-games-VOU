/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { AppSidebar, AppFooter, AppHeader } from "../../../components/index";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../scss/event/event.scss";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CCardImage,
  CCardTitle,
  CCardText,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
  CFormTextarea,
  CToast,
  CToastHeader,
  CAlert,
  CToastBody,
  CToaster,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilInfo } from "@coreui/icons";

const EventCreate = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;

  const [eventData, setEventData] = useState({
    name: "",
    imageUrl: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedGamesModal, setSelectedGamesModal] = useState([]);
  const [games, setGames] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [selectedVouchersModal, setSelectedVouchersModal] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [toast, addToast] = useState(0);
  const toaster = useRef();
  const [imagePreview, setImagePreview] = useState(null);

  const brand = "Tech Store";

  const params = {
    id: "1",
    name: "Tech Store",
  };
  useEffect(() => {
    if (localStorage.getItem("formSubmittedSuccess") === "true") {
      addToast(successToast);
      localStorage.removeItem("formSubmittedSuccess"); // Corrected the key name
    }

    if (id !== "-1") {
      axios
        .get(`http://localhost:8000/events/${id}`)
        .then((response) => {
          const {
            name,
            imageUrl,
            description,
            startTime,
            endTime,
            games,
            vouchers,
          } = response.data;
          setEventData({ name, imageUrl, description, startTime, endTime });
          setImagePreview(imageUrl);
          setSelectedGames(games);
          setSelectedVouchers(vouchers);
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
        });
      // const { name, imageUrl, startTime, endTime, games, vouchers } = state;
      // setEventData({ name, imageUrl, startTime, endTime });
      // setImagePreview(imageUrl);
      // setSelectedGames(games);
      // setSelectedVouchers(vouchers);
    }

    axios
      .get("http://localhost:8000/games")
      .then((response) => setGames(response.data))
      .catch((error) => console.error("Error fetching games data:", error));

    axios
      .get(`http://localhost:8000/vouchers`)
      .then((response) => {
        setVouchers(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching vouchers data:", error));
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
      <CToastBody>
        Event {id == -1 ? "created" : "edited"} successfully!
      </CToastBody>
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
    setEventData((prevData) => ({
      ...prevData,
      imageUrl: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGameSelect = (game) => {
    setSelectedGamesModal((prevSelectedGames) => {
      if (
        prevSelectedGames.some((selectedGame) => selectedGame.id === game.id)
      ) {
        return prevSelectedGames.filter((g) => g.id !== game.id);
      } else {
        return [...prevSelectedGames, game];
      }
    });
    console.log(selectedGames);
  };

  const handleGameSave = () => {
    setSelectedGames(selectedGamesModal);
    setSelectedGamesModal([]);
    setShowGameModal(false);
  };

  const handleGameDelete = (index) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames.splice(index, 1);
    setSelectedGames(newSelectedGames);
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVouchersModal((prevSelectedVouchers) => {
      if (
        prevSelectedVouchers.some(
          (selectedVoucher) => selectedVoucher.id === voucher.id,
        )
      ) {
        return prevSelectedVouchers.filter((v) => v !== voucher);
      } else {
        return [...prevSelectedVouchers, voucher];
      }
    });
  };

  const handleVoucherSave = () => {
    setSelectedVouchers(selectedVouchersModal);
    setSelectedVouchersModal([]);
    setShowVoucherModal(false);
  };

  const handleVoucherDelete = (index) => {
    const newSelectedVouchers = [...selectedVouchers];
    newSelectedVouchers.splice(index, 1);
    setSelectedVouchers(newSelectedVouchers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, imageUrl, description, startTime, endTime } = eventData;
    if (
      !name ||
      !imageUrl ||
      !startTime ||
      !description ||
      !endTime ||
      selectedGames.length === 0 ||
      selectedVouchers.length === 0
    ) {
      addToast(warningToast({ message: "Please fill in all fields" }));
      return;
    }
    if (endTime < startTime) {
      addToast(warningToast({ message: "End time must be after start time" }));
      return;
    }

    // Convert image file to base64 string
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
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
      const base64Image = isBase64Image(imageUrl)
        ? imageUrl
        : await toBase64(imageUrl);

      const payload = {
        name,
        imageUrl: base64Image,
        description,
        startTime,
        endTime,
        games: selectedGames,
        vouchers: selectedVouchers,
      };

      let response;
      if (id == "-1") {
        response = await axios.post("http://localhost:8000/events", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await axios.put(
          `http://localhost:8000/events/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      console.log(
        `Event ${id == -1 ? "created" : "edited"} successfully:`,
        response.data,
      );
      localStorage.setItem("formSubmittedSuccess", "true");
      window.location.reload();
    } catch (error) {
      addToast(ErrorToast({ message: error.message }));
    }
  };

  const [searchGameTerm, setGameSearchTerm] = React.useState("");

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchGameTerm.toLowerCase()),
  );

  const [searchVoucherTerm, setVoucherSearchTerm] = React.useState("");

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchVoucherTerm.toLowerCase()),
  );

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CRow className="justify-content-center mb-4">
            <CCol md="6">
              <CCard className="shadow-lg">
                <CCardHeader className="bg-primary text-white">
                  Event information
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText id="basic-addon1">
                        Event Name
                      </CInputGroupText>
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
                      <CInputGroupText id="basic-addon1">
                        Description
                      </CInputGroupText>
                      <CFormTextarea
                        id="description"
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText id="basic-addon1">
                        Event Image
                      </CInputGroupText>
                      <CFormInput
                        type="file"
                        id="imageUrl"
                        name="imageUrl"
                        onChange={handleFileChange}
                        required={id === "-1"}
                      />
                    </CInputGroup>
                    {imagePreview && (
                      <CCardImage
                        className="card-image mb-3"
                        orientation="top"
                        src={imagePreview}
                      />
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText id="basic-addon1">
                        Event Start Time
                      </CInputGroupText>
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
                      <CInputGroupText id="basic-addon1">
                        Event End Time
                      </CInputGroupText>
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
                      <CCardHeader
                        className="text-white d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: "#4A90E2" }}
                      >
                        <h6 className="mb-0">Select Games for Event</h6>
                        <CButton
                          className="button-custom"
                          style={{ textDecoration: "underline" }}
                          onClick={() => {
                            setSelectedGamesModal(selectedGames);
                            setShowGameModal(true);
                          }}
                        >
                          Add
                        </CButton>
                      </CCardHeader>
                      <CCardBody>
                        <CListGroup className="p-0">
                          {selectedGames.map((game, index) => (
                            <CListGroupItem
                              key={index}
                              className="d-flex justify-content-between align-items-center"
                            >
                              {game.name}
                              <CButton
                                color="danger"
                                size="sm"
                                className="ml-2"
                                onClick={() => handleGameDelete(index)}
                              >
                                Delete
                              </CButton>
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                    <CCard className="shadow-lg mt-4">
                      <CCardHeader
                        className="text-white d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: "#4A90E2" }}
                      >
                        <h6 className="mb-0">Select Vouchers for Event</h6>
                        <CButton
                          className="button-custom"
                          style={{ textDecoration: "underline" }}
                          onClick={() => {
                            setSelectedVouchersModal(selectedVouchers);
                            setShowVoucherModal(true);
                          }}
                        >
                          Add
                        </CButton>
                      </CCardHeader>
                      <CCardBody>
                        <CListGroup className="p-0">
                          {selectedVouchers.map((voucher, index) => (
                            <CListGroupItem
                              key={index}
                              className="d-flex justify-content-between align-items-center"
                            >
                              {voucher.code}
                              <CButton
                                color="danger"
                                size="sm"
                                className="ml-2"
                                onClick={() => handleVoucherDelete(index)}
                              >
                                Delete
                              </CButton>
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                    <CButton
                      type="submit"
                      style={{ backgroundColor: "#7ED321" }}
                      className="w-100 mt-4"
                    >
                      {id !== "-1" ? "Edit Event" : "Create Event"}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <AppFooter />
      </div>

      {/* Toasts */}
      <CToaster
        className="p-3"
        placement="top-end"
        push={toast}
        ref={toaster}
      />
      {/* Modal Game Selection */}
      <CModal
        size="xl"
        alignment="center"
        visible={showGameModal}
        onClose={() => setShowGameModal(false)}
      >
        <CModalHeader>
          <h5 id="game-modal-title">Select Games</h5>
        </CModalHeader>
        <CModalBody
          style={{
            height: "70vh",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
          }}
          id="game-modal-description"
        >
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
                <CCol md="4" key={game.id || index} className="mb-4">
                  <CCard
                    style={{
                      width: "250pt",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <CCardImage
                      className="card-image"
                      orientation="top"
                      src={game.imageUrl}
                      style={{
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <CCardBody style={{ padding: "1rem" }}>
                      <CCardTitle
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {game.name}
                      </CCardTitle>
                      <CCardText
                        style={{ fontSize: "1rem", marginBottom: "0.25rem" }}
                      >
                        Type: {game.type}
                      </CCardText>
                      <CCardText
                        className="truncate"
                        style={{
                          fontSize: "0.875rem",
                          color: "#6c757d",
                          marginBottom: "1rem",
                        }}
                      >
                        Guide: {game.guide}
                      </CCardText>
                      <div className="d-flex justify-content-end">
                        <CFormCheck
                          className="mb-3"
                          type="checkbox"
                          checked={selectedGamesModal.some(
                            (selectedGame) => selectedGame.id === game.id,
                          )}
                          onChange={() => handleGameSelect(game)}
                          button={{ color: "success", variant: "outline" }}
                          id={`btn-check-outlined-${game.id || index}`} // Ensure unique ID
                          autoComplete="off"
                          label="Use"
                          style={{ marginRight: "0.5rem" }}
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CAlert color="primary" className="d-flex align-items-center">
                <CIcon
                  icon={cilInfo}
                  className="flex-shrink-0 me-2"
                  width={24}
                  height={24}
                />
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
      <CModal
        size="xl"
        alignment="center"
        visible={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
      >
        <CModalHeader>
          <h5 id="game-modal-title">Select Voucher</h5>
        </CModalHeader>
        <CModalBody
          style={{
            height: "70vh",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
          }}
          id="voucher-modal-description"
        >
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
                <CCol md="4" key={voucher.id || index} className="mb-4">
                  <CCard
                    style={{
                      width: "250pt",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <CCardImage
                      className="card-image"
                      orientation="top"
                      src={voucher.imageUrl}
                      style={{
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <CCardBody style={{ padding: "1rem" }}>
                      <CCardTitle
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {voucher.code}
                      </CCardTitle>
                      <CCardText
                        style={{ fontSize: "1rem", marginBottom: "0.25rem" }}
                      >
                        Price: {voucher.price}
                      </CCardText>
                      <CCardText
                        style={{ fontSize: "1rem", marginBottom: "0.25rem" }}
                      >
                        Description: {voucher.description}
                      </CCardText>
                      <CCardText
                        style={{ fontSize: "1rem", marginBottom: "0.25rem" }}
                      >
                        Quantity: {voucher.quantity}
                      </CCardText>
                      <CCardText
                        style={{ fontSize: "1rem", marginBottom: "1rem" }}
                      >
                        Expired Time: {voucher.expTime}
                      </CCardText>
                      <div className="d-flex justify-content-end">
                        <CFormCheck
                          className="mb-3"
                          type="checkbox"
                          checked={selectedVouchersModal.some(
                            (selectedVoucher) =>
                              selectedVoucher.id === voucher.id,
                          )}
                          onChange={() => handleVoucherSelect(voucher)}
                          button={{ color: "success", variant: "outline" }}
                          id={`btn-check-outlined-${voucher.id || index}`} // Ensure unique ID
                          autoComplete="off"
                          label="Use"
                          style={{ marginRight: "0.5rem" }}
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CAlert color="primary" className="d-flex align-items-center">
                <CIcon
                  icon={cilInfo}
                  className="flex-shrink-0 me-2"
                  width={24}
                  height={24}
                />
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
    </div>
  );
};

export default EventCreate;
