/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, TextInput } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen.tsx';
import AllEventsScreen from './src/screens/AllEventsScreen.tsx';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  AllEvents: { events: any[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Global font family
  if ((Text as any).defaultProps == null) (Text as any).defaultProps = {} as any;
  (Text as any).defaultProps.style = [
    (Text as any).defaultProps.style,
    { fontFamily: 'DMSerifText-Regular' },
  ];
  if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {} as any;
  (TextInput as any).defaultProps.style = [
    (TextInput as any).defaultProps.style,
    { fontFamily: 'DMSerifText-Regular' },
  ];

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AllEvents" component={AllEventsScreen} options={{ title: 'All Events', headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
