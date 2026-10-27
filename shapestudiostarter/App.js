import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DrawScreen from './src/screens/DrawScreen';
import SavedScreen from './src/screens/SavedScreen';
import { COLORS } from './src/constants/theme';

// Initialize the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // SafeAreaProvider is required at the root so React Navigation can calculate
    // device insets (status bar, home indicator, notches) across iOS and Android.
    <SafeAreaProvider>
      {/* NavigationContainer manages the navigation tree and app state */}
      <NavigationContainer>
        {/*
          Tab.Navigator automatically renders screen headers and safe-area margins,
          replacing the need for an outer SafeAreaView or custom header Views.
        */}
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.accent,
          }}
        >
          {/* Tab 1: The interactive drawing canvas */}
          <Tab.Screen
            name="Draw"
            component={DrawScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="shapes-outline" size={size} color={color} />
              ),
            }}
          />

          {/* Tab 2: Saved designs list (will host the stack navigator in Task 2) */}
          <Tab.Screen
            name="Saved"
            component={SavedScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="albums-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
