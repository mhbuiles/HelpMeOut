import React , { useEffect , useState , useCallback } from 'react';
import { StyleSheet , View , Text , Button , FlatList , Image , ScrollView , TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { IconButton , TextInput , Colors , useTheme } from 'react-native-paper';

export function Post( { route , navigation } ) {

  const [ post , setPost ] = useState( {} );
  const [ likes , setLikes ] = useState( 0 );
  const [ postComments , setPostComments ] = useState( [] );
  const [ postUsername , setPostUsername ] = useState( '' );
  const [ postUserprofilepic , setPostUserprofilepic ] = useState( '' );
  const [ comment , setComment ] = useState( '' );
  const [ allUsers , setAllUsers ] = useState( [] );
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
          setPostUsername( data.User.username );
          setPostUserprofilepic( data.User.profilepic );
        })
        .catch( function ( err ) {
          console.log( err );
        })
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

  function getUsername( id ) {
    let user = allUsers.filter( user => user.id === id.toString() );
    return user[0].username;
  };

  return (
    <View style = {styles.container}>
      <View style = {styles.userInfo} >
        <Image
          style = { { height : 20 , width : 20 , borderRadius : 100 } }
          source = { { uri : postUserprofilepic } }
        />
        <TouchableOpacity onPress = { () => navigation.navigate( 'OtherUserProfile' , { username : postUsername } ) }>
          <Text style = {paperTheme.dark ? styles.lightBoldUserInfoText : styles.darkBoldUserInfoText} >  {postUsername}</Text>
        </TouchableOpacity>
      </View>
      <Image
        style = { { height : 400 , width : 420 } }
        source = { { uri : post.image} }
      />
      <Text style = {paperTheme.dark ? styles.lightBoldText : styles.darkBoldText}>{likes} likes</Text>
      <View style = {styles.caption}>
        <Text style = {paperTheme.dark ? styles.lightBoldText : styles.darkBoldText}>
          {postUsername}{'  '}
        </Text>
        <Text style = {paperTheme.dark ? styles.lightCaptionText : styles.darkCaptionText}>
          {post.caption}
        </Text>
      </View>
      <View style = {styles.commentsList}>
        <FlatList
          data = {postComments}
          renderItem = { ( { item } ) => (
            <View style = {styles.comment}>
              <Text style = {paperTheme.dark ? styles.lightBoldCommentText : styles.darkBoldCommentText}>
                { getUsername( item.UserId ) }{'  '}
              </Text>
              <Text style = {paperTheme.dark ? styles.lightCommentText : styles.darkCommentText}>
                {item.text}
              </Text>
            </View>
          )}
          keyExtractor = { ( item ) => `${item.id}`}
        />
      </View>
      <View style = {styles.input}>
        <TextInput
          placeholder = 'Add a comment...'
          autoCapitalize = 'none'
          onChangeText = { text => {
            setComment(text);
          }}
          style = {paperTheme.dark ? styles.darkTextInput : styles.lightTextInput}
        />
        <IconButton
          icon = 'send'
          color = {Colors.red500}
          onPress = {handleComment}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
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
  darkTextInput : {
    color : 'white',
    backgroundColor : '#fd5c63',
    width : 360,
    height : 30,
  },
  lightTextInput : {
    width : 350,
    height : 30,
    backgroundColor : '#fd5c63',
    color : 'white',
  },
  userInfo : {
    flex : 1,
    flexDirection : 'row',
    marginTop : 0,
    marginBottom : 0,
    alignItems : 'center',
    marginLeft : 10,
  },
  darkBoldUserInfoText : {
    color : 'black',
    fontSize : 15,
    fontWeight : 'bold',
  },
  lightBoldUserInfoText : {
    color : 'white',
    fontSize : 15,
    fontWeight : 'bold',
  },
  lightBoldText : {
    color : 'white',
    fontSize : 20,
    fontWeight : 'bold',
    marginBottom : 10,
    marginLeft : 10,
  },
  darkBoldText : {
    color : 'black',
    fontSize : 20,
    fontWeight : 'bold',
    marginBottom : 5,
  },
  caption : {
    flex : 1,
    flexDirection : 'row',
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
  input : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
    marginBottom : 0,
    marginLeft : 10,
    marginTop : 5,
    padding : 0,
  },
  comment : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
  },
  commentsList : {
    flex : 1,
    marginTop : 10,
    width : 400,
    marginLeft : 10,
  }
});
