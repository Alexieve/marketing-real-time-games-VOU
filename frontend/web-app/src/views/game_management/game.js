import React, { useState, useEffect } from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CButton,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react";
import { AppSidebar, AppFooter, AppHeader } from "../../components/index";
import { request } from "../../hooks/useRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await request(`api/game/game-config/:gameID`, "GET");
        setGames(data);
        setSelectedGame(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedGame({
      ...selectedGame,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGameChange = (e) => {
    const gameId = e.target.value;
    const game = games.find((g) => g.gameID == gameId);
    setSelectedGame(game);
  };

  const handleUpdateGame = async () => {
    try {
      console.log(selectedGame);
      await request("api/game/game-config", "PUT", selectedGame);
      const data = await request(`api/game/game-config/:gameID`, "GET");
      setGames(data);
      toast.success("Registration successful!");
    } catch (error) {
      console.error(error);
      toast.error(errors[0].message);
    }
  };

  if (!selectedGame)
    return (
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1 m-4">
            <CRow>
              <CCol xs={12}>
                <CCard>
                  <CCardHeader>Manage Game Information</CCardHeader>
                  <CCardBody>Loading...</CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>
          <AppFooter />
        </div>
      </div>
    );

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 m-4">
          <CRow>
            <CCol xs={12}>
              <CCard>
                <CCardHeader>Manage Game Information</CCardHeader>
                <CCardBody>
                  <CForm>
                    <CFormLabel htmlFor="gameSelect">Select Game</CFormLabel>
                    <CFormSelect
                      id="gameSelect"
                      value={selectedGame.gameID}
                      onChange={handleGameChange}
                    >
                      {games.map((game, index) => (
                        <option key={game.gameID || index} value={game.gameID}>
                          {game.name}
                        </option>
                      ))}
                    </CFormSelect>

                    <CRow className="mt-4">
                      <CCol md={6}>
                        <CFormLabel htmlFor="gameName">Game Name</CFormLabel>
                        <CFormInput
                          id="gameName"
                          name="name"
                          value={selectedGame.name}
                          onChange={handleInputChange}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel htmlFor="gameType">Game Type</CFormLabel>
                        <CFormInput
                          id="gameType"
                          name="type"
                          value={selectedGame.type}
                          onChange={handleInputChange}
                        />
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel>&nbsp;</CFormLabel>
                        <CFormCheck
                          id="isExchange"
                          name="isExchange"
                          label="Allow Item Trading"
                          checked={selectedGame.isExchange}
                          onChange={handleInputChange}
                          className="mt-2"
                        />
                      </CCol>
                    </CRow>

                    {/* <CRow className="mt-4">
                      <CCol md={6}>
                        <CFormLabel>&nbsp;</CFormLabel>
                        <CFormCheck
                          id="allowItemTrade"
                          name="allowItemTrade"
                          label="Allow Item Trading"
                          checked={selectedGame.allowItemTrade}
                          onChange={handleInputChange}
                          className="mt-2"
                        />
                      </CCol>
                    </CRow> */}

                    <CRow className="mt-4">
                      <CCol md={12}>
                        <CFormLabel htmlFor="gameGuide">Game Guide</CFormLabel>
                        <CFormTextarea
                          id="gameGuide"
                          name="guide"
                          value={selectedGame.guide}
                          onChange={handleInputChange}
                          rows="5"
                        />
                      </CCol>
                    </CRow>

                    <CButton
                      color="primary"
                      className="mt-4"
                      onClick={handleUpdateGame}
                    >
                      Update Game Information
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
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
        <AppFooter />
      </div>
    </div>
  );
};

export default GameManagement;
