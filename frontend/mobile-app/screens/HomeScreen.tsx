import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Icon } from '@rneui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState, useNavigation } from '@react-navigation/native';
import { request } from '../utils/request';

import EventListScreen from './EventListScreen';
import EventDetailScreen from './EventDetailScreen';
import ExchangeVoucherScreen from './ExchangeVoucherScreen';
import SearchScreen from './SearchScreen';
import FavouriteScreen from './FavouriteScreen';
import VoucherScreen from './VoucherScreen';
import Menu from './Menu';
import { useSelector } from 'react-redux';

import { RootStackParamList } from './RootStackParamList'; // Import the type you just created

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const EventStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EventList" component={EventListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ExchangeVoucher" component={ExchangeVoucherScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

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
      <Header
        centerComponent={{ text: headerTitle, style: styles.headerTitle }}
        rightComponent={{ icon: 'menu', color: '#fff', onPress: handleMenuToggle }}
        containerStyle={styles.headerContainer}
      />

      <Menu isVisible={isMenuVisible} onClose={handleMenuToggle} onLogout={handleLogout} />

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
        <Tab.Screen name="Event" component={EventStack} />
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