import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddPointsDB } from "../thunks/quizThunk";
import { set } from "react-hook-form";

interface QuizState {
  hasStarted: boolean;
  voiceText: string;
  questions: any[];
  currentQuestionIndex: number;
  currentOptionSelected: string | null;
  correctOption: string | null;
  isOptionsDisabled: boolean;
  score: number;
  showNextButton: boolean;
  showScoreModal: boolean;
  progress: number;
  point: number;
  playlog: any[];
  exchangeLog: any[];
}

const initialState: QuizState = {
  hasStarted: false,
  voiceText: "Welcome to the quiz. Press the start button to play.",
  questions: [], // Questions will be set during initialization
  currentQuestionIndex: 0,
  currentOptionSelected: null,
  correctOption: null,
  isOptionsDisabled: false,
  score: 0,
  showNextButton: false,
  showScoreModal: false,
  progress: 0, // Use a number for progress
  point: 0,
  playlog: [],
  exchangeLog: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    initializeQuiz: (state, action: PayloadAction<any[]>) => {
      state.hasStarted = true;
      state.questions = action.payload;
      state.voiceText = state.questions[state.currentQuestionIndex].question;
      state.currentQuestionIndex = 0;
      state.currentOptionSelected = null;
      state.correctOption = null;
      state.isOptionsDisabled = false;
      state.score = 0;
      state.showNextButton = false;
      state.showScoreModal = false;
      state.progress = 0;
    },
    toggleShowPlayLog: (state, action: PayloadAction<any[]>) => {
      if (state.playlog.length > 0) {
        state.playlog = [];
      } else {
        state.playlog = action.payload;
      }
    },
    toggleShowExchangeLog: (state, action: PayloadAction<any[]>) => {
      if (state.exchangeLog.length > 0) {
        state.exchangeLog = [];
      } else {
        state.exchangeLog = action.payload;
      }
    },
    setPoint(state, action: PayloadAction<number>) {
      state.point = action.payload;
    },
    selectOption: (state, action: PayloadAction<string>) => {
      const correctOption = state.questions[state.currentQuestionIndex].correct_option;
      state.currentOptionSelected = action.payload;
      state.correctOption = correctOption;
      state.isOptionsDisabled = true;
      if (action.payload === correctOption) {
        state.score += 1;
        // Speech.speak("Congratulations. You are correct.");
        state.voiceText = "Congratulations. You are correct.";
      }
      else {
        // Speech.speak(`Oh no, you are wrong. The answer is ${correctOption}`);
        state.voiceText = `Oh no, you are wrong. The answer is ${correctOption}`;
      }
      state.showNextButton = true;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.voiceText = state.questions[state.currentQuestionIndex].question;
        state.currentQuestionIndex += 1;
        state.currentOptionSelected = null;
        state.correctOption = null;
        state.isOptionsDisabled = false;
        state.showNextButton = false;
        state.progress = state.currentQuestionIndex + 1;
      } else {
        state.showScoreModal = true;
      }
    },
    resetQuiz: (state) => {
      state.hasStarted = false;
      state.voiceText = "";
      state.currentQuestionIndex = 0;
      state.currentOptionSelected = null;
      state.correctOption = null;
      state.isOptionsDisabled = false;
      state.score = 0;
      state.showNextButton = false;
      state.showScoreModal = false;
      state.progress = 0;
    },
  },
});

export const quizActions = quizSlice.actions;
export default quizSlice.reducer;
