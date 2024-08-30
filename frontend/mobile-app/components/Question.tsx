import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { COLORS } from "../constants";
import LottieView from "lottie-react-native";

const Question = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
}: {
  currentQuestion: any;
  currentIndex: any;
  totalQuestions: any;
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (currentQuestion?.question) {
      // Bắt đầu phát hoạt ảnh khi bắt đầu nói
      animationRef.current?.play();
      Speech.speak(currentQuestion?.question.replace("?", ""), {
        language: "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          // Dừng hoạt ảnh sau khi nói xong
          animationRef.current?.reset();
        },
      });
    }
  }, [currentQuestion]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/animations/MC.json")}
        style={styles.animation}
        loop={false} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.counterText}>{currentIndex + 1}</Text>
        <Text style={styles.totalQuestionsText}>/ {totalQuestions}</Text>
      </View>
      <Text style={styles.questionText}>{currentQuestion?.question}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 0,
  },
  animation: {
    width: 150,
    height: 150,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  counterText: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.6,
    marginRight: 2,
  },
  totalQuestionsText: {
    color: COLORS.white,
    fontSize: 18,
    opacity: 0.6,
  },
  questionText: {
    color: COLORS.white,
    fontSize: 30,
  },
});

export default Question;
