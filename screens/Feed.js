import React , { useEffect , useState , useCallback } from 'react';
import { StyleSheet , View , Text , FlatList , Image , ScrollView , TextInput } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button , IconButton , Colors , Appbar , useTheme } from 'react-native-paper';

export function Feed( { navigation } ) {

  const [ posts , setPosts ] = useState( [] );
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

  async function handleLike( post ) {

    const tokenU = await AsyncStorage.getItem('token');

    axios({
      method : 'POST',
      baseURL : process.env.API_URL,
      url : '/likes',
      data : post,
      headers : {
        Authorization : `Bearer ${tokenU}`,
      }
    })
    .then( ( { data } ) => {
    })
    .catch( function ( err ) {
      console.log( err );
    })
  }

  return (
    <View style = {styles.container}>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Feed</Text>
      <FlatList
        data = {posts}
        renderItem = { ( { item } ) => (
          <ScrollView>
            <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>
              {item.caption}
            </Text>
            <Image
              style = { { height : 300 , width : 300 } }
              source = { { uri : item.image} }
            />
            <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>
              {item.Likes.length} likes
            </Text>
            <FlatList
              data = {item.Comments}
              renderItem = { ( { item } ) => (
                <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>
                  {item.text}
                </Text>
              )}
              keyExtractor = { ( item ) => `${item.id}`}
            />
            <IconButton
              icon = 'comment'
              color = {Colors.red500}
              onPress = { () => navigation.navigate( 'Post' , { id : item.id } ) }
            />
            <IconButton
              icon = 'heart'
              color = {Colors.red500}
              onPress = { () => handleLike(item) }
            />
          </ScrollView>
        )}
        keyExractor = { ( item ) => `${item.id}`}
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
});
