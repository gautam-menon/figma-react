import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Animated, Easing, Image, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import SegmentedControl from '../components/SegmentedControl';
import TrendingCarousel, { CarouselItem } from '../components/TrendingCarousel';
import ActiveCampaignsList, { CampaignItem } from '../components/ActiveCampaignsList';
import AssignedTasksGrid, { AssignedTaskItem } from '../components/AssignedTasksGrid';
import EventsList, { EventItem } from '../components/EventsList';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const SEGMENTS = ['Explore', 'My Tasks', 'Insights'];

const SAMPLE_ITEMS: CarouselItem[] = [
  { id: '1', title: 'Streetwear Essentials', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png' },
  { id: '2', title: 'Minimal Workspaces', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png' },
  { id: '3', title: 'Summer Collections', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png' },
];

const CAMPAIGNS: CampaignItem[] = [
  { id: 'c1', title: 'Sneakers', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'c2', title: 'Accessories', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'c3', title: 'Skincare', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'c4', title: 'Outdoor', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
];

const ASSIGNED: AssignedTaskItem[] = [
  { id: 'a1', title: 'Lookbook Shoot', subtitle: 'Due tomorrow', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'a2', title: 'UGC Edits', subtitle: '2 days left', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'a3', title: 'CTA Variants', subtitle: 'Next week', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'a4', title: 'Email Set', subtitle: 'Blocked', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'a5', title: 'Banner Revamp', subtitle: 'Review', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
  { id: 'a6', title: 'SEO Audit', subtitle: 'New', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/150px-Image_created_with_a_mobile_phone.png' },
];

const EVENTS: EventItem[] = [
  { id: 'e1', name: 'Brand Summit', date: '15 Oct 2025', location: 'Mumbai, India', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/120px-Image_created_with_a_mobile_phone.png' },
  { id: 'e2', name: 'Creator Meetup', date: '22 Oct 2025', location: 'Bengaluru, India', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/120px-Image_created_with_a_mobile_phone.png' },
  { id: 'e3', name: 'Winter Launch', date: '01 Nov 2025', location: 'Delhi, India', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/120px-Image_created_with_a_mobile_phone.png' },
  { id: 'e4', name: 'UGC Workshop', date: '12 Nov 2025', location: 'Remote', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/120px-Image_created_with_a_mobile_phone.png' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);

  useEffect(() => {
    // Animate content in on segment change
    contentOpacity.setValue(0);
    contentTranslateY.setValue(8);
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedIndex, contentOpacity, contentTranslateY]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Header />
          <SegmentedControl segments={SEGMENTS} currentIndex={selectedIndex} onChange={(i) => { setSelectedIndex(i); }} />
          <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
            {selectedIndex === 0 ? (
              <>
                <TrendingCarousel title="Trending" items={SAMPLE_ITEMS} onItemPress={(item) => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }} />
                <ActiveCampaignsList title="Active campaigns" items={CAMPAIGNS} />
                <AssignedTasksGrid title="Assigned tasks" items={ASSIGNED} />
                <EventsList title="Events" items={EVENTS} onSeeAllPress={() => {
                  navigation.navigate('AllEvents', { events: EVENTS });
                }} />
              </>
            ) : (
              <View style={styles.centerContent}>
                <Text style={styles.selectedText}>{SEGMENTS[selectedIndex]}</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)} accessibilityRole="button">
                  <Text style={styles.modalButtonText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  selectedText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalButton: {
    margin: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;
