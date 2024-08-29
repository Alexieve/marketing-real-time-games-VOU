import React from "react";
import {Provider} from 'react-redux'
import AppNavigation from "./navigation/AppNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigation />
      </GestureHandlerRootView>
    </Provider>
  );
}
