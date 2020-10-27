import React , { useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , FlatList , Image , ScrollView , ActivityIndicator , TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';

export function MyProfile( { navigation } ) {

  const [ myPosts , setMyPosts ] = useState( [] );
  const [ loading , setLoading ] = useState( true );
  const name = useSelector( state => state.authReducer.name );
  const username = useSelector( state => state.authReducer.username );
  const profilepic = useSelector( state => state.authReducer.profilepic );
  const paperTheme = useTheme();

  useFocusEffect(
    useCallback( () => {

      AsyncStorage.getItem('token')
      .then( token => {
        axios({
          method : 'GET',
          baseURL : process.env.API_URL,
          url : '/posts/myposts',
          headers : {
            Authorization : `Bearer ${token}`,
          }
        })
        .then( ( { data } ) => {
          setMyPosts( data );
          setLoading( false );
        })
        .catch( function ( err ) {
          console.log( err );
        })
      })
    }, [] )
  );

  if ( loading ) {
    return (
      <View style = {styles.container}>
        <ActivityIndicator />
      </View>
    )
  };

  return (
    <View style = {styles.container}>
      <View style = {styles.header}>
        <View style = {styles.profInf}>
          <Image
            style = { { height : 60 , width : 60 , borderRadius : 100 } }
            source = { { uri : profilepic } }
          />
          <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>{'  '}@{username}</Text>
        </View>
        <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Hi, {name}!</Text>
        <Text style = {paperTheme.dark ? styles.lightProfInfText : styles.darkProfInfText}>{myPosts.length} posts</Text>
      </View>
      <FlatGrid
        data = {myPosts}
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
        style = { { width : 415 , marginTop : 50 } }
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
  lightProfInfText : {
    color : 'white',
    fontSize : 15,
  },
  darkProfInfText : {
    color : 'black',
    fontSize : 15,
  },
  header : {
    flex : 1,
    flexDirection : 'column',
    alignItems : 'center',
    width : 400,
    marginLeft : 0,
    marginTop : 0,
  },
  profInf : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
  },
});
