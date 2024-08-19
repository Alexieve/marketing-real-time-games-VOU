import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialize: (state, action) => {
      state.isInitialized = true;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
