import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import TextHeading from './TextHeading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type EventItem = {
  id: string;
  imageUrl: string;
  name: string;
  date: string;
  location: string;
};

type EventsListProps = {
  title?: string;
  items: EventItem[];
  onSeeAllPress?: () => void;
  showSeeAll?: boolean;
  scrollEnabled?: boolean;
  variant?: 'default' | 'plain';
  titleIconSize?: number;
};

export const EventsList: React.FC<EventsListProps> = ({
  title = 'Events',
  items,
  onSeeAllPress,
  showSeeAll = true,
  scrollEnabled = false,
  variant = 'default',
  titleIconSize = 22,
}) => {
  const isPlain = variant === 'plain';

  const renderTile = (item: EventItem) => (
    <View key={item.id} style={styles.tile}>
      <Image source={{ uri: item.imageUrl }} style={styles.tileImage} />
      <View style={styles.tileContent}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="ticket-outline" size={titleIconSize} color="#111" />
          <Text style={styles.rowText} numberOfLines={1}> {item.name}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="calendar-outline" size={20} color="#555" />
          <Text style={styles.rowSubText} numberOfLines={1}> {item.date}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#555" />
          <Text style={styles.rowSubText} numberOfLines={1}> {item.location}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {!isPlain && <TextHeading style={styles.heading}>{title}</TextHeading>}
      <View style={isPlain ? undefined : styles.sectionCard}>
        {scrollEnabled ? (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            scrollEnabled
            contentContainerStyle={isPlain ? { paddingHorizontal: 16, paddingBottom: 24 } : { paddingBottom: 24 }}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item }) => renderTile(item)}
          />
        ) : (
          <View style={isPlain ? { paddingHorizontal: 16 } : undefined}>
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {renderTile(item)}
                {idx < items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
      {showSeeAll && !isPlain && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <View style={styles.seeAllButtonRow}>
            <Text style={styles.seeAllButtonText}>See all</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: '#FCFCFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 10,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 14,
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 6,
  },
  tileImage: {
    width: 80,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tileContent: {
    flex: 1,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  rowSubText: {
    fontSize: 14,
    color: '#555555',
  },
  seeAllRow: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    marginRight: 2,
  },
  seeAllButton: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  seeAllButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 2,
  },
});

export default EventsList;
