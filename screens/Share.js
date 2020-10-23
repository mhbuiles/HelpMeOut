import React , { useState } from 'react';
import { StyleSheet , View , Text , Button , TextInput } from 'react-native';
import axios from 'axios';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from 'react-native-paper';

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
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Share</Text>
      <TextInput
        placeholder = 'Add a caption'
        onChangeText = { text => {
          setCaption(text);
        }}
        style = {paperTheme.dark ? styles.darkTextInput : styles.lightTextInput}
      />
      <Button
        title = 'Share a pic!'
        onPress = {pickImage}
      />
      <Button
        title = 'Share!'
        onPress = {handleShare}
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
    color : 'white',
    fontSize : 20,
  },
  darkText : {
    color : 'black',
    fontSize : 20,
  },
  darkTextInput : {
    color : 'white',
    backgroundColor : '#fd5c63',
    width : 350,
    height : 30,
  },
  lightTextInput : {
    width : 350,
    height : 30,
    backgroundColor : '#fd5c63',
    color : 'white',
  },
});
