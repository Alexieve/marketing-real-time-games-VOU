import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { Input, Button, Text, CheckBox } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { authActions } from '../slices/authSlice';
import { request } from '../utils/request';
import localhost from '../url.config';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors }, watch } = useForm();

  // Watch the password field to compare with confirmPassword
  const password = watch('password');

  const onSubmit = async (data: any) => {
    try {
      const { user, token } = await request(`${localhost}/api/auth/register/customer`, 'post', data);
      dispatch(authActions.login({ user, token }));
      navigation.navigate('Home' as never);
    } catch (err: any) {
      showMessage({
        message: "Registration Failed",
        description: err[0].message || "An error occurred during registration. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text h3 style={styles.header}>Create Account</Text>

          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.name?.message?.toString()}
              />
            )}
          />

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
                value={value}
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
                value={value}
                secureTextEntry
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.password?.message?.toString()}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.confirmPassword?.message?.toString()}
              />
            )}
          />

          <Controller
            control={control}
            name="phonenum"
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Invalid phone number',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={{ type: 'font-awesome', name: 'phone' }}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.phonenum?.message?.toString()}
              />
            )}
          />

          <Text style={styles.label}>Gender</Text>
          <Controller
            control={control}
            name="gender"
            defaultValue="Male"
            rules={{
              required: 'Gender is required',
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.genderContainer}>
                <CheckBox
                  center
                  title="Male"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={value === 'Male'}
                  onPress={() => onChange('Male')}
                />
                <CheckBox
                  center
                  title="Female"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={value === 'Female'}
                  onPress={() => onChange('Female')}
                />
              </View>
            )}
          />
          {errors.gender && <Text style={styles.errorText}>{errors.gender.message?.toString()}</Text>}

          <Button
            title="Register"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
          />

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Login' as never)}>
              Sign In
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
    marginBottom: 10,
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

export default RegisterScreen;
