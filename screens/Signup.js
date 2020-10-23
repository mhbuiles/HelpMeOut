import React , { useState } from 'react';
import { StyleSheet , View , Text , Button , TextInput } from 'react-native';
import axios from 'axios';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../store/authReducer';

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
      <Text>Sign up</Text>
      <TextInput
        placeholder = 'Type your username'
        autoCapitalize = 'none'
        onChangeText = { text => {
          setUsername(text);
        }}
      />
      <TextInput
        placeholder = 'Type your name'
        onChangeText = { text => {
          setName(text);
        }}
      />
      <TextInput
        placeholder = 'Type your last name'
        onChangeText = { text => {
          setLastName(text);
        }}
      />
      <TextInput
        placeholder = 'Type your email'
        autoCapitalize = 'none'
        onChangeText = { text => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder = 'Type your password'
        secureTextEntry = {true}
        onChangeText = { text => {
          setPassword(text);
        }}
      />
      <Button
        title = 'Choose a profile pic!'
        onPress = {pickImage}
      />
      <Button
        title = 'Create account'
        onPress = {handleSignup}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
