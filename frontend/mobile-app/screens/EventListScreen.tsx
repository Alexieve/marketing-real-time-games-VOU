import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, LayoutChangeEvent, Image, Button } from 'react-native';
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList'; // Import the type you just created
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const EventListScreen = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const events = [
    {
      _id: '66d530367803a0a1c26e6aef',
      name: '213',
      imageUrl: 'http://192.168.68.101/images/event/66d530367803a0a1c26e6aef7211140162d241e4e5fcfee5f7ab3d9c24dbb7fc8efecf264946af0be5fe31e3.png',
      description: '123',
      startTime: '2024-09-25T10:24:00.000Z',
      endTime: '2024-10-03T10:24:00.000Z',
      brand: '1',
      game: {
        gameID: '2',
        playTurn: 123
      },
    },
    // Add more events as needed
  ];

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const renderCards = () => {
    return events.map(event => (
      <Card key={event._id}>
        <Card.Title>{event.name}</Card.Title>
        <Card.Divider />
        <Image source={{ uri: event.imageUrl }} style={styles.cardImage} />
        <Text style={styles.cardText}>Description: {event.description}</Text>
        <Text style={styles.cardText}>StartTime: {event.startTime}</Text>
        <Text style={styles.cardText}>EndTime: {event.endTime}</Text>
        <Text style={styles.cardText}>Brand: {event.brand}</Text>
        <Text style={styles.cardText}>Game: {event.game.gameID}</Text>
        <Button title="View Details" onPress={() => navigation.navigate('EventDetail', { event: event })} />
      </Card>
    ));
  };

  return (
    <View style={styles.container}>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default EventListScreen;