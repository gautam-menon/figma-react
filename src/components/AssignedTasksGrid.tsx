import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import TextHeading from './TextHeading';

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
  const [selectedItem, setSelectedItem] = useState<AssignedTaskItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupScale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (modalVisible) {
      popupOpacity.setValue(0);
      popupScale.setValue(0.96);
      Animated.parallel([
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(popupScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, popupOpacity, popupScale]);

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupScale, {
        toValue: 0.96,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.wrapper}>
      <TextHeading style={styles.heading}>{title}</TextHeading>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: H_PADDING, marginBottom: GAP }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
            style={[styles.card, { width: CARD_WIDTH }]}
            accessibilityRole="button"
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.textBox}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closePopup}
      >
        <Pressable style={styles.modalBackdrop} onPress={closePopup}>
          <Animated.View style={[styles.modalCard, { opacity: popupOpacity, transform: [{ scale: popupScale }] }]}>
            {selectedItem && (
              <View style={styles.modalBox}>
                <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} resizeMode="cover" />
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedItem.subtitle}</Text>
                  <TouchableOpacity onPress={closePopup} style={styles.okButton} accessibilityRole="button">
                    <Text style={styles.okButtonText}>Okay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
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
    paddingHorizontal: H_PADDING,
    marginBottom: 12,
    fontFamily: 'DMSerifText-Regular',
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
    height: 220,
    backgroundColor: '#FFF',
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
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
});

export default AssignedTasksGrid;


