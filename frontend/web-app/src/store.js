/* eslint-disable prettier/prettier */
import { configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "./stores/sidebarSlice";

const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
    },
});

export default store;
