import React , { useEffect , useState , useCallback } from 'react';
import { StyleSheet , View , Text , FlatList , Image , ScrollView , TextInput , TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button , IconButton , Colors , Appbar , useTheme } from 'react-native-paper';

export function Feed( { navigation } ) {

  const [ posts , setPosts ] = useState( [] );
  const [ allUsers , setAllUsers ] = useState( [] );
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
        console.dir( err );
      })
    }, [] )
  );

  useFocusEffect(
    useCallback( () => {
      axios({
        method : 'GET',
        baseURL : process.env.API_URL,
        url : '/users',
      })
      .then( ( { data } ) => {
        setAllUsers( data );
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
  };

  function getUsername( id ) {
    let user = allUsers.filter( user => user.id === id.toString() );
    return user[0] ? user[0].username : 'loading';
  };

  return (
    <View style = {styles.container}>
      <FlatList
        data = {posts}
        renderItem = { ( { item } ) => (
          <ScrollView>
            <View style = {styles.userInfo} >
              <Image
                style = { { height : 20 , width : 20 , borderRadius : 100 } }
                source = { { uri : item.User.profilepic} }
              />
              <TouchableOpacity onPress = { () => navigation.navigate( 'OtherUserProfile' , { username : item.User.username } ) }>
                <Text style = {paperTheme.dark ? styles.lightBoldUserInfoText : styles.darkBoldUserInfoText} >  {item.User.username}</Text>
              </TouchableOpacity>
            </View>
            <Image
              style = { { height : 400 , width : 420 , marginTop : 10 } }
              source = { { uri : item.image} }
            />
            <View style = { styles.postButtons}>
              <IconButton
                icon = 'heart'
                color = {Colors.red500}
                onPress = { () => handleLike(item) }
              />
              <IconButton
                icon = 'comment'
                color = {Colors.red500}
                onPress = { () => navigation.navigate( 'Post' , { id : item.id } ) }
              />
            </View>
            <Text style = {paperTheme.dark ? styles.lightBoldText : styles.darkBoldText}>
              {item.Likes.length} likes
            </Text>
            <View style = {styles.caption}>
              <Text style = {paperTheme.dark ? styles.lightBoldText : styles.darkBoldText}>
                {item.User.username}{'  '}
              </Text>
              <Text style = {paperTheme.dark ? styles.lightCaptionText : styles.darkCaptionText}>
                {item.caption}
              </Text>
            </View>
            <FlatList
              data = {item.Comments.slice( 0 , 4 )}
              renderItem = { ( { item } ) => (
                <View style = {styles.comment}>
                  <TouchableOpacity onPress = { () => navigation.navigate( 'OtherUserProfile' , { username : getUsername( item.UserId ) } ) }>
                    <Text style = {paperTheme.dark ? styles.lightBoldCommentText : styles.darkBoldCommentText}>
                      { getUsername( item.UserId ) }{'  '}
                    </Text>
                  </TouchableOpacity>
                  <Text style = {paperTheme.dark ? styles.lightCommentText : styles.darkCommentText}>
                    {item.text}
                  </Text>
                </View>
              )}
              keyExtractor = { ( item ) => `${item.id}`}
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
    marginTop : 10,
  },
  lightText : {
    color : 'white',
    fontSize : 20,
  },
  darkText : {
    color : 'black',
    fontSize : 20,
  },
  lightCaptionText : {
    color : 'white',
    fontSize : 20,
    marginBottom : 10,
  },
  darkCaptionText : {
    color : 'black',
    fontSize : 20,
    marginBottom : 10,
  },
  lightBoldText : {
    color : 'white',
    fontSize : 20,
    fontWeight : 'bold',
    marginBottom : 10,
  },
  darkBoldText : {
    color : 'black',
    fontSize : 20,
    fontWeight : 'bold',
    marginBottom : 10,
  },
  postButtons : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'flex-end',
  },
  lightBoldUserInfoText : {
    color : 'white',
    fontSize : 15,
    fontWeight : 'bold',
  },
  darkBoldUserInfoText : {
    color : 'black',
    fontSize : 15,
    fontWeight : 'bold',
  },
  userInfo : {
    flex : 1,
    flexDirection : 'row',
    marginTop : 20,
  },
  caption : {
    flex : 1,
    flexDirection : 'row',
  },
  comment : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
  },
  lightBoldCommentText : {
    color : 'white',
    fontSize : 15,
    fontWeight : 'bold',
    marginBottom : 2,
  },
  darkBoldCommentText : {
    color : 'black',
    fontSize : 15,
    fontWeight : 'bold',
    marginBottom : 2,
  },
  lightCommentText : {
    color : 'white',
    fontSize : 17,
    marginBottom : 2,
  },
  darkCommentText : {
    color : 'black',
    fontSize : 17,
    marginBottom : 2,
  },
});
