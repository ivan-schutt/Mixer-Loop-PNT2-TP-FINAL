import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSoundContext } from '../../contexts/SoundContext';

const MicRecButton = ({ handleNewRecordedSound, buttonIndex }) => {
  const [recording, setRecording] = useState(null);
  const { addSound } = useSoundContext();
  const [recordingCount, setRecordingCount] = useState(1);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso denegado', 'Se necesita permiso para grabar audio');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
    } catch (err) {
      console.error('Error al comenzar la grabación:', err);
    }
  };

  const stopRecordingAndSave = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('No se obtuvo URI del audio grabado');

      const newSound = {
        id: Date.now().toString(),
        name: `Rec Mic ${recordingCount}`,
        file: { uri },
      };

      addSound(newSound);

      if (handleNewRecordedSound) {
        handleNewRecordedSound(newSound);
      }

      setRecordingCount(prev => prev + 1); 
    } catch (error) {
      console.error('Error grabando audio:', error);
      Alert.alert('Error', 'No se pudo guardar la grabación');
    } finally {
      setRecording(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, recording ? styles.buttonRecording : styles.buttonIdle]}
        onPress={() => recording ? stopRecordingAndSave(recording) : startRecording()}
      >
        <Text style={styles.buttonText}>{recording ? 'STOP' : 'REC MIC'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MicRecButton;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIdle: {
    backgroundColor: 'red',
  },
  buttonRecording: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
