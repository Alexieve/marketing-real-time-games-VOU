// GiftModal.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import { AddItems, fetchOwnItems, fetchUserByPhone } from "../../thunks/shakeThunk";

interface GiftModalProps {
  customerID: any;
  eventID: string;
  visible: boolean;
  onClose: () => void;
  selectedItem: any;
}

const GiftModal: React.FC<GiftModalProps> = ({
  customerID,
  eventID,
  visible,
  onClose,
  selectedItem,
}) => {
  const dispatch = useAppDispatch();
  const [giftQuantity, setGiftQuantity] = useState(1);
  const { ownItems } = useAppSelector((state: any) => state.shake);

  const [phonenum, setPhonenum] = useState("");
  // const customerPhonenum = useAppSelector((state: any) => state.quiz.phonenum);
  const customerPhonenum = "0123456789";

  const handleConfirm = async () => {
    if (giftQuantity <= 0) {
      showMessage({
        message: "Oh no!",
        description: "You cannot give nothing.",
        type: "danger",
      });
      return;
    }

    const ownItem = ownItems.find(
      (item: any) => item.itemID === selectedItem.itemID
    ) || { itemID: selectedItem.itemID, quantity: 1 };

    if (ownItem.quantity < giftQuantity) {
      showMessage({
        message: "Oh no!",
        description: "You do not have enough items.",
        type: "danger",
      });
      return;
    }

    if (!phonenum || phonenum.length != 10) {
      showMessage({
        message: "Oh no!",
        description: "Please enter a valid phone number.",
        type: "danger",
      });
      return;
    }

    if (phonenum === customerPhonenum) {
      showMessage({
        message: "Oops!",
        description: "You cannot gift yourself.",
        type: "danger",
      });
      return;
    }

    // B1: fetch user by phone
    let friendID = null;
    try {
      const res = await dispatch(fetchUserByPhone({ phonenum }));
      const data = unwrapResult(res);
      friendID = data.id;
    } catch (error: any) {
      showMessage({
        message: "Oops!",
        description: "User not found.",
        type: "danger",
      });
      return;
    }
    
    // B2: +quantity for new user
    dispatch(AddItems({ 
      customerID: friendID, 
      eventID, 
      items: [{ itemID: selectedItem.itemID, quantity: giftQuantity }] 
    }));

    // B3: -quantity for current user
    dispatch(AddItems({ 
      customerID, 
      eventID, 
      items: [{ itemID: selectedItem.itemID, quantity: -giftQuantity }] 
    }));

    dispatch(fetchOwnItems({ customerID, eventID }));
    setGiftQuantity(1);
    setPhonenum("");
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
          <View style={styles.modalContent}>
            <Image
              source={require("../../assets/images/item.png")}
              style={styles.modalImage}
              resizeMode={"contain"}
            />
            <Text style={styles.modalTitle}>{selectedItem.name}</Text>

            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.white}
              keyboardType="phone-pad"
              value={phonenum}
              onChangeText={setPhonenum}
            />

            <TextInput
              style={styles.quantityInput}
              keyboardType="number-pad"
              value={String(giftQuantity)}
              onChangeText={(text) => setGiftQuantity(Number(text))}
            />
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Gift</Text>
            </TouchableOpacity>
            <Button title="Cancel" onPress={onClose} color={COLORS.secondary} />
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalImage: {
    width: 150,
    height: 150,
  },
  modalTitle: {
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  quantityInput: {
    width: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.white,
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
  phoneInput: {
    width: "100%",
    height: 40,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: COLORS.white,
    marginBottom: 20,
  },
});

export default GiftModal;
