import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAudioSyncContext } from "../../contexts/AudioSyncContext";

const Counter = () => {
  const { currentCount, beats, currentBar } = useAudioSyncContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Count: {currentCount}</Text>     
    </View>
  );
};  

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
});

export default Counter;  