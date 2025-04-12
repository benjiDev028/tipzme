import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/LoginScreen/LoginScreen';
import SignIn from '../Screens/register/SigninScreen/SigninScreen';
import ConfirmationInfoScreen from '../Screens/register/KycInfoScreen/KycInfoScreen';
import KycInfoScreen from '../Screens/register/KycInfoScreen/KycInfoScreen';
import AddresseInfoScreen from '../Screens/register/AdressInfoScreen/AdresseInfoScreen';
import KycStatusScreen from '../Screens/register/KycStatusScreen/KycStatusScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="AddresseInfo" component={AddresseInfoScreen} />
      <Stack.Screen name="KycInfo" component={KycInfoScreen} />
      <Stack.Screen name="KycStatus" component={KycStatusScreen} />

    </Stack.Navigator>
  );
};

export default AuthStack;
