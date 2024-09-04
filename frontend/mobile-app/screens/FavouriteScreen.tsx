import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, LayoutChangeEvent, Image, TouchableOpacity } from 'react-native';
import { Card } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import localhost from '../url.config';

const FavouriteScreen = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const screenHeight = Dimensions.get('window').height;

  const { user } = useSelector((state: any) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      try {
        const favResponse = await fetch(`${localhost}/api/event_query/get_events_user_favorite/${user.id}`);
        const data = await favResponse.json();

        const favEvents = Array.isArray(data) ? data.map((event: any) => ({
          id: event._id,
          name: event.name,
          description: event.description,
          imageUrl: `${localhost}${event.imageUrl}`, // Complete the URL
        })) : [];

        setFavoriteEvents(favEvents);
      } catch (error) {
        console.error('Failed to fetch favorite events:', error);
      }
    };

    fetchFavoriteEvents();
  }, [user.id]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const renderCards = () => {
    if (favoriteEvents.length === 0) {
      return <Text style={styles.noEventsText}>Không có sự kiện yêu thích nào</Text>;
    }

    return favoriteEvents.map((event, index) => (
      <TouchableOpacity key={event.id || index} onPress={() => navigation.navigate('EventDetail', { id: event.id })}>
        <View style={styles.cardWrapper}>
          <Card containerStyle={styles.cardContainer}>
            <Card.Title>
              <Text>{event.name}</Text>
            </Card.Title>
            <Card.Divider />
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{event.description}</Text>
          </Card>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sự kiện yêu thích</Text>
      {contentHeight > screenHeight ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderCards()}
        </ScrollView>
      ) : (
        <View style={styles.scrollContainer} onLayout={handleLayout}>
          {renderCards()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Black color for the title
    textAlign: 'center',
    marginVertical: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 50,
  },
  cardWrapper: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
  },
  cardContainer: {
    borderRadius: 15,
    elevation: 3,
    marginHorizontal: 0,
    backgroundColor: '#ffffff',
  },
  cardImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default FavouriteScreen;
