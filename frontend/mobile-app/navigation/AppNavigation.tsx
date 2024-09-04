import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import Quiz from '../screens/HQ-Trivia/Quiz';
import Shake from '../screens/Lac-xi/Shake';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Shake">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Ẩn header của màn hình Login
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }} // Ẩn header của màn hình Register
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: 'OTP Verification',
            headerLeft: () => (
              <Button
                onPress={() => navigation.goBack()}
                title="Back"
                color="#007bff"
              />
            ),
          })}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Ẩn header
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{ headerShown: false }} // Ẩn header
        />
        <Stack.Screen
          name="Shake"
          component={Shake}
          options={{ headerShown: false }} // Ẩn header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
