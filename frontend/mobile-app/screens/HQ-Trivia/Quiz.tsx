import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  ScrollView,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import * as Speech from "expo-speech"; // Import expo-speech
import data from "../../data/QuizData";
import ProgressBar from "../../components/ProgressBar";
import Question from "../../components/Question";
import Options from "../../components/Options";
import NextButton from "../../components/NextButton";
import ScoreModal from "../../components/ScoreModal";

const Quiz = () => {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState<
    null | string
  >(null);
  const [correctOption, setCorrectOption] = useState<null | string>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));

  const validateAnswer = (selectedOption: any) => {
    let correct_option = allQuestions[currentQuestionIndex]["correct_option"];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionsDisabled(true);

    if (selectedOption == correct_option) {
      setScore(score + 1);
      Speech.speak("Congratulations. You are correct.");
    } else {
      Speech.speak(`Oh no, you are wrong. The answer is ${correct_option}`);
    }

    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex == allQuestions.length - 1) {
      setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      setShowNextButton(false);
    }
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const restartQuiz = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionsDisabled(false);
    setShowNextButton(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.container}>
          <ProgressBar
            progress={progress}
            totalQuestions={allQuestions.length}
          />
          <Question
            currentQuestion={allQuestions[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            totalQuestions={allQuestions.length}
          />
          <Options
            options={allQuestions[currentQuestionIndex]?.options}
            validateAnswer={validateAnswer}
            correctOption={correctOption || ""}
            currentOptionSelected={currentOptionSelected ?? ""}
            isOptionsDisabled={isOptionsDisabled}
          />
          <NextButton showNextButton={showNextButton} handleNext={handleNext} />
          <ScoreModal
            showScoreModal={showScoreModal}
            score={score}
            totalQuestions={allQuestions.length}
            restartQuiz={restartQuiz}
          />
          <Image
            source={require("../../assets/images/DottedBG.png")}
            style={styles.backgroundImage}
            resizeMode={"contain"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
