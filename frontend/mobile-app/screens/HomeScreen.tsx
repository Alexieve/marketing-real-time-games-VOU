import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Icon } from '@rneui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState, useNavigation } from '@react-navigation/native';
import { request } from '../utils/request';

import EventScreen from './EventScreen';
import SearchScreen from './SearchScreen';
import FavouriteScreen from './FavouriteScreen';
import VoucherScreen from './VoucherScreen';
import Menu from './Menu';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [headerTitle, setHeaderTitle] = useState('Event');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigationState = useNavigationState(state => state);
  const navigation = useNavigation(); 
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const currentRouteName = navigationState.routes[navigationState.index].name;
    setHeaderTitle(currentRouteName);
  }, [navigationState]);

  const handleLogout = async () => {
    setIsMenuVisible(false);
    await request(`/api/auth/logout`, 'post', null, token);
    navigation.navigate('Login' as never); 
  };

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <Header
        centerComponent={{ text: headerTitle, style: styles.headerTitle }}
        rightComponent={{ icon: 'menu', color: '#fff', onPress: handleMenuToggle }}
        containerStyle={styles.headerContainer}
      />

      {/* Menu */}
      <Menu isVisible={isMenuVisible} onClose={handleMenuToggle} onLogout={handleLogout} />

      {/* Bottom Navigation với nội dung cuộn */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            if (route.name === 'Event') {
              iconName = 'event';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'Favourite') {
              iconName = 'favorite';
            } else if (route.name === 'Voucher') {
              iconName = 'card-giftcard';
            }
            return <Icon name={iconName} type="material" color={color} size={size} />;
          },
          tabBarActiveTintColor: '#2e64e5',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Event" component={EventScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Favourite" component={FavouriteScreen} />
        <Tab.Screen name="Voucher" component={VoucherScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#2e64e5',
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
