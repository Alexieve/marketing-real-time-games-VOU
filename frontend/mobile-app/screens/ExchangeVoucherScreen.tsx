import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Alert, FlatList, Modal, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Image, Button, Text, Card, Icon } from '@rneui/themed';
import { RootStackParamList } from './RootStackParamList';
import { useSelector } from 'react-redux';
import { request } from '../utils/request';
import localhost from '../url.config';
import { set } from 'react-hook-form';

type ExchangeVoucherScreenRouteProp = RouteProp<RootStackParamList, 'ExchangeVoucher'>;

const event_gameItems = [
    // HQ
    {
        itemID: '1',
        gameID: '1',
        name: 'HQ Point',
        imageURL: 'http://192.168.69.101/assets/item/Point.png',
        description: 'HQ Point',
    },
    // Lac Xi
    // {
    //     itemID: '2',
    //     gameID: '2',
    //     name: 'Lắc xì Coin',
    //     imageURL: '/assets/item/Coin.png',
    //     description: 'A collectible coin in Lắc xì.',
    // },
    // {
    //     itemID: '3',
    //     gameID: '2',
    //     name: 'Lắc xì Diamond',
    //     imageURL: '/assets/item/Diamond.png',
    //     description: 'A rare diamond in Lắc xì.',
    // },
    // {
    //     itemID: '4',
    //     gameID: '2',
    //     name: 'Lắc xì Gem',
    //     imageURL: '/assets/item/Gem.png',
    //     description: 'A precious gem in Lắc xì.',
    // },
    // {
    //     itemID: '5',
    //     gameID: '2',
    //     name: 'Lắc xì Badge',
    //     imageURL: '/assets/item/Badge.png',
    //     description: 'A badge awarded in Lắc xì events.',
    // },
    // {
    //     itemID: '6',
    //     gameID: '2',
    //     name: 'Lắc xì Token',
    //     imageURL: '/assets/item/Token.png',
    //     description: 'A special token for Lắc xì exchanges.',
    // },
    // {
    //     itemID: '7',
    //     gameID: '2',
    //     name: 'Lắc xì Trophy',
    //     imageURL: '/assets/item/Trophy.png',
    //     description: 'A trophy for top players in Lắc xì.',
    // },
];
const customer_items = [
    // HQ
    {
        "customerID": "1",
        "eventID": "66c5b48b5fa4db898b0974d2",
        "itemID": "1",
        "quantity": 100
    },
    // Lac xi
    // {
    //     "customerID": "1",
    //     "eventID": "66d655f3bb5b61c00ea8e177",
    //     "itemID": "2",
    //     "quantity": 2
    // },
    // {
    //     "customerID": "1",
    //     "eventID": "66d655f3bb5b61c00ea8e177",
    //     "itemID": "3",
    //     "quantity": 3
    // },
    // {
    //     "customerID": "1",
    //     "eventID": "66d655f3bb5b61c00ea8e177",
    //     "itemID": "4",
    //     "quantity": 4
    // }
]
interface eventGameItemsInterface {
    itemID: string,
    gameID: string,
    name: string,
    imageURL: string,
    description: string,
    userOwnedQuantity: number,
};


const ExchangeVoucherScreen = ({ route }: { route: ExchangeVoucherScreenRouteProp }) => {
    const { user } = useSelector((state: any) => state.auth);
    // const { eventID, gameID } = route.params;
    const eventID = "66d655f3bb5b61c00ea8e177";

    const [gameID, setGameID] = useState("1");

    const [eventVouchers, setEventVouchers] = useState<{
        _id: string,
        code: string,
        imageUrl: string,
        price: number,
        description: string,
        quantity: number,
        expTime: string,
        status: string,
    }[]>([]);
    const [customerItems, setCustomerItems] = useState<{
        itemID: string; quantity: number;
    }[]>([]);
    const [eventGameItems, setEventGameItems] = useState<eventGameItemsInterface[]>([]);
    const [redeemedVouchers, setRedeemedVouchers] = useState<{
        _id: string,
        code: string,
        imageUrl: string,
        price: number,
        description: string,
        quantity: number,
        expTime: string,
        status: string,
    }>();
    const [totalUserItems, setTotalUserItems] = useState(0);
    const [totalItemExchange, setTotalItemExchange] = useState(0);
    const [itemsNumberChosenExchange, setItemsNumberChosenExchange] = useState<{
        itemID: string; quantity: number;
    }[]>([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showExchangeOneTimeModal, setShowExchangeModal] = useState(false);
    const [showVoucherRedeemModal, setShowVoucherRedeemModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {

                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                // Fetch event vouchers
                const event_vouchers = await request(`/api/event_query/get_vouchers_by_eventID/${eventID}`, 'get', null);
                setEventVouchers(event_vouchers);

                // Fetch customer items 
                // const customer_items = await request(`/api/event_query/get_customer_items_by_eventID/${eventID}`, 'get', null);
                setCustomerItems(customer_items.map(customer_item => ({
                    "itemID": customer_item.itemID,
                    "quantity": customer_item.quantity
                })));

                // Calculate total user items
                setTotalUserItems(customer_items.reduce((total, customerItem) => total + customerItem.quantity, 0));

                // Fetch event game items
                // const event_gameItems = await request(`/api/game/game-item/${eventID}`, 'get', null);
                setEventGameItems(event_gameItems.map(event_gameItem => ({
                    ...event_gameItem,
                    userOwnedQuantity: customer_items.find(customerItem => customerItem.itemID == event_gameItem.itemID)?.quantity || 0
                })));

                // Initialize itemsNumberChosenExchange
                setItemsNumberChosenExchange(event_gameItems.map(event_gameItem => ({
                    itemID: event_gameItem.itemID,
                    quantity: 0
                })));

            } catch (error) {
                Alert.alert('Error', 'An error occurred while fetching data.');
            }
        }
        fetchData();
    }, [fadeAnim]);

    const handleExchange = async () => {
        try {
            // Select one random voucher with quantity > 0 to exchange
            let randInt = 0;
            do {
                randInt = Math.floor(Math.random() * eventVouchers.length);
            } while (eventVouchers[randInt].quantity == 0);

            // Call the voucher update quantity API
            const voucherID = eventVouchers[randInt]._id;
            const payload = {
                userID: user._id ? user._id : "1",
                quantity: 1,
                eventID: eventID,
            };
            await request(`/api/event_command/voucher/update_quantity/${voucherID}`, 'put', payload);

            setRedeemedVouchers(eventVouchers[randInt]);
            setShowExchangeModal(false);
            setShowVoucherRedeemModal(true);

        } catch (error) {
            Alert.alert('Error', 'An error occurred while exchanging voucher. Please try again.');
        }
    };

    const handleItemsNumberChosenExchangeChange = (index: number, quantity: number) => {
        if (!quantity) {
            quantity = 0;
        }
        // Check whether the user has enough items to exchange
        if (quantity > eventGameItems[index].userOwnedQuantity) {
            Alert.alert('Error', `You do not have enough ${eventGameItems[index].name} to exchange.`);
            return;
        }
        let itemsNumberChosenExchangeTmp = [...itemsNumberChosenExchange];
        let oldQuantity = itemsNumberChosenExchangeTmp[index].quantity;
        itemsNumberChosenExchangeTmp[index].quantity = quantity;
        setItemsNumberChosenExchange(itemsNumberChosenExchangeTmp);
        setTotalItemExchange(totalItemExchange - oldQuantity + quantity);
    };

    const renderGameItem = ({ item }: { item: eventGameItemsInterface }) => (
        <Animated.View key={item.itemID} style={{ opacity: fadeAnim }}>
            <Card containerStyle={styles.itemCard}>
                <Image source={{ uri: localhost + item.imageURL }} style={styles.itemImage} />
                <Card.Title>{item.name}</Card.Title>
                <Card.Divider />
                <Text style={styles.itemDetail}>Description: {item.description}</Text>
                <Text style={[styles.itemQuantity, { color: item.userOwnedQuantity != 0 ? 'green' : 'gray' }]}>
                    Owned: {item.userOwnedQuantity}
                </Text>
            </Card>
        </Animated.View>
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                {gameID == "1" ? (
                    <>
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.title}>HQ Exchange Section</Card.Title>
                            <Card.Divider style={{ backgroundColor: 'black' }} />
                            <Text h4 style={{ textAlign: 'center' }}>Your Points:</Text>
                            <Text h1 style={styles.points}>
                                {customerItems.length > 0 ? customerItems[0].quantity : 'Loading...'}
                            </Text>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.title}>Lac Xi Exchange Section</Card.Title>
                            <Card.Divider style={{ backgroundColor: 'black' }} />
                            <Text h4 style={{ textAlign: 'center' }}>Items:</Text>
                            <FlatList
                                data={eventGameItems}
                                renderItem={renderGameItem}
                                keyExtractor={item => item.itemID}
                                contentContainerStyle={styles.flatListContent}
                                horizontal={true}
                                style={styles.flatList}
                                ItemSeparatorComponent={() => <View style={styles.flatListItem} />}
                            />
                            <View style={styles.totalItemsContainer}>
                                <Text style={styles.totalItemsText}>
                                    Total Owned Items: {totalUserItems}
                                </Text>
                                <Button
                                    title="Exchange"
                                    buttonStyle={styles.exchangeButton}
                                    onPress={() => setShowExchangeModal(true)}
                                />
                            </View>
                        </Card>
                    </>
                )}
                <Card containerStyle={styles.card}>
                    <Card.Title style={styles.title}>Available Vouchers</Card.Title>
                    <Card.Divider style={{ backgroundColor: 'black' }} />
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
                                        {gameID == "1" && (
                                            <Button
                                                title={(canExchange ? 'Exchange Voucher' : 'Insufficient Points')}
                                                buttonStyle={[
                                                    styles.button,
                                                    { backgroundColor: canExchange ? 'green' : 'red' }
                                                ]}
                                                disabled={!canExchange}
                                                // onPress={() => handleExchange()}
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
                                        )}
                                    </Card>
                                </Animated.View>
                            );
                        })
                    )}
                </Card>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showExchangeOneTimeModal}
                onRequestClose={() => setShowExchangeModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Exchange Options</Text>
                        </View>
                        <View style={styles.modalBody}>
                            {eventGameItems.length != 0 ?
                                eventGameItems.map((item, index) => {
                                    return (
                                        <View key={item.itemID} style={styles.itemInputContainer}>
                                            <View style={styles.totalItemsContainer}>
                                                <Text>{item.name}</Text>
                                                <Text>Owned: {item.userOwnedQuantity}</Text>
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                keyboardType="numeric"
                                                placeholder="Enter quantity"
                                                value={itemsNumberChosenExchange[index]?.quantity.toString()}
                                                onChangeText={text => handleItemsNumberChosenExchangeChange(index, parseInt(text))}
                                            />
                                        </View>
                                    );
                                }) : (
                                    <Text>Loading...</Text>
                                )}
                            <Button
                                title={"Exchange 6/" + totalItemExchange.toString() + " items"}
                                buttonStyle={styles.exchangeOptionButton}
                                disabled={totalItemExchange < 6}
                                onPress={handleExchange}
                            />
                        </View>
                        <View style={styles.modalFooter}>
                            <Button
                                title="Close"
                                buttonStyle={styles.closeButton}
                                onPress={() => setShowExchangeModal(false)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showVoucherRedeemModal}
                onRequestClose={() => setShowVoucherRedeemModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Voucher Redeemed</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Card containerStyle={styles.voucherCard}>
                                <Image
                                    source={{ uri: localhost + redeemedVouchers?.imageUrl }}
                                    style={styles.voucherImage}
                                />
                                <Card.Title>{redeemedVouchers?.code}</Card.Title>
                                <Card.Divider style={{ backgroundColor: 'black' }} />
                                <Text style={styles.voucherDetail}>Description: {redeemedVouchers?.description}</Text>
                                <Text style={styles.voucherDetail}>Price: {redeemedVouchers?.price}</Text>
                                <Text style={styles.voucherDetail}>Quantity: {redeemedVouchers?.quantity}</Text>
                                <Text style={styles.voucherDetail}>Expired: {redeemedVouchers?.expTime ? new Date(redeemedVouchers.expTime).toLocaleString() : 'N/A'}</Text>
                            </Card>
                            <View style={styles.modalFooter}>
                                <Button
                                    title="Close"
                                    buttonStyle={styles.closeButton}
                                    onPress={() => setShowVoucherRedeemModal(false)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView >

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: 'lightblue',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    gameTitle: {
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
    },
    points: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    itemCard: {
        width: 200,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    itemImage: {
        width: '100%',
        aspectRatio: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover', // Ensures the image covers the whole area
        marginBottom: 6
    },
    itemDetail: {
        fontSize: 14,
        marginVertical: 5,
    },
    itemQuantity: {
        fontSize: 14,
        marginVertical: 5,
    },
    totalItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalItemsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemInputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    // Exchange options modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBody: {
        padding: 20,
        flexDirection: 'column',
    },
    modalFooter: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: 'red',
        borderRadius: 5,
    },
    exchangeButton: {
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    exchangeOptionsContainer: {
        marginTop: 10,
    },
    exchangeOptionsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exchangeOptionButton: {
        marginBottom: 5,
        backgroundColor: 'green',
        borderRadius: 5,
    },
    //
    voucherCard: {
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    voucherImage: {
        width: '100%',
        aspectRatio: 16 / 9, // Set the aspect ratio to 16:9
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover', // Ensures the image covers the whole area
        marginBottom: 15
    },
    voucherDetail: {
        fontSize: 14,
        marginVertical: 5,
    },
    noVouchers: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        borderRadius: 5,
    },
    flatList: {
        flexGrow: 0,
        marginTop: -15,
        marginBottom: 10,
    },
    flatListItem: {
        marginHorizontal: 5,
    },
    flatListContent: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
});

export default ExchangeVoucherScreen;