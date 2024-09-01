import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { quizActions } from '../../slices/quizSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Options = () => {
  const dispatch = useDispatch();
  const {
    questions,
    currentQuestionIndex,
    currentOptionSelected,
    correctOption,
    isOptionsDisabled,
  } = useSelector((state: any) => state.quiz);

  const validateAnswer = (selectedOption: string) => {
    dispatch(quizActions.selectOption(selectedOption));
  };

  return (
    <View>
      {questions[currentQuestionIndex]?.options.map((option: string) => (
        <TouchableOpacity
          key={option}
          onPress={() => validateAnswer(option)}
          disabled={isOptionsDisabled}
          style={[
            styles.option,
            {
              borderColor:
                option === correctOption
                  ? COLORS.success
                  : option === currentOptionSelected
                  ? COLORS.error
                  : COLORS.secondary + '40',
              backgroundColor:
                option === correctOption
                  ? COLORS.success + '20'
                  : option === currentOptionSelected
                  ? COLORS.error + '20'
                  : COLORS.secondary + '20',
            },
          ]}
        >
          <Text style={styles.optionText}>{option}</Text>
          {option === correctOption ? (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="check" style={styles.icon} />
            </View>
          ) : option === currentOptionSelected ? (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="close" style={styles.icon} />
            </View>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    borderWidth: 3,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  optionText: {
    fontSize: 20,
    color: COLORS.white,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: COLORS.white,
    fontSize: 20,
  },
});

export default Options;
