import React , { useState , useEffect , useCallback } from 'react';
import { StyleSheet , View , Text , Button , FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import io from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import { IconButton , TextInput , Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let socket;

export function Chat( { route } ) {

  const paperTheme = useTheme();
  const [ message , setMessage ] = useState( '' );
  const [ messages , setMessages ] = useState( [] );
  const name = useSelector( state => state.authReducer.name );
  const messagesFrom = useSelector( state => state.messageProfileReducer.bool );
  const senderId = useSelector( state => state.authReducer.id );
  const [ chatId , setChatId ] = useState( '' );
  const [ roomName , setRoomName ] = useState( '' );

  useFocusEffect(
    useCallback( () => {

      socket = io( process.env.API_URL );

      if( messagesFrom === 'messagesTab' ) {
        setRoomName( route.params.roomName );
        socket.emit( 'join room' , route.params.roomName );
        socket.on( 'chatDB' , ( chat ) => {
          setMessages( chat.Messages );
          setChatId( chat.id );
        });
      }
      else {
        const participants = {
          senderId,
          receiverId : route.params.receiverId,
        };
        socket.emit( 'create room' , participants );
        socket.on( 'chatId' , ( { id , roomName } ) => {
          setChatId( id );
          setRoomName( roomName );
        });
      };

      socket.on( 'message' , ( message ) => {
        setMessages( prevMessages => [ ...prevMessages , message ] );
      });

      return () => {
        socket.emit( 'disconnect' );
        socket.close();
      }

    }, [] )
  );

  function sendMessage() {

    const data = {
      origin : senderId,
      text : message,
      chatId : chatId,
      roomName : roomName,
    };

    if( message ) {
      socket.emit( 'sendMessage' , data )
    }
    setMessage('');
  };

  return (
    <KeyboardAwareScrollView resetScrollToCoords = {{ x : 0 , y : 0 }} contentContainerStyle = {styles.container} scrollEnabled>
      <View>
        <FlatList
          data = {messages}
          renderItem = { ( { item } ) => (
            <View>
              <Text style = { paperTheme.dark ? ( item.origin === senderId ? styles.lightChatSentText : styles.lightChatReceivedText ) : (item.origin === senderId ? styles.darkChatSentText : styles.darkChatReceivedText ) }>
                { item.text }
              </Text>
            </View>
          )}
          keyExtractor = { ( item ) => `${item.id}`}
          style = { { width : 415 , height : 500 , marginTop : 20 } }
        />
        <View style = {styles.sendMessage}>
          <TextInput
            theme = { { colors : { text : 'black' , placeholder : 'black' } } }
            selectionColor = '#333'
            backgroundColor = '#fff'
            style = { { height : 40 , width : 350 } }
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
    </KeyboardAwareScrollView>
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
    fontSize : 30,
    marginTop : 10,
    fontWeight : 'bold',
    textAlign : 'center',
  },
  darkText : {
    color : '#fd5c63',
    fontSize : 30,
    textAlign : 'center',
    marginTop : 10,
    fontWeight : 'bold',
  },
  lightChatSentText : {
    color : 'white',
    fontSize : 20,
    textAlign : 'right',
    marginRight : 20,
    marginBottom : 5,
    marginTop : 10,
    textShadowColor : '#34f52a',
    textShadowRadius : 5,
    fontWeight : 'bold',
  },
  darkChatSentText : {
    color : 'black',
    fontSize : 20,
    textAlign : 'right',
    marginRight : 20,
    marginBottom : 5,
    marginTop : 10,
    textShadowColor : '#34f52a',
    textShadowRadius : 20,
    fontWeight : 'bold',
  },
  lightChatReceivedText : {
    color : 'white',
    fontSize : 20,
    textAlign : 'left',
    marginLeft : 20,
    marginBottom : 5,
    marginTop : 10,
    textShadowColor : '#0c88f5',
    textShadowRadius : 20,
    fontWeight : 'bold',
  },
  darkChatReceivedText : {
    color : 'black',
    fontSize : 20,
    textAlign : 'left',
    marginLeft : 20,
    marginBottom : 5,
    marginTop : 10,
    textShadowColor : '#0c88f5',
    textShadowRadius : 20,
    fontWeight : 'bold',
  },
  inputLine :{
    flex: 1,
    flexDirection : 'row',
  },
  sendMessage: {
    flex: 1,
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom : 0,
  },
});
