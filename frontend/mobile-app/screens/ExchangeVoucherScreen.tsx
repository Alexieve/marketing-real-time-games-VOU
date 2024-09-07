import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    FlatList,
    Modal,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image, Button, Text, Card, Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { request } from "../utils/request";
import localhost from "../url.config";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../constants";

interface eventGameItemsInterface {
    itemID: string;
    gameID: string;
    name: string;
    imageURL: string;
    description: string;
    userOwnedQuantity: number;
}

interface voucherInterface {
    _id: string;
    code: string;
    imageUrl: string;
    price: number;
    description: string;
    quantity: number;
    expTime: string;
    status: string;
}

interface customerItemsInterface {
    itemID: string;
    quantity: number;
}

const ExchangeVoucherScreen = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state: any) => state.auth);

    const route = useRoute();
    const { eventID, gameID } = route.params as { eventID: string; gameID: any };

    const [eventVouchers, setEventVouchers] = useState<voucherInterface[]>([]);
    const [customerItems, setCustomerItems] = useState<customerItemsInterface[]>(
        []
    );
    const [eventGameItems, setEventGameItems] = useState<
        eventGameItemsInterface[]
    >([]);
    const [redeemedVouchers, setRedeemedVouchers] = useState<voucherInterface>();
    const [showVoucherRedeemModal, setShowVoucherRedeemModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch event vouchers
                let response = await fetch(`${localhost}/api/event_query/get_vouchers_by_eventID/${eventID}`);
                const event_vouchers = await response.json();
                setEventVouchers(event_vouchers);

                // Fetch customer items
                response = await fetch(`${localhost}/api/game/customer-item/?customerID=${user.id}&eventID=${eventID}`);
                const customer_items = await response.json();

                setCustomerItems(
                    customer_items.map((customer_item: customerItemsInterface) => ({
                        itemID: customer_item.itemID,
                        quantity: customer_item.quantity,
                    }))
                );

                // Fetch event game items
                response = await fetch(`${localhost}/api/game/game-item/${eventID}`);
                const event_gameItems = await response.json();
                if (gameID != "1") {
                    setEventGameItems(
                        event_gameItems.map((event_gameItem: eventGameItemsInterface) => ({
                            ...event_gameItem,
                            userOwnedQuantity:
                                customer_items.find(
                                    (customerItem: customerItemsInterface) =>
                                        customerItem.itemID == event_gameItem.itemID
                                )?.quantity || 0,
                        }))
                    );
                } else {
                    // If HQ, event_gameItems will only have one item
                    setEventGameItems(
                        event_gameItems.map((event_gameItem: eventGameItemsInterface) => ({
                            ...event_gameItem,
                            userOwnedQuantity: 0,
                        }))
                    );
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while fetching data.");
            }
        };
        fetchData();
    }, [refresh]);

    const handleLacXiExchange = async (itemID: String) => {
        try {
            // Check if there is a voucher available for exchange
            if (eventVouchers.filter((voucher) => voucher.quantity > 0).length == 0) {
                Alert.alert("Error", "There are no available vouchers for exchange.");
                return;
            }
            // Select one random voucher with quantity > 0 to exchange
            let randInt = 0;
            do {
                randInt = Math.floor(Math.random() * eventVouchers.length);
            } while (eventVouchers[randInt].quantity == 0);

            // Call the voucher update quantity API
            const voucherID = eventVouchers[randInt]._id;
            const voucherPayload = {
                userID: user.id ? user.id : "1",
                quantity: 1,
                eventID: eventID,
            };
            await request(
                `/api/event_command/voucher/update_quantity/${voucherID}`,
                "put",
                voucherPayload
            );

            // Update item quantity
            const itemsPayload = {
                customerID: user.id,
                eventID: eventID,
                items: [
                    {
                        itemID: itemID,
                        quantity: -6,
                    },
                ],
            };

            await request("/api/game/customer-item", "post", itemsPayload);

            setRedeemedVouchers(eventVouchers[randInt]);
            setShowVoucherRedeemModal(true);
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while exchanging voucher. Please try again."
            );
        }
    };

    const handleHQExchange = async (
        voucherID: String,
        voucherPrice: number,
    ) => {
        try {
            // Call the voucher update quantity API
            const voucherPayload = {
                userID: user.id ? user.id : "1",
                quantity: 1,
                eventID: eventID,
            };
            await request(
                `/api/event_command/voucher/update_quantity/${voucherID}`,
                "put",
                voucherPayload
            );

            // Update items quantity
            const itemsPayload = {
                customerID: user.id,
                eventID: eventID,
                items: [
                    {
                        itemID: "1",
                        quantity: -voucherPrice,
                    },
                ],
            };
            await request("/api/game/customer-item", "post", itemsPayload);

            // Notification for successful exchange
            Alert.alert("Success", "Voucher exchanged successfully.", [
                {
                    text: "OK",
                    onPress: () => setRefresh(!refresh), // Toggle the refresh state to trigger useEffect
                },
            ]);
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while exchanging voucher. Please try again."
            );
        }
    };

    const goBack = () => {
        navigation.goBack();
    }


    const renderGameItem = ({ item }: { item: eventGameItemsInterface }) => (
        <Card containerStyle={styles.itemCard}>
            <Image
                source={{ uri: localhost + item.imageURL }}
                style={styles.itemImage}
            />
            <Card.Title>{item.name}</Card.Title>
            <Card.Divider />
            <Text style={styles.itemDetail}>Description: {item.description}</Text>
            <View style={styles.itemsQuantityContainer}>
                <Text
                    style={[
                        styles.itemQuantity,
                        { color: item.userOwnedQuantity < 6 ? "gray" : "green" },
                    ]}
                >
                    Owned: {item.userOwnedQuantity}
                </Text>
                <Button
                    title="Exchange"
                    buttonStyle={[
                        styles.exchangeButton,
                        { backgroundColor: item.userOwnedQuantity < 6 ? "gray" : "green" },
                    ]}
                    disabled={item.userOwnedQuantity < 6}
                    onPress={() => handleLacXiExchange(item.itemID)}
                />
            </View>
        </Card>
    );

    return (
        <>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 20,
                    width: "100%",
                    backgroundColor: "#f5f5f5",
                    paddingLeft: 20,
                    paddingRight: 20,
                    // paddingBottom: 10,
                    borderRadius: 5,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: COLORS.accent,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={goBack}
                >
                    <Icon name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    {gameID == "1" ? (
                        <>
                            <Card containerStyle={styles.card}>
                                <Card.Title style={styles.title}>
                                    HQ Trivia Exchange
                                </Card.Title>
                                <Card.Divider style={{ backgroundColor: "black" }} />
                                <Card containerStyle={styles.itemCard}>
                                    <Image
                                        source={{ uri: localhost + eventGameItems[0]?.imageURL }}
                                        style={styles.itemImage}
                                    />
                                    <Card.Title style={{ marginVertical: 10 }}>
                                        {eventGameItems[0]?.name}
                                    </Card.Title>
                                    <Card.Divider />
                                    <Text h3 style={styles.points}>
                                        {customerItems.length > 0
                                            ? customerItems[0]?.quantity
                                            : "..."}
                                    </Text>
                                </Card>
                                <Text style={styles.howToUseText}>
                                    How to use: 1 point = 1 VND
                                </Text>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card containerStyle={styles.card}>
                                <Card.Title style={styles.title}>
                                    Lac Xi Exchange
                                </Card.Title>
                                <Card.Divider style={{ backgroundColor: "black" }} />
                                <Text h4 style={{ textAlign: "center" }}>
                                    Items:
                                </Text>
                                <FlatList
                                    data={eventGameItems}
                                    renderItem={renderGameItem}
                                    keyExtractor={(item) => item.itemID}
                                    contentContainerStyle={styles.flatListContent}
                                    horizontal={true}
                                    style={styles.flatList}
                                    ItemSeparatorComponent={() => (
                                        <View style={styles.flatListItem} />
                                    )}
                                />
                                <Text style={styles.howToUseText}>
                                    How to use: 6 items = 1 random voucher
                                </Text>
                            </Card>
                        </>
                    )}
                    <Card containerStyle={styles.card}>
                        <Card.Title style={styles.title}>Available Vouchers</Card.Title>
                        <Card.Divider style={{ backgroundColor: "black" }} />
                        {eventVouchers.length === 0 ? (
                            <Text style={styles.noVouchers}>No available vouchers.</Text>
                        ) : (
                            eventVouchers.map((voucher, index) => {
                                const canExchange =
                                    voucher.price <= customerItems[0]?.quantity &&
                                    voucher.quantity > 0;
                                return (
                                    <Card key={voucher._id} containerStyle={styles.voucherCard}>
                                        {voucher.imageUrl && (
                                            <Image
                                                source={{ uri: localhost + voucher.imageUrl }}
                                                style={styles.voucherImage}
                                            />
                                        )}
                                        <Card.Title>{voucher.code}</Card.Title>
                                        <Card.Divider />
                                        <Text style={styles.voucherDetail}>
                                            Description: {voucher.description}
                                        </Text>
                                        <Text style={styles.voucherDetail}>
                                            Price: {voucher.price}
                                        </Text>
                                        <Text style={styles.voucherDetail}>
                                            Quantity: {voucher.quantity}
                                        </Text>
                                        <Text style={styles.voucherDetail}>
                                            Expired: {new Date(Number(voucher.expTime) - 7 * 3600 * 1000).toLocaleString()}
                                        </Text>
                                        {gameID == "1" && (
                                            <Button
                                                title="Exchange Voucher"
                                                buttonStyle={[
                                                    styles.button,
                                                    { backgroundColor: canExchange ? "green" : "red" },
                                                ]}
                                                disabled={!canExchange}
                                                onPress={() =>
                                                    handleHQExchange(voucher._id, voucher.price)
                                                }
                                                icon={
                                                    <Icon
                                                        name={canExchange ? "check-circle" : "times-circle"}
                                                        type="font-awesome"
                                                        color="white"
                                                        size={20}
                                                        iconStyle={{ marginRight: 10 }}
                                                    />
                                                }
                                            />
                                        )}
                                    </Card>
                                );
                            })
                        )}
                    </Card>
                </View>
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
                                    <Card.Divider style={{ backgroundColor: "black" }} />
                                    <Text style={styles.voucherDetail}>
                                        Description: {redeemedVouchers?.description}
                                    </Text>
                                    <Text style={styles.voucherDetail}>
                                        Price: {redeemedVouchers?.price}
                                    </Text>
                                    <Text style={styles.voucherDetail}>
                                        Expired:{" "}
                                        {redeemedVouchers?.expTime
                                            ? new Date(redeemedVouchers.expTime).toLocaleString()
                                            : "N/A"}
                                    </Text>
                                </Card>
                                <View style={styles.modalFooter}>
                                    <Button
                                        title="Close"
                                        buttonStyle={styles.closeButton}
                                        onPress={() => {
                                            setShowVoucherRedeemModal(false);
                                            setRefresh(!refresh);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: "lightblue",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
    },
    gameTitle: {
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
    },
    points: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: -10,
    },
    itemCard: {
        width: 200,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: "center", // this will center the card
    },
    itemImage: {
        width: "100%",
        aspectRatio: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "cover", // Ensures the image covers the whole area
        marginBottom: 6,
    },
    itemDetail: {
        fontSize: 14,
        marginVertical: 5,
    },
    itemQuantity: {
        fontSize: 14,
        marginVertical: 5,
    },
    itemsQuantityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    totalItemsText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    howToUseText: {
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 15,
    },
    itemInputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    // Exchange options modal
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden",
    },
    modalHeader: {
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalBody: {
        padding: 20,
        flexDirection: "column",
    },
    modalFooter: {
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        alignItems: "center",
    },
    closeButton: {
        backgroundColor: "red",
        borderRadius: 5,
    },
    exchangeButton: {
        borderRadius: 5,
        paddingVertical: 5,
    },
    exchangeOptionsContainer: {
        marginTop: 10,
    },
    exchangeOptionsText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    exchangeOptionButton: {
        marginBottom: 5,
        backgroundColor: "green",
        borderRadius: 5,
    },
    //
    voucherCard: {
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    voucherImage: {
        width: "100%",
        aspectRatio: 16 / 9, // Set the aspect ratio to 16:9
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "cover", // Ensures the image covers the whole area
        marginBottom: 15,
    },
    voucherDetail: {
        fontSize: 14,
        marginVertical: 5,
    },
    noVouchers: {
        fontSize: 16,
        textAlign: "center",
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
