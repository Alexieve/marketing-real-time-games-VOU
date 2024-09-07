import React from 'react';
import { View } from 'react-native';
import ProgressBar from './ProgressBar'; // Adjust the import path as necessary
import Question from './Question';
import Options from './Options';
import NextButton from './NextButton';
import ScoreModal from './ScoreModal';

type GamePlayProps = {
  eventID: string;
  customerID: number;
};

const GamePlay: React.FC<GamePlayProps> = ({eventID, customerID}) => {
  return (
    <View>
      <ProgressBar />
      <Question />
      <Options />
      <NextButton />
      <ScoreModal eventID={eventID} customerID={customerID} />
    </View>
  );
};

export default GamePlay;
