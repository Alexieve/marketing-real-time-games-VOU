import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const NextButton = ({
  showNextButton,
  handleNext,
}: {
  showNextButton: boolean;
  handleNext: () => void;
}) => {
  return showNextButton ? (
    <TouchableOpacity onPress={handleNext} style={styles.button}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  button: {
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
  },
});

export default NextButton;
