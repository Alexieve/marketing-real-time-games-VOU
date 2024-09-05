import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../constants"; // Adjust the import path
import { useAppDispatch, useAppSelector } from '../../store';
import { shakeActions } from '../../slices/shakeSlice';
import { useNavigation } from '@react-navigation/native';
import { fetchItems, fetchOwnItems, fetchPlayTurn } from '../../thunks/shakeThunk';
import { unwrapResult } from '@reduxjs/toolkit';

const Header = ({customerID, eventID}: {customerID: any, eventID: string}) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
  
    const { screen, myItemsScreen, playturn, items, ownItems } = useAppSelector((state: any) => state.shake);
  
    const goBack = () => {
        if (myItemsScreen) {
            dispatch(shakeActions.setMyItemsScreen(false));
        } else {
            if (screen === 0) {
                navigation.goBack();
            } else {
                dispatch(shakeActions.setScreen(screen - 1));
            }
        };
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchItems({ eventID }));
                dispatch(fetchOwnItems({ customerID, eventID }));

                const res = await dispatch(fetchPlayTurn({ customerID, eventID }));
                const playturnResult = unwrapResult(res);

                dispatch(shakeActions.setPlayturn(playturnResult));
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, [customerID, eventID]);
    
    const goToMyItems = () => {
        // while (!items) {
        //     dispatch(fetchItems({ eventID }));
        // }
        // while (!ownItems) {
        //     dispatch(fetchOwnItems({ customerID, eventID }));
        // }
        dispatch(fetchOwnItems({ customerID, eventID }));
        dispatch(shakeActions.setMyItemsScreen(true));
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.playturnLabel}>
                <Text style={styles.playturnText}>Play turn: {playturn}</Text>
            </View>
            <TouchableOpacity style={styles.myItemsButton} onPress={goToMyItems}>
                <Text style={styles.myItemsText}>My Items</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: COLORS.primary,
    },
    backButton: {
        backgroundColor: COLORS.accent,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    myItemsButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    myItemsText: {
        color: COLORS.white,
        fontSize: 16,
    },
    playturnLabel: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    playturnText: {
        color: COLORS.white,
        fontSize: 16,
    },
});

export default Header;
