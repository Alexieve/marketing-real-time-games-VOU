import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Alert, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Image, Button, Text, Card, Icon } from '@rneui/themed';
import { RootStackParamList } from './RootStackParamList';
import { useSelector } from 'react-redux';
import { request } from '../utils/request';

type ExchangeVoucherScreenRouteProp = RouteProp<RootStackParamList, 'ExchangeVoucher'>;

const initialUserPoints = 120; // Replace with dynamic data from your source
// const event_vouchers = [
//     {
//         _id: '1',
//         code: '123',
//         qrCodeUrl: '123123',
//         imageUrl: 'http://192.168.68.101/images/voucher/66d4112d932d81e077c0c464bcac316a7f6cbdf1b60df9bb881f5103007089218b7a572e5692208a1106de80.png',
//         price: 123,
//         description: '123',
//         quantity: 123,
//         expTime: '2024-10-01T10:20:00.000+00:00',
//         status: 'active',
//     },
//     {
//         _id: '2',
//         code: '123',
//         qrCodeUrl: '123123',
//         imageUrl: 'http://192.168.68.101/images/voucher/66d4112d932d81e077c0c464bcac316a7f6cbdf1b60df9bb881f5103007089218b7a572e5692208a1106de80.png',
//         price: 123,
//         description: '123',
//         quantity: 123,
//         expTime: '2024-10-01T10:20:00.000+00:00',
//         status: 'active',
//     },
//     // Add more voucher data as needed
// ];
// const event_gameItems = [
//     // HQ
//     // {
//     //     itemID: '1',
//     //     gameID: '1',
//     //     name: 'HQ Point',
//     //     imageURL: 'http://192.168.69.101/assets/item/Point.png',
//     //     description: 'HQ Point',
//     // },
//     // Lac Xi
//     {
//         itemID: '2',
//         gameID: '2',
//         name: 'Lắc xì Coin',
//         imageURL: 'http://192.168.68.101/assets/item/Coin.png',
//         description: 'A collectible coin in Lắc xì.',
//     },
//     {
//         itemID: '3',
//         gameID: '2',
//         name: 'Lắc xì Diamond',
//         imageURL: 'http://192.168.68.101/assets/item/Diamond.png',
//         description: 'A rare diamond in Lắc xì.',
//     },
//     {
//         itemID: '4',
//         gameID: '2',
//         name: 'Lắc xì Gem',
//         imageURL: 'http://192.168.68.101/assets/item/Gem.png',
//         description: 'A precious gem in Lắc xì.',
//     },
//     {
//         itemID: '5',
//         gameID: '2',
//         name: 'Lắc xì Badge',
//         imageURL: 'http://192.168.68.101/assets/item/Badge.png',
//         description: 'A badge awarded in Lắc xì events.',
//     },
//     {
//         itemID: '6',
//         gameID: '2',
//         name: 'Lắc xì Token',
//         imageURL: 'http://192.168.68.101/assets/item/Token.png',
//         description: 'A special token for Lắc xì exchanges.',
//     },
//     {
//         itemID: '7',
//         gameID: '2',
//         name: 'Lắc xì Trophy',
//         imageURL: 'http://192.168.68.101/assets/item/Trophy.png',
//         description: 'A trophy for top players in Lắc xì.',
//     },
// ];
// const customer_items = [
//     // HQ
//     // {
//     //     "customerID": 1,
//     //     "eventID": "66c5b48b5fa4db898b0974d2",
//     //     "itemID": 1,
//     //     "quantity": 100
//     // },
//     // Lac xi
//     {
//         "customerID": 1,
//         "eventID": "66c5b48b5fa4db898b0974d2",
//         "itemID": 2,
//         "quantity": 2
//     },
//     {
//         "customerID": 1,
//         "eventID": "66c5b48b5fa4db898b0974d2",
//         "itemID": 3,
//         "quantity": 3
//     },
//     {
//         "customerID": 1,
//         "eventID": "66c5b48b5fa4db898b0974d2",
//         "itemID": 4,
//         "quantity": 4
//     }
// ]

interface eventGameItemsInterface {
    itemID: string,
    gameID: string,
    name: string,
    imageURL: string,
    description: string,
};

const ExchangeVoucherScreen = ({ route }: { route: ExchangeVoucherScreenRouteProp }) => {
    const { user } = useSelector((state: any) => state.auth);
    const { eventID, gameID } = route.params;

    const [eventVouchers, setEventVouchers] = useState<{
        _id: string,
        code: string,
        qrCodeUrl: string,
        imageUrl: string,
        price: number,
        description: string,
        quantity: number,
        expTime: string,
        status: string,
    }[]>([]);

    const [customerItems, setCustomerItems] = useState<{
        itemID: number; quantity: number;
    }[]>([]);

    const [eventGameItems, setEventGameItems] = useState<eventGameItemsInterface[]>([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchData = async () => {

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            // Fetch event vouchers
            const event_vouchers = await request(`/api/event_query/get_vouchers_by_eventID/${eventID}`, 'get', null, user.token);
            setEventVouchers(event_vouchers);

            // Fetch customer items
            const customer_items = await request(`/api/event_query/get_customer_items_by_eventID/${eventID}`, 'get', null, user.token);
            setCustomerItems(customer_items.map(customer_item => ({
                "itemID": customer_item.itemID,
                "quantity": customer_item.quantity
            })));

            // Fetch event game items
            setEventGameItems(event_gameItems);
        };
        fetchData();
    }, [fadeAnim]);

    const localhost = '';

    const handleExchange = (voucherId: string) => {
        // Handle exchange logic here
    };

    const renderGameItem = ({ item }: { item: eventGameItemsInterface }) => (
        <Card containerStyle={styles.voucherCard}>
            <Image source={{ uri: item.imageURL }} style={styles.voucherImage} />
            <Card.Title>{item.name}</Card.Title>
            <Card.Divider />
            <Text style={styles.voucherDetail}>Description: {item.description}</Text>
        </Card>
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                {gameID == "1" ? (
                    <>
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.title}>Your Points</Card.Title>
                            <Card.Divider />
                            <Text h1 style={styles.points}>
                                {customerItems.length > 0 ? customerItems[0].quantity : 'Loading...'}
                            </Text>
                        </Card>
                    </>
                ) : (
                    <>
                        <FlatList
                            data={eventGameItems}
                            renderItem={renderGameItem}
                            keyExtractor={item => item.itemID}
                            contentContainerStyle={styles.flatListContent}
                            horizontal={true}
                        />
                    </>
                )}
                <Card containerStyle={styles.card}>
                    <Card.Title style={styles.title}>Available Vouchers</Card.Title>
                    <Card.Divider />
                    {eventVouchers.length === 0 ? (
                        <Text style={styles.noVouchers}>No available vouchers.</Text>
                    ) : (
                        eventVouchers.map(voucher => {
                            const canExchange = true;
                            return (
                                <Animated.View key={voucher._id} style={{ opacity: fadeAnim }}>
                                    <Card containerStyle={styles.voucherCard}>
                                        {voucher.imageUrl && (
                                            <Image
                                                source={{ uri: localhost + voucher.imageUrl }}
                                                style={styles.voucherImage}
                                            />
                                        )}
                                        <Card.Title>{voucher.code}</Card.Title>
                                        <Card.Divider />
                                        <Text style={styles.voucherDetail}>Description: {voucher.description}</Text>
                                        <Text style={styles.voucherDetail}>Price: {voucher.price}</Text>
                                        <Text style={styles.voucherDetail}>Quantity: {voucher.quantity}</Text>
                                        <Text style={styles.voucherDetail}>Expired: {new Date(voucher.expTime).toLocaleString()}</Text>

                                        <Button
                                            title={(canExchange ? 'Exchange Voucher' : 'Insufficient Points')}
                                            buttonStyle={[
                                                styles.button,
                                                { backgroundColor: canExchange ? 'green' : 'red' }
                                            ]}
                                            disabled={!canExchange}
                                            onPress={() => handleExchange(voucher._id)}
                                            icon={
                                                <Icon
                                                    name={canExchange ? 'check-circle' : 'times-circle'}
                                                    type='font-awesome'
                                                    color='white'
                                                    size={20}
                                                    iconStyle={{ marginRight: 10 }}
                                                />
                                            }
                                        />
                                    </Card>
                                </Animated.View>
                            );
                        })
                    )}
                </Card>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        padding: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    points: {
        textAlign: 'center',
        color: '#4CAF50',
    },
    noVouchers: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
    voucherCard: {
        marginBottom: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    voucherImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    voucherDetail: {
        fontSize: 16,
        marginBottom: 4,
    },
    button: {
        marginTop: 8,
        borderRadius: 5,
    },
    flatListContent: {
        paddingBottom: 16,
    },
});

export default ExchangeVoucherScreen;