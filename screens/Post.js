import React , { useEffect , useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , FlatList , Image , ScrollView , TextInput } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from 'react-native-paper';

export function Post( { route , navigation } ) {

  const [ post , setPost ] = useState( {} );
  const [ likes , setLikes ] = useState( 0 );
  const [ postComments , setPostComments ] = useState( [] );
  const [ comment , setComment ] = useState( '' );
  const paperTheme = useTheme();

  async function handleComment( ) {

    const tokenU = await AsyncStorage.getItem('token');

    const commentData = {
      text : comment,
    }

    axios({
      method : 'POST',
      baseURL : process.env.API_URL,
      url : `/comments/${route.params.id}`,
      data : commentData,
      headers : {
        Authorization : `Bearer ${tokenU}`,
      }
    })
    .then( () => {
      navigation.navigate('Feed');
    });
  };

  useFocusEffect(
    useCallback( () => {

      AsyncStorage.getItem('token')
      .then( token => {
        axios({
          method : 'GET',
          baseURL : process.env.API_URL,
          url : `/posts/${route.params.id}`,
          headers : {
            Authorization : `Bearer ${token}`,
          }
        })
        .then( ( { data } ) => {
          setPost( data );
          setLikes( data.Likes.length );
          setPostComments( data.Comments );
        })
        .catch( function ( err ) {
          console.log( err );
        })
      })
    }, [] )
  );

  return (
    <View style = {styles.container}>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>{post.caption}</Text>
      <Image
        style = { { height : 300 , width : 300 } }
        source = { { uri : post.image} }
      />
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>{likes} likes</Text>
      <FlatList
        data = {postComments}
        renderItem = { ( { item } ) => (
          <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>
            {item.text}
          </Text>
        )}
        keyExtractor = { ( item ) => `${item.id}`}
      />
      <TextInput
        placeholder = 'Add a comment...'
        autoCapitalize = 'none'
        onChangeText = { text => {
          setComment(text);
        }}
        style = {paperTheme.dark ? styles.darkTextInput : styles.lightTextInput}
      />
      <Button
        title = 'Post'
        onPress = {handleComment}
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
