import React from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../constants";

const ResultModal = ({ visible, item, onClose }: { visible: boolean, item: string, onClose: () => void }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={require("../../assets/images/item.png")}
            style={styles.animation}
            resizeMode={"contain"}
          />
          <Text style={styles.itemText}>{item}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
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
  animation: {
    width: 200,
    height: 200,
  },
  itemText: {
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ResultModal;
