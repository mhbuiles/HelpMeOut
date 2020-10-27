import React , { useState } from 'react';
import { StyleSheet , View , Text , Button , TextInput , Image } from 'react-native';
import axios from 'axios';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme , IconButton , Colors } from 'react-native-paper';

export function Share( { navigation } ) {

  const [ cameraRollPermission , setCameraRollPermission ] = useState( 'denied' );
  const [ postPic , setPostPic] = useState( null );
  const [ caption , setCaption ] = useState( '' );
  const paperTheme = useTheme();

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
    setPostPic( dataI );
  };

  async function handleShare() {

    const tokenU = await AsyncStorage.getItem('token');

    const file = {
      uri : postPic.uri,
      type : 'image',
      name : 'photo.jpg',
    }

    const postData = new FormData();
    postData.append( 'caption' , caption );
    if ( file ) {
      postData.append( 'file' , file , file.name );
    }

    await axios({
      method : 'POST',
      baseURL : process.env.API_URL,
      url : '/posts',
      data : postData,
      headers : {
        Authorization : `Bearer ${tokenU}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    .then( ( { data } ) => {
      navigation.navigate( 'Feed' );
    })
    .catch( function ( err ) {
      console.log( err );
    })
  };

  return (
    <View style = {styles.container}>
      <Image
        style = { { height : 250 , width : 250 } }
        source = {require('../assets/icon.png')}
      />
      <View style = {styles.container}>
        <Text style = {paperTheme.dark ? styles.lightHeaderText : styles.darkHeaderText}>Share your progress with a pic and tell your story!</Text>
        <TextInput
          placeholder = 'Add a caption'
          onChangeText = { text => {
            setCaption(text);
          }}
          style = {paperTheme.dark ? styles.darkTextInput : styles.lightTextInput}
        />
      </View>
      <View styles = {styles.pickButton}>
        <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Choose your pic!</Text>
        <IconButton
          icon = 'image'
          size = {100}
          onPress = {pickImage}
          color = '#fd5c63'
        />
      </View>
      <View style = {styles.shareButton}>
        <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Post it!</Text>
        <IconButton
          icon = 'plus'
          size = {100}
          color = '#fd5c63'
          onPress = {handleShare}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  shareButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pickButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  lightText : {
    color : 'white',
    fontSize : 20,
  },
  darkText : {
    color : 'black',
    fontSize : 20,
  },
  lightHeaderText : {
    color : 'white',
    fontSize : 20,
    fontWeight : 'bold',
    margin : 10,
  },
  darkHeaderText : {
    color : 'black',
    fontSize : 20,
    fontWeight : 'bold',
    margin : 10,
  },
  darkTextInput : {
    color : 'white',
    backgroundColor : '#fd5c63',
    width : 350,
    height : 30,
    marginBottom : 20,
  },
  lightTextInput : {
    width : 350,
    height : 30,
    backgroundColor : '#fd5c63',
    color : 'white',
  },
});
