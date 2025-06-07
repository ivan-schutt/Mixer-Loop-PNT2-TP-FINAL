import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreen from '../screens/credentials/HomeScreen';
import LoginScreen from '../screens/credentials/LoginScreen';
import RegisterScreen from '../screens/credentials/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function CredentialsNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}