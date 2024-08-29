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

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await request("api/events_query/get_games", "GET");
        setGames(data);
        setSelectedGame(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setSelectedGame({
        ...selectedGame,
        imageUrl: URL.createObjectURL(files[0]),
      });
    } else {
      setSelectedGame({
        ...selectedGame,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleGameChange = (e) => {
    const gameId = e.target.value;
    const game = games.find((g) => g._id === gameId);
    setSelectedGame(game);
  };

  const handleUpdateGame = async () => {
    try {
      // await request("api/game/update", "POST", selectedGame);
      const updatedGames = games.map((game) =>
        game._id === selectedGame._id ? selectedGame : game,
      );
      console.log("Updated Games", updatedGames);
      setGames(updatedGames);
    } catch (error) {
      console.error(error);
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
                      value={selectedGame._id}
                      onChange={handleGameChange}
                    >
                      {games.map((game) => (
                        <option key={game._id} value={game._id}>
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
                      <CCol md={6}>
                        <CFormLabel htmlFor="gameType">Game Type</CFormLabel>
                        <CFormInput
                          id="gameType"
                          name="type"
                          value={selectedGame.type}
                          onChange={handleInputChange}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mt-4">
                      <CCol md={6}>
                        <CFormLabel htmlFor="gameImageUrl">
                          Game Image
                        </CFormLabel>
                        <CFormInput
                          type="file"
                          id="gameImageUrl"
                          name="imageUrl"
                          onChange={handleInputChange}
                        />
                        {selectedGame.imageUrl && (
                          <img
                            src={selectedGame.imageUrl}
                            alt="Selected Game"
                            style={{
                              marginTop: "10px",
                              width: "100%",
                              height: "auto",
                            }}
                          />
                        )}
                      </CCol>
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
                    </CRow>

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
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default GameManagement;
