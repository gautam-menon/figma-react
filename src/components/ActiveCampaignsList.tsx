import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';

export type CampaignItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type ActiveCampaignsListProps = {
  title?: string;
  items: CampaignItem[];
};

export const ActiveCampaignsList: React.FC<ActiveCampaignsListProps> = ({
  title = 'Active campaigns',
  items,
}) => {
  const ITEM_SIZE = 96; // square
  const ITEM_SPACING = 12;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_SIZE }}>
            <Image
              source={{ uri: item.imageUrl }}
              style={[styles.image, { width: ITEM_SIZE, height: ITEM_SIZE }]} />
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginRight: 8,
  },
  countBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  countText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '500',
  },
  image: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  itemTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 2,
  },
});

export default ActiveCampaignsList;
