import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { DeviceMotion } from "expo-sensors";
import LottieView from "lottie-react-native";
import { COLORS } from "../../constants";
import { useAppSelector } from "../../store";
import ResultModal from "./ResultModal"; // Import the new ResultModal component
import { useAppDispatch } from "../../store";
import { shakeActions } from "../../slices/shakeSlice";
import { addPlayLog } from "../../thunks/quizThunk";
import { AddItems, fetchOwnItems } from "../../thunks/shakeThunk";

const ShakeToOpenGift = ({customerID, eventID}: {customerID: any, eventID: string}) => {
  const dispatch = useAppDispatch();
  const [shakeCount, setShakeCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState("Surprise Item");
  const { items, ownItems } = useAppSelector((state: any) => state.shake);
  const hasShakenEnough = useRef(false); // To prevent multiple calls

  const { playturn } = useAppSelector((state: any) => state.shake);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(400);

    const subscription = DeviceMotion.addListener((motionData) => {
      const { acceleration } = motionData;
      const totalForce = acceleration
        ? Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z)
        : 0;

      if (totalForce > 5) {
        setShakeCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount >= 3 && !hasShakenEnough.current) {
            hasShakenEnough.current = true;
            openGift();
          }
          return newCount;
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const openGift = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    setItem(randomItem);
    setModalVisible(true);
    dispatch(addPlayLog({ customerID, eventID }));
    const ownItem = ownItems.find((item: any) => item.itemID === items[randomIndex].itemID) 
    || { itemID: items[randomIndex].itemID, quantity: 1 };
    const addItem = [{ itemID: ownItem.itemID, quantity: 1 }];
    dispatch(AddItems({ customerID, eventID, items: addItem }));
    dispatch(fetchOwnItems({ customerID, eventID }));
    dispatch(shakeActions.setPlayturn(playturn - 1));
  };

  const closeModal = () => {
    setModalVisible(false);
    setShakeCount(0);
    hasShakenEnough.current = false;
    dispatch(shakeActions.setScreen(0));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shake the phone to open your gift!</Text>
      <LottieView
        source={require("../../assets/animations/Gift.json")}
        autoPlay
        loop
        style={styles.animation}
      />

      <ResultModal
        visible={modalVisible}
        item={item}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 10,
    textAlign: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default ShakeToOpenGift;
