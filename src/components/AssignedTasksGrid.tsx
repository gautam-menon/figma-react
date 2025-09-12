import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');
const H_PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - H_PADDING * 2 - GAP) / 2; // 2 columns

export type AssignedTaskItem = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
};

type AssignedTasksGridProps = {
  title?: string;
  items: AssignedTaskItem[];
};

export const AssignedTasksGrid: React.FC<AssignedTasksGridProps> = ({ title = 'Assigned tasks', items }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>{title}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: H_PADDING, marginBottom: GAP }}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: CARD_WIDTH }]}> 
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.textBox}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: H_PADDING,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFF',
  },
  textBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#666666',
  },
});

export default AssignedTasksGrid;


