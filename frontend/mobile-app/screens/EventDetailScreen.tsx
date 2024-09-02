import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList'; // Import the type you just created
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

const EventDetailScreen = ({ route }: { route: EventDetailScreenRouteProp }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { event } = route.params;
    return (
        <View style={styles.container}>
            <Image source={{ uri: event.imageUrl }} style={styles.cardImage} />
            <Text style={styles.cardText}>ImageUrl: {event.imageUrl}</Text>
            <Text style={styles.cardText}>Event Name: {event.name}</Text>
            <Text style={styles.cardText}>Description: {event.description}</Text>
            <Text style={styles.cardText}>StartTime: {event.startTime}</Text>
            <Text style={styles.cardText}>EndTime: {event.endTime}</Text>
            <Text style={styles.cardText}>Brand: {event.brand}</Text>
            <Text style={styles.cardText}>Game: {event.game.gameID}</Text>
            <Button title="Exchange Voucher" onPress={() => {
                navigation.navigate('ExchangeVoucher', {
                    eventID: event._id
                })
            }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    cardImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default EventDetailScreen;