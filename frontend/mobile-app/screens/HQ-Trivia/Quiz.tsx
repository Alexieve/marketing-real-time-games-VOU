import React, { useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { COLORS, SIZES } from "../../constants";
import { useSelector } from "react-redux";
import { quizActions } from "../../slices/quizSlice";
import Animation from "../../components/HQ-Trivia/Animation";
import data from "../../data/QuizData";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchPlayLog, fetchPoints, fetchExchangeLog, fetchPlayTurn } from "../../thunks/quizThunk";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import PlayLog from "../../components/HQ-Trivia/PlayLog"; // Import the new component
import ExchangeLog from "../../components/HQ-Trivia/ExchangeLog"; // Import the new component
import GamePlay from "../../components/HQ-Trivia/GamePlay";

const Quiz = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const customerID = useAppSelector((state: any) => state.auth.user.id);
  const eventID = (route.params as { eventID?: string })?.eventID ?? "";

  const { point, hasStarted, playlog, exchangeLog } = useSelector((state: any) => state.quiz);

  const goBack = () => {
    if (hasStarted) {
      dispatch(quizActions.resetQuiz());
    } else {
      navigation.goBack();
    }
  };

  const startQuiz = async () => {
    const res = await dispatch(fetchPlayTurn({ customerID, eventID}));
    const playturn = unwrapResult(res);
    console.log(playturn);
    if (playturn > 0) {
      dispatch(quizActions.initializeQuiz(data));
    } else {
      showMessage({
        message: "Oh no!",
        description: "You don't have enough play turn.",
        type: "danger",
      });
    }
    
  };

  const viewPlayLog = async () => {
    const res = await dispatch(
      fetchPlayLog({ customerID: 1, eventID: "66c6f1c4c33e15ad0805fc98" })
    );
    const play = unwrapResult(res);
    dispatch(quizActions.toggleShowPlayLog(play));
  };

  const viewExchangeLog = async () => {
    const res = await dispatch(
      fetchExchangeLog({ customerID: 1, eventID: "66c6f1c4c33e15ad0805fc98" })
    );
    const exchanges = unwrapResult(res);
    dispatch(quizActions.toggleShowExchangeLog(exchanges));
  }

  useEffect(() => {
    const customerID = 1;
    const eventID = "66c6f1c4c33e15ad0805fc98";
    dispatch(fetchPoints({ customerID, eventID }));
  }, [dispatch, point]);

  const renderGameHomePage = () => {
    return (
      <>
        <TouchableOpacity style={styles.button} onPress={startQuiz}>
          <Icon
            name="play-circle"
            size={24}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={viewPlayLog}>
          <Icon
            name="game-controller-outline"
            size={24}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>View Play Log</Text>
        </TouchableOpacity>
        {playlog?.length > 0 && <PlayLog />}
        <TouchableOpacity style={styles.button} onPress={viewExchangeLog}>
          <Icon
            name="sync-circle-outline"
            size={24}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>View Exchange Log</Text>
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/DottedBG.png")}
          style={styles.backgroundImage}
          resizeMode={"contain"}
        />
        {exchangeLog?.length > 0 && <ExchangeLog />}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar
        translucent
        backgroundColor={COLORS.primary}
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Point: {point}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.container}>
          <Animation />
          {!hasStarted ? renderGameHomePage() : <GamePlay />}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    backgroundColor: COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreContainer: {
    backgroundColor: COLORS.accent,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  scoreText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
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

export default Quiz;
