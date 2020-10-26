import React , { useState } from 'react';
import { StyleSheet , View , Text } from 'react-native';
import axios from 'axios';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../store/authReducer';
import { Button , TextInput } from 'react-native-paper';

export const Signup = ( { navigation } ) => {

  const dispatch = useDispatch();
  const [ cameraRollPermission , setCameraRollPermission ] = useState( 'denied' );
  const [ username , setUsername ] = useState( '' );
  const [ name , setName ] = useState( '' );
  const [ lastName , setLastName ] = useState( '' );
  const [ email , setEmail ] = useState( '' );
  const [ password , setPassword ] = useState( '' );
  const [ profilepic , setProfilepic] = useState( null );

  async function pickImage() {

    if ( cameraRollPermission === 'denied' ) {
      Permission.askAsync(Permission.CAMERA_ROLL)
        .then( ( { status } ) => setCameraRollPermission( status ) )
    };

    const dataI = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.MediaTypeOptions.All,
      allowsEditing : true,
      aspect : [ 4 , 3 ],
    })
    setProfilepic( dataI );
  };

  async function handleSignup() {

    const file = {
      uri : profilepic.uri,
      type : 'image',
      name : 'photo.jpg',
    }

    const userData = new FormData();
    userData.append( 'username' , username );
    userData.append( 'name' , name );
    userData.append( 'lastName' , lastName );
    userData.append( 'email' , email );
    userData.append( 'password' , password );
    userData.append( 'name' , name );
    if ( file ) {
      userData.append( 'file' , file , file.name );
    }

    await axios({
      method : 'POST',
      baseURL : process.env.API_URL,
      url : '/users/signup',
      data : userData,
      headers : {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then( ( { data } ) => {
      AsyncStorage.setItem( 'token' , data.token );
      dispatch( login( data.user ) );
      navigation.navigate( 'Home' );
    })
    .catch( function ( err ) {
      console.log( err );
    })
  };

  return (
    <View style = {styles.container}>
      <Text style = {styles.title}>Create account</Text>
      <View style = {styles.inputs}>
        <TextInput
          theme = { { colors : { text : 'black' , placeholder : 'black' } } }
          selectionColor = '#333'
          backgroundColor = '#fff'
          style = { { height : 40 , width : 300 , margin : 2 } }
          mode = 'flat'
          placeholder = 'Type your username'
          autoCapitalize = 'none'
          onChangeText = { text => {
            setUsername(text);
          }}
          value = {username}
        />
        <TextInput
          theme = { { colors : { text : 'black' , placeholder : 'black' } } }
          selectionColor = '#333'
          backgroundColor = '#fff'
          style = { { height : 40 , width : 300 , margin : 2 } }
          mode = 'flat'
          placeholder = 'Type your name'
          autoCapitalize = 'none'
          onChangeText = { text => {
            setName(text);
          }}
          value = {name}
        />
        <TextInput
          theme = { { colors : { text : 'black' , placeholder : 'black' } } }
          selectionColor = '#333'
          backgroundColor = '#fff'
          style = { { height : 40 , width : 300 , margin : 2 } }
          mode = 'flat'
          placeholder = 'Type your last name'
          autoCapitalize = 'none'
          onChangeText = { text => {
            setLastName(text);
          }}
          value = {lastName}
        />
        <TextInput
          theme = { { colors : { text : 'black' , placeholder : 'black' } } }
          selectionColor = '#333'
          backgroundColor = '#fff'
          style = { { height : 40 , width : 300 , margin : 2 } }
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
          style = { { height : 40 , width : 300 , margin : 2 } }
          mode = 'flat'
          placeholder = 'Type your password'
          autoCapitalize = 'none'
          secureTextEntry = {true}
          onChangeText = { text => {
            setPassword(text);
          }}
          value = {password}
        />
      </View>
      <View style = {styles.buttons}>
        <Button style = { { height : 40 , width : 300 , borderRadius : 10 , marginBottom : 100 , padding : 2 } } color = '#fff' mode = 'contained' title = 'Login' onPress = {pickImage} >
          Choose a profile pic!
        </Button>
        <Button style = { { height : 40 , width : 300 , borderRadius : 10 , padding : 2 } } color = '#fff' mode = 'contained' title = 'Not an account?' onPress = {handleSignup} >
          Create account
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
    justifyContent: 'space-evenly',
  },
  title : {
    fontWeight : 'bold',
    fontSize : 25,
    color : '#fff',
  },
  buttons : {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputs : {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
