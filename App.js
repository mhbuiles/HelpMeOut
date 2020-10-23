import { StatusBar } from 'expo-status-bar';
import React , { useState } from 'react';
import { StyleSheet, Text, View , ScrollView , Image , Button } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Signin } from './screens/Signin';
import { Signup } from './screens/Signup';
import { Home } from './screens/Home';
import { Drawer } from './screens/Drawer';
import { Provider } from 'react-redux';
import { store } from './store/store';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { navigationRef } from './components/RootNavigation';

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
};

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors : { ...PaperDarkTheme.colors , ...NavigationDarkTheme.colors },
};

const Stack = createStackNavigator();

export default function App() {

  const [ isDarkTheme , setIsDarkTheme ] = useState( false );
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

  function toggleTheme() {
    setIsDarkTheme( isDark => !isDark );
  }

  return (
    <Provider store = {store}>
      <PaperProvider theme = {theme} >
        <NavigationContainer theme = {theme} ref = {navigationRef} >
          <Stack.Navigator>
            <Stack.Screen name = 'HelpMeOut!' component = {Signin} ></Stack.Screen>
            <Stack.Screen name = 'Signup' component = {Signup} ></Stack.Screen>
            <Stack.Screen name = 'Home'  options = {{ title : 'HelpMeOut!' , headerLeft : () => (<Button onPress = {()=>alert('Hello')} title = '' color = 'white'/>)}} >{ props => <Home {...props} toggleTheme = {toggleTheme}/>}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>

  );
}
