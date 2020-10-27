import React , { useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , FlatList , TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useSelector , useDispatch } from 'react-redux';
import { messageProfile } from '../store/messageProfileReducer';

export function ChatsList( { navigation } ) {

  const paperTheme = useTheme();
  const dispatch = useDispatch();
  const [ chats , setChats ] = useState( [] );
  const [ allUsers , setAllUsers ] = useState( [] );
  const userId = useSelector( state => state.authReducer.id );

  useFocusEffect(
    useCallback( () => {

      AsyncStorage.getItem('token')
      .then( token => {
        axios({
          method : 'GET',
          baseURL : process.env.API_URL,
          url : '/chats',
          headers : {
            Authorization : `Bearer ${token}`,
          }
        })
        .then( ( { data } ) => {
          setChats( data );
        })
        .catch( function ( err ) {
          console.log( err );
        })
      })
    }, [] )
  );

  useFocusEffect(
    useCallback( () => {
      axios({
        method : 'GET',
        baseURL : process.env.API_URL,
        url : '/users',
      })
      .then( ( { data } ) => {
        setAllUsers( data );
      })
      .catch( function ( err ) {
        console.log( err );
      })
    }, [] )
  );

  function getUsername( id ) {
    let user = allUsers.filter( user => user.id === id.toString() );
    return user[0] ? user[0].username : 'loading';
  };

  return (
    <View>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>My chats</Text>
      <FlatList
        data = {chats}
        renderItem = { ( { item } ) => (
          <View style = {styles.chatsList}>
            <TouchableOpacity
              onPress = { () => {
                navigation.navigate( 'Chat' , { roomName : item.roomName } );
                dispatch( messageProfile( 'messagesTab' ) );
              } }
            >
              <Text style = {paperTheme.dark ? styles.lightBoldCommentText : styles.darkBoldCommentText}>
                @{ userId === item.receiverId ? allUsers.filter( user => user.id === item.senderId )[0].username : allUsers.filter( user => user.id === item.receiverId )[0].username }
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor = { ( item ) => `${item.id}`}
        style = { { width : 415 , height : 710 } }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText : {
    color : '#fd5c63',
    fontSize : 20,
    textDecorationLine : 'underline',
    margin : 20,
    fontWeight : 'bold',
  },
  darkText : {
    color : '#fd5c63',
    fontSize : 20,
    textDecorationLine : 'underline',
    margin : 20,
    fontWeight : 'bold',
  },
  lightBoldCommentText : {
    color : '#fd5c63',
    fontSize : 20,
    fontWeight : 'normal',
    marginLeft : 30,
    marginRight : 30,
    borderColor : '#fd5c63',
    marginTop : 0,
    borderWidth : 2,
    borderRadius : 5,
    height : 40,
    textAlign : 'center',
  },
  darkBoldCommentText : {
    color : 'black',
    fontSize : 20,
    fontWeight : 'normal',
    marginLeft : 30,
    marginRight : 30,
    borderColor : 'black',
    marginTop : 5,
    borderWidth : 2,
    borderRadius : 5,
    height : 40,
    textAlign : 'center',
  },
});
