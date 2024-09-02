import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../constants"; // Adjust the import path
import { useAppDispatch, useAppSelector } from '../../store';
import { shakeActions } from '../../slices/shakeSlice';
import { fetchPlayLog } from '../../thunks/shakeThunk';
import { unwrapResult } from '@reduxjs/toolkit';

const PlayLog = ({customerID, eventID}: {customerID: any, eventID: string}) => {
  const dispatch = useAppDispatch();
  const { playlog } = useAppSelector((state) => state.shake);

  const viewPlayLog = async () => {
    const res = await dispatch(
      fetchPlayLog({ customerID, eventID })
    );
    const play = unwrapResult(res);
    dispatch(shakeActions.toggleShowPlayLog(play));
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={viewPlayLog}>
          <Icon
            name="game-controller-outline"
            size={24}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>View Play Log</Text>
      </TouchableOpacity>
      {playlog?.length > 0 && (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Play Times</Text>
        </View>
        {playlog.map((log, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableRowText}>{log.time}</Text>
        </View>))}
    </View>)}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: "center",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableRowText: {
    flex: 1,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default PlayLog;
