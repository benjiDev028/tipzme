import { createStackNavigator } from '@react-navigation/stack';
import ClientTabs from '../client/ClientTabs';

// Importez les écrans SANS onglets
import DashboardWorker from '../../Screens/client/DashboardWorkerScreen/DashboardWorkerScreen';
import LoginScreen from '../../Screens/LoginScreen/LoginScreen';

const Stack = createStackNavigator();

export default function ClientStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      
      {/* Écrans hors onglets */}

      <Stack.Screen name="dash" component={DashboardWorker} />
      
    </Stack.Navigator>
  );
}