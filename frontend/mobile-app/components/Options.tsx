import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Options = ({
  options,
  validateAnswer,
  correctOption,
  currentOptionSelected,
  isOptionsDisabled,
}: {
  options: string[];
  validateAnswer: (option: string) => void;
  correctOption: string;
  currentOptionSelected: string;
  isOptionsDisabled: boolean;
}) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          onPress={() => validateAnswer(option)}
          disabled={isOptionsDisabled}
          key={option}
          style={[
            styles.optionButton,
            {
              borderColor:
                option == correctOption
                  ? COLORS.success
                  : option == currentOptionSelected
                  ? COLORS.error
                  : COLORS.secondary + "40",
              backgroundColor:
                option == correctOption
                  ? COLORS.success + "20"
                  : option == currentOptionSelected
                  ? COLORS.error + "20"
                  : COLORS.secondary + "20",
            },
          ]}
        >
          <Text style={styles.optionText}>{option}</Text>
          {option == correctOption ? (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: COLORS.success },
              ]}
            >
              <MaterialCommunityIcons name="check" style={styles.icon} />
            </View>
          ) : option == currentOptionSelected ? (
            <View
              style={[styles.iconContainer, { backgroundColor: COLORS.error }]}
            >
              <MaterialCommunityIcons name="close" style={styles.icon} />
            </View>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    borderWidth: 3,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  optionText: {
    fontSize: 20,
    color: COLORS.white,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: COLORS.white,
    fontSize: 20,
  },
});

export default Options;
