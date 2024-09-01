import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { useSelector } from 'react-redux';
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";


const Question = () => {
  const animationRef = useRef<LottieView>(null);
  const {
    questions,
    currentQuestionIndex,
  } = useSelector((state: any) => state.quiz);

  const currentQuestion = questions[currentQuestionIndex];

  // useEffect(() => {
  //   if (currentQuestion?.question) {
  //     // Start the animation when speech begins
  //     animationRef.current?.play();
  //     Speech.speak(currentQuestion?.question.replace("?", ""), {
  //       onDone: () => {
  //         // Stop the animation after speech ends
  //         animationRef.current?.reset();
  //       },
  //     });
  //   }
  // }, [currentQuestion]);

  return (
    <View style={styles.container}>
      {/* <LottieView
        ref={animationRef}
        source={require("../../assets/animations/MC.json")}
        style={styles.animation}
        loop={false} 
      /> */}
      <View style={styles.textContainer}>
        <Text style={styles.counter}>{currentQuestionIndex + 1}</Text>
        <Text style={styles.total}>/ {questions.length}</Text>
      </View>
      <Text style={styles.question}>{currentQuestion?.question}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 0,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  animation: {
    width: 150,
    height: 150,
  },
  counter: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.6,
    marginRight: 2,
  },
  total: {
    color: COLORS.white,
    fontSize: 18,
    opacity: 0.6,
  },
  question: {
    color: COLORS.white,
    fontSize: 30,
  },
});

export default Question;
