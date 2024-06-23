import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './components/Theme';
import ListScreen from './components/ListScreen';
import MapScreen from './components/MapScreen';
import SettingScreen from './components/SettingScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name='MainTabs' component={MainTabs} />
          <Stack.Screen name='SingleMapScreen' options={{ title: "Detail" }} component={MapScreen} />
        </Stack.Navigator>
        {/* <MainTabs /> */}
      </NavigationContainer>
    </ThemeProvider>
  );
};