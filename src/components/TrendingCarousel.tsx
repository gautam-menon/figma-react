import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
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
  onItemPress?: (item: CarouselItem) => void;
};

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({
  title = 'Trending',
  items,
  onItemPress,
}) => {
  const SIDE_PEEK = 42; // how much of the next/prev card is visible
  const ITEM_SPACING = 6;

  // card is narrower than screen, leaving space for peeks
  const CARD_WIDTH = width - SIDE_PEEK * 2;
  const STEP = CARD_WIDTH + ITEM_SPACING; // snapping distance

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);
  const currentIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDraggingRef = useRef(false);
  const isReadyRef = useRef(false);

  const startAuto = () => {
    if (!items || items.length <= 1) return;
    if (!isReadyRef.current) return;
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      if (isDraggingRef.current) return;
      const nextIndex = (currentIndexRef.current + 1) % items.length;
      if (listRef.current) {
        listRef.current.scrollToOffset({
          offset: nextIndex * STEP,
          animated: true,
        });
        currentIndexRef.current = nextIndex;
      }
    }, 3000);
  };

  const stopAuto = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // clean up on unmount or items change
    return () => {
      stopAuto();
    };
  }, [items.length]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>{title}</Text>
      <Animated.FlatList
        ref={r => {
          listRef.current = r;
        }}
        data={items}
        keyExtractor={item => item.id}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={STEP}
        snapToAlignment="start"
        contentContainerStyle={{
          paddingHorizontal: SIDE_PEEK,
        }}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        onContentSizeChange={() => {
          // Content laid out; allow auto-scroll to start
          if (!isReadyRef.current) {
            isReadyRef.current = true;
            startAuto();
          }
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onScrollBeginDrag={() => {
          isDraggingRef.current = true;
          stopAuto();
        }}
        onScrollEndDrag={() => {
          isDraggingRef.current = false;
          startAuto();
        }}
        onMomentumScrollEnd={e => {
          const x = e.nativeEvent.contentOffset.x;
          const index = Math.round(x / STEP);
          currentIndexRef.current = index;
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
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onItemPress && onItemPress(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.title}`}
            >
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

                    <View style={styles.subtitleRow}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.cardSubtitle}> 10:00 AM</Text>
                    </View>

                    <View style={styles.subtitleRow}>
                      <MaterialCommunityIcons
                        name="calendar-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.cardSubtitle}> 12 Sep 2025</Text>
                    </View>

                    <View style={styles.subtitleRow}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.cardSubtitle}> New Delhi, India</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  cardBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    padding: 0,
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
});

export default TrendingCarousel;
