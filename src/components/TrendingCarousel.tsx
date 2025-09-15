import { View, Text, StyleSheet, Dimensions, Image, Animated, TouchableOpacity, Modal, Pressable, PanResponder, Platform } from 'react-native';
import TextHeading from './TextHeading';
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
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(40)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        return Math.abs(gesture.dy) > 6; // start on vertical drag
      },
      onPanResponderMove: Animated.event([null, { dy: dragY }], { useNativeDriver: false }),
      onPanResponderRelease: (_evt, gesture) => {
        const dragDistance = Math.max(gesture.dy, 0);
        const shouldClose = dragDistance > 140 || gesture.vy > 0.85;
        if (shouldClose) {
          // animate down and close
          Animated.parallel([
            Animated.timing(popupOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
              toValue: 40,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            dragY.setValue(0);
            setModalVisible(false);
          });
        } else {
          // snap back
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 0,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => {
        Animated.spring(dragY, { toValue: 0, useNativeDriver: false, bounciness: 0 }).start();
      },
    })
  ).current;

  useEffect(() => {
    if (modalVisible) {
      popupOpacity.setValue(0);
      sheetTranslateY.setValue(40);
      Animated.parallel([
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, popupOpacity, sheetTranslateY]);

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 40,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  // Autoplay: advance carousel periodically, pause while sheet is open
  useEffect(() => {
    if (!items || items.length <= 1 || modalVisible) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    autoplayTimerRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      const nextOffset = nextIndex * STEP;
      if (listRef.current?.scrollToOffset) {
        listRef.current.scrollToOffset({ offset: nextOffset, animated: true });
      }
    }, 3500);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [currentIndex, items, modalVisible, STEP]);

  return (
    <View style={styles.wrapper}>
      <TextHeading style={styles.heading}>{title}</TextHeading>
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
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
                accessibilityRole="button"
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
              </TouchableOpacity>
            </Animated.View>
          );

        }}
      />
      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={Platform.OS !== 'ios'}
        animationType={Platform.OS === 'ios' ? 'slide' : 'none'}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
        onRequestClose={closePopup}
      >
        {Platform.OS === 'ios' ? (
          selectedItem ? (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
              <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} resizeMode="cover" />
              <View style={[styles.modalContent, styles.sheetContentPadding]}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <View style={[styles.subtitleRow, { marginTop: 8 }]}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#555" />
                  <Text style={styles.modalSubtitle}> 10:00 AM</Text>
                </View>
                <View style={styles.subtitleRow}>
                  <MaterialCommunityIcons name="calendar-outline" size={18} color="#555" />
                  <Text style={styles.modalSubtitle}> 12 Sep 2025</Text>
                </View>
                <View style={styles.subtitleRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color="#555" />
                  <Text style={styles.modalSubtitle}> New Delhi, India</Text>
                </View>
                <Text style={styles.modalDescription}>
                  Discover more about this event. High-quality imagery and concise details provide a quick overview.
                </Text>
                <View style={styles.okSpacer} />
                <TouchableOpacity onPress={closePopup} style={styles.okButton} accessibilityRole="button">
                  <Text style={styles.okButtonText}>Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        ) : (
          <View style={[styles.modalBackdrop, { justifyContent: 'flex-end', alignItems: 'stretch', padding: 0 }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closePopup} />
            {selectedItem && (
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.sheetCard,
                  {
                    opacity: popupOpacity,
                    transform: [
                      {
                        translateY: Animated.add(sheetTranslateY, dragY.interpolate({
                          inputRange: [-200, 0, 300],
                          outputRange: [0, 0, 300],
                          extrapolate: 'clamp',
                        })),
                      },
                    ],
                  },
                ]}
              >
                <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} resizeMode="cover" />
                <View style={[styles.modalContent, styles.sheetContentPadding]}>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <View style={[styles.subtitleRow, { marginTop: 8 }]}>
                    <MaterialCommunityIcons name="clock-outline" size={18} color="#555" />
                    <Text style={styles.modalSubtitle}> 10:00 AM</Text>
                  </View>
                  <View style={styles.subtitleRow}>
                    <MaterialCommunityIcons name="calendar-outline" size={18} color="#555" />
                    <Text style={styles.modalSubtitle}> 12 Sep 2025</Text>
                  </View>
                  <View style={styles.subtitleRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={18} color="#555" />
                    <Text style={styles.modalSubtitle}> New Delhi, India</Text>
                  </View>
                  <Text style={styles.modalDescription}>
                    Discover more about this event. High-quality imagery and concise details provide a quick overview.
                  </Text>
                  <View style={styles.okSpacer} />
                  <TouchableOpacity onPress={closePopup} style={styles.okButton} accessibilityRole="button">
                    <Text style={styles.okButtonText}>Okay</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={closePopup}
                  style={styles.modalClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <MaterialCommunityIcons name="close" size={22} color="#111" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}
      </Modal>
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
    marginTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 12,
    fontFamily: 'DMSerifText-Regular',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#FFF',
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  sheetContentPadding: {
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#555',
    marginLeft: 6,
  },
  modalDescription: {
    marginTop: 12,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  okButton: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  okSpacer: {
    flex: 1,
    minHeight: 8,
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: '85%',
  },
  // removed handle per request
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
