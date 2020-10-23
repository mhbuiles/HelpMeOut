import React , { useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , TextInput , FlatList , ScrollView , Image } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

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
    <View style = {styles.container}>
      <TextInput
        placeholder = 'Go find'
        autoCapitalize = 'none'
        onChangeText = { text => {
          setSearch(text);
        }}
        style = {paperTheme.dark ? styles.darkTextInput : styles.lightTextInput}
      />
      <Button
        title = 'Search'
        onPress = { () => navigation.navigate( 'Search' , { username : search } )}
      />
      <FlatList
        data = {posts}
        renderItem = { ( { item } ) => (
          <ScrollView>
            <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>
              {item.caption}
            </Text>
            <Image
              style = { { height : 50 , width : 50 } }
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
