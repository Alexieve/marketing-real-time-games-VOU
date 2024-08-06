import { createSlice } from "@reduxjs/toolkit";
import { request } from "../hooks/useRequest";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: null,
  },
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
