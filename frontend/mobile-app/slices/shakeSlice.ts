import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShakeState {
  hasStarted: boolean;
  showScoreModal: boolean;
  playlog: any[];
  exchangeLog: any[];
  ownItems: any[];
  items: any[];
  screen: number;
  selectedGift: number | null;
  myItemsScreen: boolean;
  playturn: number;
}

const initialState: ShakeState = {
  hasStarted: false,
  showScoreModal: false,
  playlog: [],
  exchangeLog: [],
  ownItems: [],
  items: [],
  screen: 0,
  selectedGift: null,
  myItemsScreen: false,
  playturn: 0,
};

const shakeSlice = createSlice({
  name: "shake",
  initialState,
  reducers: {
    initializeQuiz: (state) => {
      state.hasStarted = true;
      state.showScoreModal = false;
      state.screen = 1;
    },
    setPlayturn: (state, action: PayloadAction<number>) => {
      state.playturn = action.payload;
    },
    setMyItemsScreen: (state, action: PayloadAction<boolean>) => {
      state.myItemsScreen = action.payload;
    },
    setSelectedGift: (state, action: PayloadAction<number>) => {
      state.selectedGift = action.payload;
    },
    setScreen: (state, action: PayloadAction<number>) => {
      state.screen = action.payload;
    },
    setItems: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    setOwnItems: (state, action: PayloadAction<any[]>) => {
      state.ownItems = action.payload;
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
    resetQuiz: (state) => {
      state.hasStarted = false;
      state.showScoreModal = false;
    },
  },
});

export const shakeActions = shakeSlice.actions;
export default shakeSlice.reducer;
