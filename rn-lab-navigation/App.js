import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/Tabnavigator';

export default function App() {
  return (

    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
