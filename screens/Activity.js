import React from 'react';
import { StyleSheet , View , Text , Button } from 'react-native';
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { useTheme } from 'react-native-paper';

export function Activity() {

  const paperTheme = useTheme();

  return (
    <View style = {styles.container}>
      <Text style = {paperTheme.dark ? styles.lightText : styles.darkText}>Activity</Text>
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
        width = {400}
        height = {400}
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
