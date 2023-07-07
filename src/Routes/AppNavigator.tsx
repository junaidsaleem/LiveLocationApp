import { createStackNavigator } from '@react-navigation/stack';
import LocationTracker from '../Screens/LocationTracker';
import LiveMap from '../Screens/LiveMap';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Screen1" headerMode="none">
      <Stack.Screen name="LocationTracker" component={LocationTracker} />
      <Stack.Screen name="LiveMap" component={LiveMap} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
