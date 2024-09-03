import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchOwnItems } from "../../thunks/shakeThunk";
import GiftItemModal from "./GiftItemModal"; // Import the new GiftModal component

const MyItems = ({
  customerID,
  eventID,
}: {
  customerID: any;
  eventID: string;
}) => {
  const dispatch = useAppDispatch();
  const { ownItems, items } = useAppSelector((state: any) => state.shake);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchOwnItems({ customerID, eventID }));
  }, []);

  const handleGiftPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Items</Text>
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.itemsContainer}>
          {items.map((item: any, index: number) => {
            const ownedItem = ownItems.find(
              (ownItem: any) => ownItem.itemID === item.itemID
            );
            const quantity = ownedItem ? ownedItem.quantity : 0;

            return (
              <View key={index} style={styles.itemWrapper}>
                <Image
                  source={require("../../assets/images/item.png")}
                  style={styles.itemImagePlaceholder}
                  resizeMode={"contain"}
                />
                <Text style={styles.itemText}>
                  {item.name} x {quantity}
                </Text>
                <TouchableOpacity style={styles.myItemsButton} onPress={() => handleGiftPress(item)}>
                  <Text style={styles.myItemsText}>Gift</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {selectedItem && (
        <GiftItemModal
          customerID={customerID}
          eventID={eventID}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedItem={selectedItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  itemWrapper: {
    alignItems: "center",
    width: 150,
    marginBottom: 20,
  },
  itemImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 10,
    textAlign: "center",
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
});

export default MyItems;
