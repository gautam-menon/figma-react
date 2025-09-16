import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_placeholder.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.title}>Custom</Text>
        <Text style={styles.subtitle}>Your custom tab content goes here</Text>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#444444',
  },
});

export default CustomScreen;
