import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, Button, Overlay } from "@rneui/themed";
import { request } from "../utils/request";
import axios from "axios";
import localhost from "../url.config";
import { useSelector } from "react-redux";

const Menu = ({
  isVisible,
  onClose,
  onLogout,
}: {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const [username, setUsername] = useState(user.name);

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={styles.menuContainer}
    >
      <View style={styles.menuContent}>
        <Avatar
          rounded
          size="large"
          source={{ uri: "https://randomuser.me/api/portraits/men/41.jpg" }} // Avatar mẫu
        />
        <Text style={styles.userName}>{username}</Text>
        <Button
          title="Logout"
          onPress={onLogout}
          buttonStyle={styles.logoutButton}
        />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  menuContent: {
    alignItems: "center",
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#e53935",
  },
});

export default Menu;
