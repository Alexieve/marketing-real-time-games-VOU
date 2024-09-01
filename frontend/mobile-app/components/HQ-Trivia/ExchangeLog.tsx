import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from "../../constants"; // Adjust the import path
import { useAppSelector } from '../../store';

const ExchangeLog = () => {
  const { exchangeLog } = useAppSelector((state) => state.quiz);

  return (
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
    </View>
  );
};

const styles = StyleSheet.create({
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
