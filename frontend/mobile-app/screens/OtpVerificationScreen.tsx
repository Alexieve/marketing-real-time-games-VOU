import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { request } from '../utils/request';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { authActions } from '../slices/authSlice';
import {useAppDispatch} from '../store';

const OtpVerificationScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      console.log(route.params?.data);
      console.log(data.otp);
      // Send OTP and userId for verification
      const { user, token } = await request(`/api/auth/verify-otp`, 'post', {
        otp: data.otp,
        infor: route.params?.data,
      });
      alert('OTP verified successfully!');
      dispatch(authActions.login({ user, token }));
      navigation.navigate('Home' as never);
    } catch (err: any) {
      alert(err[0].message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text h3 style={styles.header}>OTP Verification</Text>
          <Text style={styles.subHeader}>Enter the OTP sent to your email</Text>

          <Controller
            control={control}
            name="otp"
            rules={{
              required: 'OTP is required',
              minLength: {
                value: 6,
                message: 'OTP must be 6 digits',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter OTP"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.otp?.message?.toString()}
              />
            )}
          />

          <Button
            title="Verify OTP"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
          />

          <Text style={styles.footerText}>
            Didn't receive the OTP?{' '}
            <Text style={styles.linkText} onPress={() => {
              // Resend OTP logic here
            }}>
              Resend OTP
            </Text>
          </Text>
        </View>
        <FlashMessage position="bottom" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    color: '#333',
  },
  subHeader: {
    marginBottom: 20,
    color: '#555',
  },
  inputContainer: {
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  footerText: {
    marginTop: 20,
    color: '#999',
  },
  linkText: {
    color: '#007bff',
  },
});

export default OtpVerificationScreen;
