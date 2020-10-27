import React , { useState } from 'react';
import { StyleSheet , View , Text , Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authReducer';
import { Button , TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
      console.dir( err );
      alert('Wrong user/passwrod');
    });
  }

  return (
    <View style = {styles.container}>
      <Image
        style = { { height : 350 , width : 350 } }
        source = {require('../assets/icon.png')}
      />
      <Text style = {styles.title}>Welcome to HelpMeOut!</Text>
      <View>
          <TextInput
            theme = { { colors : { text : 'black' , placeholder : 'black' } } }
            selectionColor = '#333'
            backgroundColor = '#fff'
            style = { { height : 40 , width : 300 } }
            mode = 'flat'
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
            style = { { height : 40 , width : 300 , marginTop : 5 } }
            mode = 'flat'
            placeholder = 'Type your password'
            secureTextEntry = {true}
            onChangeText = { text => {
              setPassword(text);
            }}
            value = {password}
          />
      </View>

      <View style = {styles.buttons}>
        <Button style = { { height : 40 , width : 300 , borderRadius : 10 , margin : 10 , padding : 2 } } color = '#fff' mode = 'contained' title = 'Login' onPress = {handleLogin} >
          Login
        </Button>
        <Button style = { { height : 40 , width : 300 , borderRadius : 10 , padding : 2 } } color = '#fff' mode = 'contained' title = 'Not an account?' onPress = { () => navigation.navigate( 'Signup' )} >
          Not an account?
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fd5c63',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom : 0,
  },
  title : {
    fontWeight : 'bold',
    fontSize : 25,
    color : '#fff',
  },
  buttons : {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom : 30,
  },
  containerAware : {
    flex : 1,
    alignItems : 'center',
  },
});
