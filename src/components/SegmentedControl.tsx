import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

type SegmentedControlProps = {
  segments: string[];
  currentIndex: number;
  onChange: (index: number) => void;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ segments, currentIndex, onChange }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const segmentWidth = useMemo(() => {
    const horizontalPadding = 8; // padding: 4 on each side from container
    return segments.length > 0 ? (Math.max(containerWidth - horizontalPadding, 0) / segments.length) : 0;
  }, [containerWidth, segments.length]);

  useEffect(() => {
    if (segmentWidth <= 0) return;
    const toValue = segmentWidth * currentIndex;
    Animated.timing(translateX, {
      toValue,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [currentIndex, segmentWidth, translateX]);

  return (
    <View
      style={styles.container}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Sliding indicator */}
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: segmentWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {segments.map((label, index) => {
        const isActive = index === currentIndex;
        return (
          <TouchableOpacity
            key={label}
            style={styles.segment}
            onPress={() => onChange(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 4,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  segmentText: {
    color: '#666666',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#000000',
  },
});

export default SegmentedControl;

