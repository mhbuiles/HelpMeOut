import React , { useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , TextInput , FlatList , ScrollView , Image , TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme , Searchbar } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player';

export function Explore( { navigation } ) {

  const [ posts , setPosts ] = useState( [] );
  const [ search , setSearch ] = useState( '' );
  const paperTheme = useTheme();

  useFocusEffect(
    useCallback( () => {
      axios({
        method : 'GET',
        baseURL : process.env.API_URL,
        url : '/posts',
      })
      .then( ( { data } ) => {
        setPosts( data );
      })
      .catch( function ( err ) {
        console.log( err );
      })
    }, [] )
  );

  return (
    <View syle = {styles.container}>
      <View style = {styles.exploreInput}>
        <Searchbar
          type = 'clear'
          placeholder = 'Go find'
          autoCapitalize = 'none'
          onChangeText = { text => {
            setSearch(text);
          }}
          value = {search}
          style = {paperTheme.dark ? styles.darkTextInput : styles.lightTextInput}
        />
        <Button
          title = 'Search'
          onPress = { () => {
            navigation.navigate( 'OtherUserProfile' , { username : search } );
            setSearch('');
           }}
        />
      </View>
      <ScrollView >
        <FlatGrid
          data = {posts}
          renderItem = { ( { item } ) => (
            <ScrollView>
              <TouchableOpacity onPress = { () => navigation.navigate( 'Post' , { id : item.id } ) } >
                <Image
                  style = { { height : 130 , width : 140 } }
                  source = { { uri : item.image} }
                />
              </TouchableOpacity>
            </ScrollView>
          )}
          spacing = {2}
          keyExractor = { ( item ) => `${item.id}`}
          style = { { width : 415 , height : 310 } }
        />
      </ScrollView>
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: 'cover',
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        }}
        inFullscreen={true}
        rate = { 1.0 }
        width = {414}
        height = {350}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
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
    width : 413,
    height : 30,
  },
  lightTextInput : {
    width : 413,
    height : 30,
    backgroundColor : '#fd5c63',
    color : 'white',
  },
});
