import { View, Text, StyleSheet, Dimensions, Image, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export type CarouselItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type TrendingCarouselProps = {
  title?: string;
  items: CarouselItem[];
};

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ title = 'Trending', items }) => {
  const SIDE_PEEK = 42; // how much of the next/prev card is visible
  const ITEM_SPACING = 6;

  // 🔑 card is narrower than screen, leaving space for peeks
  const CARD_WIDTH = width - SIDE_PEEK * 2;
  const STEP = CARD_WIDTH + ITEM_SPACING; // snapping distance

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>{title}</Text>
      <Animated.FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={STEP}
        snapToAlignment="start" // important: aligns with left edge of card
        contentContainerStyle={{
          paddingHorizontal: SIDE_PEEK, // lets first/last peek correctly
        }}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const index = Math.round(x / STEP);
          setCurrentIndex(index);
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * STEP,
            index * STEP,
            (index + 1) * STEP,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.94, 1.03, 0.94],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.card,
                { width: CARD_WIDTH, transform: [{ scale }] },
              ]}
            >
              <View style={styles.cardBox}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.textBox}>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  {/* Clock subtitle */}
                  <View style={styles.subtitleRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                    <Text style={styles.cardSubtitle}> 10:00 AM</Text>
                  </View>

                  {/* Calendar subtitle */}
                  <View style={styles.subtitleRow}>
                    <MaterialCommunityIcons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.cardSubtitle}> 12 Sep 2025</Text>
                  </View>

                  {/* Location subtitle */}
                  <View style={styles.subtitleRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
                    <Text style={styles.cardSubtitle}> New Delhi, India</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          );

        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },

  wrapper: {
    marginTop: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    // borderRadius: 18,
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    // // Android elevation
    elevation: 6,
  },
  cardBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    padding: 0, // remove padding so image fills top
  },
  image: {
    width: '100%',
    height: 260,
    backgroundColor: '#FFFFFF',
  },
  textBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    marginTop: 0,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    overflow: 'visible',
  },
  // cardSubtitle: {
  //   marginTop: 6,
  //   fontSize: 14,
  //   color: '#666666',
  // },
});


export default TrendingCarousel;
