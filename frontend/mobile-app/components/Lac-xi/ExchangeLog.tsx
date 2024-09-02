import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from "../../constants"; // Adjust the import path
import { useAppDispatch, useAppSelector } from '../../store';
import { TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { unwrapResult } from '@reduxjs/toolkit';
import { shakeActions } from '../../slices/shakeSlice';
import { fetchExchangeLog } from '../../thunks/quizThunk';

const ExchangeLog = ({customerID, eventID}: {customerID: any, eventID: string}) => {
  const dispatch = useAppDispatch();
  const { exchangeLog } = useAppSelector((state) => state.shake);

  const viewExchangeLog = async () => {
    const res = await dispatch(
      fetchExchangeLog({ customerID, eventID })
    );
    const exchanges = unwrapResult(res);
    dispatch(shakeActions.toggleShowExchangeLog(exchanges));
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={viewExchangeLog}>
        <Icon
          name="sync-circle-outline"
          size={24}
          color={COLORS.white}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>View Exchange Log</Text>
      </TouchableOpacity>
      {exchangeLog?.length > 0 && (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Exchange Times</Text>
          <Text style={styles.tableHeaderText}>Description</Text>
        </View>
        {exchangeLog.map((log, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableRowText}>{log.timeExchange}</Text>
            <Text style={styles.tableRowText}>{log.description}</Text>
          </View>
        ))}
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

export default ExchangeLog;
