import { configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "./stores/sidebarSlice";
import authReducer from "./stores/authSlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
  },
});

export default store;
