import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button, Overlay } from '@rneui/themed';

const Menu = ({ isVisible, onClose, onLogout }: 
    { isVisible: boolean, onClose: () => void, onLogout: () => void }) => {
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
          source={{ uri: 'https://randomuser.me/api/portraits/men/41.jpg' }} // Avatar mẫu
        />
        <Text style={styles.userName}>John Doe</Text>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  menuContent: {
    alignItems: 'center',
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e53935',
  },
});

export default Menu;
