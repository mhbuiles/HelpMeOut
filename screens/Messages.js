import React from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ChatsList } from './ChatsList';
import { Chat } from './Chat';

export function Messages() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name = 'ChatsList' component = {ChatsList} />
      <Stack.Screen name = 'Chat' component = {Chat} />
    </Stack.Navigator>
  )
}
