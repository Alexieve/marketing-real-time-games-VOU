import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, LayoutChangeEvent, Image } from 'react-native';
import { Card } from '@rneui/themed';

const FavouriteScreen = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const renderCards = () => {
    const cards = [];
    for (let i = 1; i <= 10; i++) {
      cards.push(
        <Card key={i}>
          <Card.Title>Favourite {i}</Card.Title>
          <Card.Divider />
          <Image
            source={{ uri: 'https://placeimg.com/640/480/animals' }} // URL ảnh mẫu
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Some content for favourite {i}</Text>
        </Card>
      );
    }
    return cards;
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
  },
});

export default FavouriteScreen;
