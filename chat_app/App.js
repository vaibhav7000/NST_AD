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
import ImagePickerScreen from "./screens/ImagePicker";
import CameraScreen from "./screens/CameraScreen";
import RawCameraScreen from "./screens/RawCameraScreen";


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="ImagePickerScreen" screenOptions={{
          headerShown: false
        }}>
          <Tab.Screen name='Conversations' component={StackNavigation} />
          <Tab.Screen name='AllUsers' component={AllUsers} options={{
            headerShown: true
          }} />
          <Tab.Screen name='ImagePickerScreen' component={ImagePickerScreen} options={{
            headerShown: true
          }} />
          <Tab.Screen name='CameraScreen' component={CameraScreen} options={{
            headerShown: false
          }} />
          <Tab.Screen name='RawCameraScreen' component={RawCameraScreen} options={{
            headerShown: false
          }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
}

