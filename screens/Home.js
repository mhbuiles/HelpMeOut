import React from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Postsfeed } from './Postsfeed';
import { MyProfile } from './MyProfile';
import { Exploresearch } from './Exploresearch';
import { Share } from './Share';
import { Activity } from './Activity';
import { DrawerP } from './Drawer';
import AsyncStorage from '@react-native-community/async-storage';
import { Ionicons } from "@expo/vector-icons";

export function Home( {...props} ) {

  const toggleThemeH = props.toggleTheme;

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name = 'Feed'
        component = {Postsfeed}
        options = {{
          tabBarIcon : ( { color , size } ) => (
            <Ionicons name = 'ios-home' size = {size} color = {color} />
          ),
        }}
      />
      <Tab.Screen
        name = 'Explore'
        component = {Exploresearch}
        options = {{
          tabBarIcon : ( { color , size } ) => (
            <Ionicons name = 'ios-search' size = {size} color = {color} options = {{}}/>
          )
        }}
      />
      <Tab.Screen
        name = 'Share'
        component = {Share}
        options = {{
          tabBarIcon : ( { color , size } ) => (
            <Ionicons name = 'ios-add' size = {size} color = {color} />
          )
        }}
      />
      <Tab.Screen
        name = 'Activity'
        component = {Activity}
        options = {{
          tabBarIcon : ( { color , size } ) => (
            <Ionicons name = 'ios-heart' size = {size} color = {color} />
          )
        }}
      />
      <Tab.Screen
        name = 'Drawer'
        options = {{
          tabBarIcon : ( { color , size } ) => (
            <Ionicons name = 'ios-contact' size = {size} color = {color} />
          )
        }}
      >{ props => <DrawerP {...props} toggleThemeH = {toggleThemeH}/>}</Tab.Screen>
    </Tab.Navigator>
  )
}
