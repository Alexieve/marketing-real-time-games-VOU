import React from "react";
import {Provider} from 'react-redux'
import AppNavigation from "./navigation/AppNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "./store";
import { usePushNotifications } from "./usePushNotification";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  // console.log(expoPushToken);
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigation />
      </GestureHandlerRootView>
    </Provider>
  );
}
