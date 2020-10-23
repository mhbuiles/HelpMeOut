import React , { useState } from 'react';
import { StyleSheet , View , Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authReducer';
import { Button , TextInput } from 'react-native-paper';

export const Signin = ( { navigation } ) => {

  const dispatch = useDispatch();
  const [ email , setEmail ] = useState( '' );
  const [ password , setPassword ] = useState( '' );

  async function handleLogin() {

    const userData = {
      email,
      password,
    }

    await axios({
      method : 'POST',
      baseURL : process.env.API_URL,
      url : '/users/signin',
      data : userData,
    })
    .then( ( { data } ) => {
      AsyncStorage.setItem( 'token' , data.token );
      dispatch( login( data.user ) );
      navigation.navigate( 'Home' );
      setEmail('');
      setPassword('');
    })
    .catch( function ( err ) {
      console.log( err );
      alert('Wrong user/passwrod');
    });
  }

  return (
    <View style = {styles.container}>
      <Text>Signin</Text>
      <TextInput
        theme = { { colors : { text : 'black' , placeholder : 'black' } } }
        selectionColor = '#333'
        backgroundColor = '#fff'
        style = { { height : 40 , width : 300 } }
        mode = 'outlined'
        placeholder = 'Type your email'
        autoCapitalize = 'none'
        onChangeText = { text => {
          setEmail(text);
        }}
        value = {email}
      />
      <TextInput
        theme = { { colors : { text : 'black' , placeholder : 'black' } } }
        selectionColor = '#333'
        backgroundColor = '#fff'
        style = { { height : 40 , width : 300 } }
        mode = 'outlined'
        placeholder = 'Type your password'
        secureTextEntry = {true}
        onChangeText = { text => {
          setPassword(text);
        }}
        value = {password}
      />
      <Button style = { { height : 40 , width : 190 , borderRadius : 10 } } color = 'blue' mode = 'contained' title = 'Login' onPress = {handleLogin} >
        Login
      </Button>
      <Button style = { { height : 40 , width : 190 , borderRadius : 10 } } color = 'blue' mode = 'contained' title = 'Not an account?' onPress = { () => navigation.navigate( 'Signup' )} >
        Not an account?
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fd5c63',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
