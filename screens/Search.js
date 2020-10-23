import React , { useEffect , useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , FlatList , Image , ScrollView } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from 'react-native-paper';

export function Search( { route } ) {

  const [ searchResult , setSearchResult ] = useState( {} );
  const paperTheme = useTheme();

  useFocusEffect(
    useCallback( () => {

      AsyncStorage.getItem('token')
      .then( token => {
        axios({
          method : 'GET',
          baseURL : process.env.API_URL,
          url : `/users/${route.params.username}`,
          headers : {
            Authorization : `Bearer ${token}`,
          }
        })
        .then( ( { data } ) => {
          data ? setSearchResult( data ) : setSearchResult( {} );
        })
        .catch( function ( err ) {
          console.log( err );
        })
      })
    }, [] )
  );

  if( !searchResult.name ) {
    return (
      <View>
        <Text>Your search did not match any results</Text>
      </View>
    )
  }

  return (
    <View style = {styles.container}>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>{searchResult.name}</Text>
      <Image
        style = { { height : 50 , width : 50 } }
        source = { { uri : searchResult.profilepic} }
      />
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>{searchResult.name}'s posts</Text>
      <FlatList
        data = {searchResult.Posts}
        renderItem = { ( { item } ) => (
          <ScrollView>
            <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>
              {item.caption}
            </Text>
            <Image
              style = { { height : 300 , width : 300 } }
              source = { { uri : item.image} }
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
