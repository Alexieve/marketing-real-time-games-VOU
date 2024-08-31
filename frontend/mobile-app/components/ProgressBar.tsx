import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const ProgressBar = ({
  progress,
  totalQuestions,
}: {
  progress: any;
  totalQuestions: any;
}) => {
  const progressAnim = progress.interpolate({
    inputRange: [0, totalQuestions],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.progressBar, { width: progressAnim }]}
      ></Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 20,
    borderRadius: 20,
    backgroundColor: "#00000020",
  },
  progressBar: {
    height: 20,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
  },
});

export default ProgressBar;
