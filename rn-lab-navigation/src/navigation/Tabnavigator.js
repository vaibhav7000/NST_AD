import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './Homestack';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#2563eb',
                tabBarIcon: ({ color, size, focused }) => {
                    const icons = {
                        HomeTab: focused ? 'home' : 'home-outline',
                        SettingsTab: focused ? 'settings' : 'settings-outline',
                    };
                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            {/* Tab 1: contains its own stack, so it hides its own header */}
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{ title: 'Home', headerShown: false }}
            />
            {/* Tab 2: a plain screen */}
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{ title: 'Settings Mione', headerShown: false }}
            />
        </Tab.Navigator>
    );
}


// Got an invalid value for 'component' prop for the screen
// 'Homelab'.It must be a valid React Component./
