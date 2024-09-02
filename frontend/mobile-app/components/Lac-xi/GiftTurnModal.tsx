import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import  {showMessage} from "react-native-flash-message";
import { giftPlayTurn } from "../../thunks/shakeThunk";
import { unwrapResult } from "@reduxjs/toolkit";

const GiftTurnModal = ({
  customerID,
  eventID,
  visible,
  onClose,
  onSubmit,
}: {
  customerID: any;
  eventID: string;
  visible: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  // const { phonenum } = useAppSelector((state: any) => state.quiz);

  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length != 10) {
      return;
    }

    if (phoneNumber === "0123456789") {
      showMessage({
        message: "Oops!",
        description: "You cannot gift yourself.",
        type: "danger",
      });
      return;
    }

    const res = await dispatch(giftPlayTurn({ customerID, eventID, phonenum: phoneNumber }));
    const error = unwrapResult(res);
    if (error) {
      showMessage({
        message: "Oops!",
        description: error[0].message,
        type: "danger",
      });
      return;
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Enter Your Friend's Phone Number</Text>

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={COLORS.white}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Gift</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },
  title: {
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: COLORS.white,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default GiftTurnModal;
