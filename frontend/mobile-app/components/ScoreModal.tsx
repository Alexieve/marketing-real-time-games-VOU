import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const ScoreModal = ({
  showScoreModal,
  score,
  totalQuestions,
  restartQuiz,
}: {
  showScoreModal: boolean;
  score: number;
  totalQuestions: number;
  restartQuiz: () => void;
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={showScoreModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleText}>
            {score > totalQuestions / 2 ? "Congratulations!" : "Oops!"}
          </Text>

          <View style={styles.scoreContainer}>
            <Text
              style={[
                styles.scoreText,
                {
                  color:
                    score > totalQuestions / 2 ? COLORS.success : COLORS.error,
                },
              ]}
            >
              {score}
            </Text>
            <Text style={styles.totalText}> / {totalQuestions}</Text>
          </View>

          <TouchableOpacity onPress={restartQuiz} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 30,
  },
  totalText: {
    fontSize: 20,
    color: COLORS.black,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    padding: 20,
    width: "100%",
    borderRadius: 20,
  },
  retryButtonText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 20,
  },
});

export default ScoreModal;
