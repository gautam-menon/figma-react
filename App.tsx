/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen.tsx';
import AllEventsScreen from './src/screens/AllEventsScreen.tsx';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CustomScreen from './src/screens/CustomScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type RootStackParamList = {
  Home: undefined;
  AllEvents: { events: any[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllEvents"
        component={AllEventsScreen}
        options={{ title: 'All Events', headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Global font family
  if ((Text as any).defaultProps == null)
    (Text as any).defaultProps = {} as any;
  (Text as any).defaultProps.style = [
    (Text as any).defaultProps.style,
    { fontFamily: 'DMSerifText-Regular' },
  ];
  if ((TextInput as any).defaultProps == null)
    (TextInput as any).defaultProps = {} as any;
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
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#111827',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: '#FFFFFF', height: 70 },
            tabBarItemStyle: {
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 6,
            },
            tabBarIcon: ({ color, size, focused }) => {
              const routeName = route.name;
              if (routeName === 'HomeTab') {
                const icon = focused ? 'home-variant' : 'home-variant-outline';
                return (
                  <MaterialCommunityIcons
                    name={icon}
                    size={size}
                    color={color}
                  />
                );
              }
              if (routeName === 'Custom') {
                const icon = focused
                  ? 'star-four-points'
                  : 'star-four-points-outline';
                return (
                  <MaterialCommunityIcons
                    name={icon}
                    size={size}
                    color={color}
                  />
                );
              }
              if (routeName === 'Search') {
                const icon = 'magnify';
                return (
                  <MaterialCommunityIcons
                    name={icon}
                    size={size}
                    color={color}
                  />
                );
              }
              if (routeName === 'Profile') {
                const icon = focused ? 'account' : 'account-outline';
                return (
                  <MaterialCommunityIcons
                    name={icon}
                    size={size}
                    color={color}
                  />
                );
              }
              return (
                <MaterialCommunityIcons
                  name="circle"
                  size={size}
                  color={color}
                />
              );
            },
          })}
        >
          <Tab.Screen
            name="HomeTab"
            component={HomeStack}
            options={{ title: 'Home' }}
          />
          <Tab.Screen name="Custom" component={CustomScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
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
