import React from 'react';
import { StyleSheet , View , Button } from 'react-native';
import { createDrawerNavigator , DrawerItem , DrawerContentScrollView } from '@react-navigation/drawer';
import { MyProfile } from './MyProfile';
import {
  useTheme,
  Avatar,
  Title,
  Drawer,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import { useSelector , useDispatch } from 'react-redux';
import { logout } from '../store/authReducer';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from '../components/RootNavigation';

function DrawerContent( { navigation , ...props} ) {

  const dispatch = useDispatch();
  const profilePic = useSelector( state => state.authReducer.profilepic );
  const name = useSelector( state => state.authReducer.name );
  const username = useSelector( state => state.authReducer.username );
  const paperTheme = useTheme();
  const isAuthenticated = useSelector( state => state.authReducer.authenticated );

  async function handleLogout() {
    await AsyncStorage.removeItem( 'token' );
    dispatch( logout() );
    RootNavigation.navigate( 'HelpMeOut!' );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style = { styles.drawerContent } >
        <View style = { styles.userInfoSection} >
          <Avatar.Image
            source = { {
              uri : profilePic,
            } }
          />
          <Title style = { styles.title } >{name}</Title>
          <Caption style = { styles.caption} >@{username}</Caption>
        </View>
        <Drawer.Section title = 'Options' >
          <TouchableRipple onPress = {props.toggleThemeH} >
            <View style = { styles.preference }>
              <Text>Dark mode</Text>
              <View pointerEvents = 'none' >
                <Switch value = { paperTheme.dark } />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress = {handleLogout} >
            <View style = { styles.preference }>
              <Text>Sign out</Text>
              <View pointerEvents = 'none' >
                <Switch value = { !isAuthenticated } />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  )
}

export function DrawerP( { navigation , ...props } ) {

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator drawerContent = { () => <DrawerContent toggleThemeH = {props.toggleThemeH} /> } >
      <Drawer.Screen name = 'MyProfile' component = {MyProfile} ></Drawer.Screen>
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#fd5c63',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
