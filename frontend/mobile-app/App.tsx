import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigation from './navigation/AppNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigation />
      </GestureHandlerRootView>
    </>
  );
}