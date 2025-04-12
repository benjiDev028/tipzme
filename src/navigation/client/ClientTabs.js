import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importez vos écrans principaux
import HomeScreen from '../../Screens/client/HomeScreen/HomeScreen';
import CreateShiftScreen from '../../Screens/client/CreateShiftScreen/CreateShiftScreen';
import ProfileScreen from '../../Screens/client/ProfileScreen/ProfileScreen';
import PaymentScreen from '../../Screens/client/PaymentScreen/PaymentScreen';
import HistoryScreen from '../../Screens/client/HistoryScreen/HistoryScreen';


const Tab = createBottomTabNavigator();

const ClientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CreateShiftTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'PaymentTab') {
            iconName = focused ? 'card' : 'card-outline'; // Icône de carte de paiement
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'HistoryTab') {
            iconName = focused ? 'time' : 'time-outline'; // Icône pour l'historique
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen 
        name="CreateShiftTab" 
        component={CreateShiftScreen}
        options={{ title: 'Nouveau Shift' }}
      />
      <Tab.Screen 
        name="PaymentTab" 
        component={PaymentScreen}
        options={{ title: 'Paiement' }}
      />
      <Tab.Screen 
        name="HistoryTab" 
        component={HistoryScreen}
        options={{ title: 'Historique' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default ClientTabs;
