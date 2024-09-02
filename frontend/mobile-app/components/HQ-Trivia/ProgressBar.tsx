import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { useSelector } from 'react-redux';

const ProgressBar = () => {
  const progress = useSelector((state: any) => state.quiz.progress);
  const totalQuestions = useSelector((state: any) => state.quiz.questions.length);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressAnim = animatedProgress.interpolate({
    inputRange: [0, totalQuestions],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, { width: progressAnim }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    borderRadius: 20,
    backgroundColor: '#00000020',
  },
  progressBar: {
    height: 20,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
  },
});

export default ProgressBar;
