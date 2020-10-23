import React from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Feed } from './Feed';
import { Post } from './Post';

export function Postsfeed() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name = 'Feed' component = {Feed} />
      <Stack.Screen name = 'Post' component = {Post} />
    </Stack.Navigator>
  )
}