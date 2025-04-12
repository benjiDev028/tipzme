import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from "../context/AuthContext";
import AuthStack from './AuthStack';
import ClientStack from './client/ClientStack';
import { View, ActivityIndicator } from 'react-native';

const RootStack = createStackNavigator();

export default function MainNavigator() {
  const { token, userRole, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        userRole === 'worker' ? (
          <RootStack.Screen name="ClientStack" component={ClientStack} />
        ) : (
          // Ajouter d'autres rôles ici si nécessaire
          <RootStack.Screen name="AuthStack" component={AuthStack} />
        )
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStack} />
      )}
    </RootStack.Navigator>
  );
}