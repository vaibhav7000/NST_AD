import { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "./screens/ChatScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ConversationScreen from "./screens/ConversationScreen";
import AllUsers from "./screens/AllUsers";
import StackNavigation from "./screens/Stack";


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Conversations" screenOptions={{
          headerShown: false
        }}>
          <Tab.Screen name='Conversations' component={StackNavigation} />
          <Tab.Screen name='AllUsers' component={AllUsers} options={{
            headerShown: true
          }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
}

