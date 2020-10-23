import React from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Explore } from './Explore';
import { Search } from './Search';

export function Exploresearch() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name = 'Explore' component = {Explore} />
      <Stack.Screen name = 'Search' component = {Search} />
    </Stack.Navigator>
  )
}
