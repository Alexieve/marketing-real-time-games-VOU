import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, FlatList, View, Text, StyleSheet, Image, ListRenderItem, NativeSyntheticEvent, NativeScrollEvent, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from '@rneui/themed';
import { useSelector } from 'react-redux';
import localhost from '../url.config';
import { useRoute, useNavigation } from '@react-navigation/native';


type EventItem = { id: string; name: string; description: string; imageUrl: string };

const EventScreen = () => {
  const [ongoingEvents, setOngoingEvents] = useState<EventItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<EventItem[]>([]); // Replace with your logic for favorite events

  const { user } = useSelector((state: any) => state.auth);

  const navigation = useNavigation();
  // console.log(user);

  const screenWidth = Dimensions.get('window').width;

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${localhost}/api/event_query/get_events_upcoming/`);
        const data = await response.json();
        
        // Assuming all fetched events are upcoming events
        const UpcomingEvents = data.map((event: any) => ({
          id: event._id,
          name: event.name,
          description: event.description,
          imageUrl: `${localhost}${event.imageUrl}`, // Complete the URL
        }));

        const response1 = await fetch(`${localhost}/api/event_query/get_events_ongoing/`);
        const data1 = await response1.json();
        let OngoingEvents = [];

        if(Object.keys(data1).length){
          OngoingEvents = data1.map((event: any) => ({
            id: event._id,
            name: event.name,
            description: event.description,
            imageUrl: `${localhost}${event.imageUrl}`, // Complete the URL
          }));
        }
        else{
          // console.log("No ongoing events!");
        }

        const favResponse = await fetch(`${localhost}/api/event_query/get_events_user_favorite/${user.id}`);
        const data2 = await favResponse.json();
        let favEvents = [];

        if(Object.keys(data2).length){
          favEvents = data2.map((event: any) => ({
            id: event._id,
            name: event.name,
            description: event.description,
            imageUrl: `${localhost}${event.imageUrl}`, // Complete the URL
          }));
        }
        else{
          // console.log("No fav events!");
        }

        setUpcomingEvents(UpcomingEvents);

        // Set ongoingEvents or favoriteEvents based on your logic
        // For demonstration purposes, let's assume they are the same
        setOngoingEvents(OngoingEvents); 
        setFavoriteEvents(favEvents);

      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Duplicate events for infinite scroll
  const duplicatedOngoingEvents = [...ongoingEvents, ...ongoingEvents];
  const duplicatedUpcomingEvents = [...upcomingEvents, ...upcomingEvents];
  const duplicatedFavoriteEvents = [...favoriteEvents, ...favoriteEvents];

  // Refs for each FlatList
  const ongoingRef = useRef<FlatList<EventItem>>(null);
  const upcomingRef = useRef<FlatList<EventItem>>(null);
  const favoriteRef = useRef<FlatList<EventItem>>(null);

  const renderItem: ListRenderItem<EventItem> = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { id: item.id })}>

      <View style={styles.cardWrapper}>
        <Card key={item.id} containerStyle={styles.cardContainer}>
          <Card.Title>{item.name}</Card.Title>
          <Card.Divider />
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <Text style={styles.cardText}>{item.description}</Text>
        </Card>
      </View>
    </TouchableOpacity>
  );

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    events: EventItem[],
    listRef: React.RefObject<FlatList<EventItem>>
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const itemWidth = contentWidth / events.length;

    if (scrollPosition >= itemWidth * (events.length / 2)) {
      listRef.current?.scrollToOffset({
        offset: scrollPosition - itemWidth * (events.length / 2),
        animated: false,
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Sự kiện đang diễn ra</Text>
      {ongoingEvents.length > 0 ? (
        <FlatList
          ref={ongoingRef}
          data={[...ongoingEvents, ...ongoingEvents]}  // Duplicate for infinite scroll
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={(event) => handleScroll(event, ongoingEvents, ongoingRef)}
          scrollEventThrottle={16}
          snapToInterval={screenWidth}
          decelerationRate="fast"
        />
      ) : (
        <Text style={styles.noEventsText}>Không có sự kiện nào đang diễn ra</Text>
      )}

      <Text style={styles.sectionTitle}>Sự kiện sắp diễn ra</Text>
      {upcomingEvents.length > 0 ? (
        <FlatList
          ref={upcomingRef}
          data={[...upcomingEvents, ...upcomingEvents]}  // Duplicate for infinite scroll
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={(event) => handleScroll(event, upcomingEvents, upcomingRef)}
          scrollEventThrottle={16}
          snapToInterval={screenWidth}
          decelerationRate="fast"
        />
      ) : (
        <Text style={styles.noEventsText}>Không có sự kiện nào sắp diễn ra</Text>
      )}

      <Text style={styles.sectionTitle}>Sự kiện yêu thích</Text>
      {favoriteEvents.length > 0 ? (
        <FlatList
          ref={favoriteRef}
          data={[...favoriteEvents, ...favoriteEvents]}  // Duplicate for infinite scroll
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={(event) => handleScroll(event, favoriteEvents, favoriteRef)}
          scrollEventThrottle={16}
          snapToInterval={screenWidth}
          decelerationRate="fast"
        />
      ) : (
        <Text style={styles.noEventsText}>Không có sự kiện yêu thích nào</Text>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    paddingTop: 20,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
    color: '#333',
  },
  scrollContainer: {
    alignItems: 'center',
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
  bottomSpacer: {
    height: 50,
  },
  noEventsText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
});


export default EventScreen;
