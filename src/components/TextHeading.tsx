import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/tokens';

export const TextHeading: React.FC<TextProps> = ({ style, children, ...rest }) => {
  return (
    <Text {...rest} style={[styles.heading, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: typography.headingSize,
    fontWeight: '700',
    color: colors.text,
    fontFamily: typography.headingFontFamily,
  },
});

export default TextHeading;


