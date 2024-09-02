import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { COLORS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchOwnItems } from "../../thunks/shakeThunk";

const MyItems = ({
  customerID,
  eventID,
}: {
  customerID: any;
  eventID: string;
}) => {
  const dispatch = useAppDispatch();
  const { ownItems, items } = useAppSelector((state: any) => state.shake);
  
  useEffect(() => {
    dispatch(fetchOwnItems({ customerID, eventID }));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Items</Text>
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.itemsContainer}>
          {items.map((item: any, index: number) => {
            // Find the corresponding item in ownItems
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
                  {item.name}   x {quantity}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
});

export default MyItems;
