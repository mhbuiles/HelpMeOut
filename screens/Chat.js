import React , { useState , useEffect , useCallback } from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import io from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import { IconButton , TextInput , Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';

let socket;

export function Chat() {

  const paperTheme = useTheme();
  const [ message , setMessage ] = useState( '' );
  const [ messages , setMessages ] = useState( [] );
  const name = useSelector( state => state.authReducer.name );
  const room = 'room';

  useFocusEffect(
    useCallback( () => {

      socket = io( process.env.API_URL );
      socket.emit( 'join' , { name , room } , () => {

      });

      return () => {
        socket.emit( 'disconnect' );
        socket.off();
      }

    }, [] )
  );

  useFocusEffect(
    useCallback( () => {

      socket.on( 'message' , ( message ) => {
        setMessages( [ ...messages , message ] );
      });
    }, [ messages ] )
  );

  function sendMessage() {

    if( message ) {
      socket.emit( 'sendMessage' , message , () => {
        setMessage( '' );
      })
    }
  };

  return (
    <View>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Chat</Text>
      <View>
        <TextInput
          theme = { { colors : { text : 'black' , placeholder : 'black' } } }
          selectionColor = '#333'
          backgroundColor = '#fff'
          style = { { height : 40 , width : 300 } }
          mode = 'flat'
          placeholder = 'Type your message'
          autoCapitalize = 'none'
          multiline = {true}
          onChangeText = { text => {
            setMessage(text);
          }}
          value = {message}
        />
        <IconButton
          icon = 'send'
          color = {Colors.red500}
          onPress = {sendMessage}
        />
      </View>
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
    color : 'white',
    fontSize : 20,
  },
  darkText : {
    color : 'black',
    fontSize : 20,
  },
  inputLine :{
    flex: 1,
    flexDirection : 'row',
  },
});
