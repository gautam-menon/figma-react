import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type HeaderProps = {
  onWalletPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onWalletPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brands</Text>
      <View style={styles.actions}>
        <TouchableOpacity accessibilityRole="button" onPress={onWalletPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.walletIcon}>👛</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={() => {}} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    fontSize: 22,
  },
  settingsButton: {
    marginLeft: 12,
  },
  settingsIcon: {
    fontSize: 22,
  },
});

export default Header;

