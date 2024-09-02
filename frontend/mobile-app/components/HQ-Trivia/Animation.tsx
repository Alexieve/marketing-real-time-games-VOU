import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";


const Animation = () => {
  const animationRef = useRef<LottieView>(null);
  const { voiceText } = useSelector((state: any) => state.quiz);

  useEffect(() => {
    if (voiceText !== "") {
      // Start the animation when speech begins
      animationRef.current?.play();
      Speech.speak(voiceText, {
        onDone: () => {
          // Stop the animation after speech ends
          animationRef.current?.reset();
        },
      });
    }
  }, [voiceText]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../../assets/animations/MC.json")}
        style={styles.animation}
        loop={false} 
      />
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
});

export default Animation;
