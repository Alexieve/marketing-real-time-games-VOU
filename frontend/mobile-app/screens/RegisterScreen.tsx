import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { Input, Button, Icon } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

const RegisterScreen = () => {
  const [gender, setGender] = useState('Male');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const navigation = useNavigation();

  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    console.log('Full Name:', data.fullName, 'Email:', data.email, 'Phone Number:', data.phoneNumber, 'Password:', data.password, 'Gender:', gender);
    navigation.navigate('Login' as never);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Create an Account</Text>

          <Controller
            control={control}
            name="fullName"
            rules={{ required: 'Full Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Full Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={<Icon name="user" type="font-awesome" />}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.fullName?.message?.toString()}
              />
            )}
          />

          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity onPress={() => setIsPickerVisible(true)}>
            <View style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>{gender}</Text>
            </View>
          </TouchableOpacity>

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
                leftIcon={<Icon name="envelope" type="font-awesome" />}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.email?.message?.toString()}
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            rules={{ required: 'Phone Number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
                leftIcon={<Icon name="phone" type="font-awesome" />}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.phoneNumber?.message?.toString()}
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
                leftIcon={<Icon name="lock" type="font-awesome" />}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.password?.message?.toString()}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirm Password is required',
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
                leftIcon={<Icon name="lock" type="font-awesome" />}
                inputContainerStyle={styles.inputContainer}
                errorMessage={errors.confirmPassword?.message?.toString()}
              />
            )}
          />

          <Button
            title="Register"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
          />

          <Text style={styles.footerText}>
            Already have an account? 
            <Text 
              style={styles.linkText} 
              onPress={() => navigation.navigate('Login' as never)}
            >
              Login
            </Text>
          </Text>

          <Modal visible={isPickerVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Gender</Text>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                <Button title="Done" onPress={() => setIsPickerVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontSize: 24,
  },
  inputContainer: {
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
  },
  pickerButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#28a745',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  footerText: {
    marginTop: 20,
    color: '#999',
    textAlign: 'center',
  },
  linkText: {
    color: '#007bff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
  },
});

export default RegisterScreen;
