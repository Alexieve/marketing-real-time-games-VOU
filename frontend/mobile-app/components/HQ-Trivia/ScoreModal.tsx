import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { quizActions } from '../../slices/quizSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { addPlayLog, AddPointsDB } from '../../thunks/quizThunk';

const ScoreModal = () => {
  const dispatch = useAppDispatch();
  const { score, questions, point } = useAppSelector((state: any) => state.quiz);
  const showScoreModal = useAppSelector((state: any) => state.quiz.showScoreModal);

  const restartQuiz = () => {
    dispatch(quizActions.resetQuiz());
  };

  useEffect(() => {
    const customerID = 1;
    const eventID = '66c6f1c4c33e15ad0805fc98';
    const quantity = point + (10000 * score);
    const items = [{ itemID: 1, quantity}];
    dispatch(AddPointsDB({ customerID, eventID, items}));
    dispatch(quizActions.setPoint(quantity));
    dispatch(addPlayLog({ customerID, eventID }));
  }, [showScoreModal]);


  return (
    <Modal animationType="slide" transparent={true} visible={showScoreModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleText}>
            {score > questions.length / 2 ? 'Congratulations!' : 'Oops!'}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.totalText}> / {questions.length}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>You receive </Text>
            <Text style={styles.pointText}>{10000 * score} point!</Text>
          </View>
          <TouchableOpacity onPress={restartQuiz} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Done</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 30,
  },
  totalText: {
    fontSize: 20,
    color: COLORS.black,
  },
  pointText: {
    fontSize: 30,
    color: COLORS.secondary,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    padding: 20,
    width: '100%',
    borderRadius: 20,
  },
  retryButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 20,
  },
});

export default ScoreModal;
