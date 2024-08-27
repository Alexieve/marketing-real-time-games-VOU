import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { authActions } from '../slices/authSlice';
import { request } from '../utils/request';
import localhost from '../url.config';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    const mockData = {
      email: 'vuminhquynh75@gmail.com',
      password: '123456',
    };
    try {
      const { user, token } = await request(`/api/auth/login`, 'post', mockData);
      dispatch(authActions.login({ user, token }));
      navigation.navigate('Home' as never);
    } catch (err: any) {
      showMessage({
        message: "Login Failed",
        description: err[0].message || "An error occurred. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text h3 style={styles.header}>Welcome Back!</Text>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={'vuminhquynh75@gmail.com'}
                autoCapitalize="none"
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.email?.message?.toString()}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={'123456'}
                secureTextEntry
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.password?.message?.toString()}
              />
            )}
          />

          <Button
            title="Login"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
          />

          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Register' as never)}>
              Sign Up
            </Text>
          </Text>
        </View>
        <FlashMessage position="top" />
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

export default LoginScreen;
