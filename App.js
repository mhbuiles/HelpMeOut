import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View , ScrollView , Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Help Me Out!! This is my first time</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
