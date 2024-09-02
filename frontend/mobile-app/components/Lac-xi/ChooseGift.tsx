import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import LottieView from "lottie-react-native";
import { COLORS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { shakeActions } from "../../slices/shakeSlice";
import ShakeToOpenGift from "./ShakeToOpen";

const ChooseGift = () => {
  const dispatch = useAppDispatch();
  const { screen } = useAppSelector((state: any) => state.shake);

  const handleGiftSelect = (giftIndex: number) => {
    // console.log("Before dispatch, screen:", screen);
    // dispatch(shakeActions.setSelectedGift(giftIndex));
    dispatch(shakeActions.setScreen(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose one gift to open</Text>
      {[...Array(3)].map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {[...Array(2)].map((_, colIndex) => {
            const index = rowIndex * 2 + colIndex;
            return (
              <TouchableOpacity
                key={index}
                style={styles.animationWrapper}
                onPress={() => handleGiftSelect(index + 1)}
              >
                <LottieView
                  source={require("../../assets/animations/Gift.json")}
                  autoPlay
                  loop
                  style={styles.animation}
                />
                <Text style={styles.giftText}>Gift {index + 1}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  animationWrapper: {
    alignItems: "center",
    width: 200, // Adjust the width for better spacing
  },
  animation: {
    width: 200,
    height: 200,
  },
  giftText: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 10,
  },
});

export default ChooseGift;
