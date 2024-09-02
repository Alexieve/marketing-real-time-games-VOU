import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { COLORS, SIZES } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchPlayTurn } from "../../thunks/shakeThunk";
import { shakeActions } from "../../slices/shakeSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import PlayLog from "../../components/Lac-xi/PlayLog";
import ExchangeLog from "../../components/Lac-xi/ExchangeLog";
import ChooseGift from "../../components/Lac-xi/ChooseGift";
import Header from "../../components/Lac-xi/Header";
import MyItems from "../../components/Lac-xi/MyItems";
import ShakeToOpenGift from "../../components/Lac-xi/ShakeToOpen";
import GiftTurnModal from "../../components/Lac-xi/GiftTurnModal";

const Shake = () => {
  const customerID = 1;
  const eventID = "66c5b48b5fa4db898b0974d2";
  
  const dispatch = useAppDispatch();
  const { screen, myItemsScreen } = useAppSelector((state: any) => state.shake);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const openModal = () => setGiftModalVisible(true);
  const closeModal = () => setGiftModalVisible(false);

  const startGame = async () => {
    const res = await dispatch(fetchPlayTurn({ customerID, eventID}));
    const playturn = unwrapResult(res);
    if (playturn > 0) { // Fix after checking the API
      dispatch(shakeActions.initializeQuiz());
    } else {
      showMessage({
        message: "Oh no!",
        description: "You don't have enough play turn.",
        type: "danger",
      });
    }
    
  };

  const renderGameHomePage = () => {
    return (
      <>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Icon
            name="play-circle"
            size={24}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Icon
            name="gift"
            size={24}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Gift Play Turn</Text>
        </TouchableOpacity>
        <GiftTurnModal customerID={customerID} eventID={eventID} visible={giftModalVisible} onClose={closeModal} onSubmit={() => {}} />
        <PlayLog customerID={customerID} eventID={eventID}/>
        <ExchangeLog customerID={customerID} eventID={eventID}/>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header customerID={customerID} eventID={eventID} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.container}>
          {myItemsScreen? <MyItems customerID={customerID} eventID={eventID} /> : (
            (screen === 0? renderGameHomePage():
            (screen === 1? <ChooseGift /> : 
            (screen === 2? <ShakeToOpenGift customerID={customerID} eventID={eventID} /> : null)))
          )}
          <Image
            source={require("../../assets/images/DottedBG.png")}
            style={styles.backgroundImage}
            resizeMode={"contain"}
          />
        </View>
      </ScrollView>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: "center",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  safeAreaView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    position: "relative",
  },
  backgroundImage: {
    width: SIZES.width,
    height: 130,
    zIndex: -1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
  },
});

export default Shake;
