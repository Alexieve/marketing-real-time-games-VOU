import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { quizActions } from '../../slices/quizSlice';

const NextButton = () => {
  const dispatch = useDispatch();
  const showNextButton = useSelector((state: any) => state.quiz.showNextButton);

  const handleNext = () => {
    dispatch(quizActions.nextQuestion());
  };

  return showNextButton ? (
    <TouchableOpacity onPress={handleNext} style={styles.button}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    width: '100%',
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default NextButton;
