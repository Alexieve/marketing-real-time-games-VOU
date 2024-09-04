import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, LayoutChangeEvent, Image, TouchableOpacity } from 'react-native';
import { Card, SearchBar } from '@rneui/themed';
import localhost from '../url.config';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const screenHeight = Dimensions.get('window').height;

  const navigation = useNavigation();

  // Function to fetch data from API
  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(`${localhost}/api/event_query/search?query=${query}`);
      const data = await response.json();

      let searchEvent = [];
      if(Object.keys(data).length) {
        searchEvent = data.map((event: any) => ({
          id: event._id,
          name: event.name,
          description: event.description,
          imageUrl: `${localhost}${event.imageUrl}`, // Complete URL for images
        }));
      }
      setSearchResults(searchEvent);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    fetchSearchResults('');
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const renderCards = () => {
    if (searchResults.length === 0) {
      return <Text style={styles.noResultsText}>Không có kết quả tìm kiếm nào</Text>;
    }

    return searchResults.map((event, index) => (
      <TouchableOpacity
        key={event.id || index}
        onPress={() => navigation.navigate('EventDetail', { id: event.id })}
      >
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
      <SearchBar
        placeholder="Search for events..."
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        placeholderTextColor="#666"
      />

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
  searchBarContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    color: '#333',
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
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default SearchScreen;
