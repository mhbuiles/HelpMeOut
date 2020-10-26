import React from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { useTheme } from 'react-native-paper';

export function ChatsList( { navigation } ) {

  const paperTheme = useTheme();

  return (
    <View>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>ChatsList</Text>
      <Button title = 'Go to Chat' onPress = { () => navigation.navigate( 'Chat' )}></Button>
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
