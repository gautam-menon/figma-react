import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import SegmentedControl from '../components/SegmentedControl';
import TrendingCarousel, { CarouselItem } from '../components/TrendingCarousel';
import ActiveCampaignsList, { CampaignItem } from '../components/ActiveCampaignsList';
import AssignedTasksGrid, { AssignedTaskItem } from '../components/AssignedTasksGrid';

const SEGMENTS = ['Explore', 'My Tasks', 'Insights'];

const SAMPLE_ITEMS: CarouselItem[] = [
  {
    id: '1',
    title: 'Streetwear Essentials',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png'
  },
  {
    id: '2',
    title: 'Minimal Workspaces',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png'
  },
  {
    id: '3',
    title: 'Summer Collections',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png'
  },
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

export const HomeScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Header />
          <SegmentedControl segments={SEGMENTS} currentIndex={selectedIndex} onChange={setSelectedIndex} />
          <TrendingCarousel title="Trending" items={SAMPLE_ITEMS} />
          <ActiveCampaignsList title="Active campaigns" items={CAMPAIGNS} />
          <AssignedTasksGrid title="Assigned tasks" items={ASSIGNED} />
        </View>
      </ScrollView>
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
  },
});

export default HomeScreen;

