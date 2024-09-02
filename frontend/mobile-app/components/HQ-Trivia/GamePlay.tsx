import React from 'react';
import { View } from 'react-native';
import ProgressBar from './ProgressBar'; // Adjust the import path as necessary
import Question from './Question';
import Options from './Options';
import NextButton from './NextButton';
import ScoreModal from './ScoreModal';

const GamePlay: React.FC = () => {
  return (
    <View>
      <ProgressBar />
      <Question />
      <Options />
      <NextButton />
      <ScoreModal />
    </View>
  );
};

export default GamePlay;
