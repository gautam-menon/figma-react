import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventsList, { EventItem } from '../components/EventsList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AllEvents'>;

export const AllEventsScreen: React.FC<Props> = ({ route }) => {
  const events = (route.params?.events as EventItem[]) || [];
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <EventsList title="" items={events} showSeeAll={false} variant="plain" titleIconSize={26} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backText: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
});

export default AllEventsScreen;


