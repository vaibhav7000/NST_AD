import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedScreen from '../screens/SavedScreen';
import DesignDetailScreen from '../screens/DesignDetailScreen';

const Stack = createNativeStackNavigator();

export default function SavedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SavedList" component={SavedScreen} options={{ title: 'Saved' }} />
      <Stack.Screen name="DesignDetail" component={DesignDetailScreen} options={{ title: 'Design' }} />
    </Stack.Navigator>
  );
}
