import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

const LoopButton = ({ soundData, onSoundChange }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar el archivo de audio
  const loadSound = async (audioFile) => {
    try {
      setIsLoading(true);
      
      // Si hay un sonido anterior, descargarlo
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: audioSound } = await Audio.Sound.createAsync(
        audioFile,
        {
          shouldPlay: false,
          isLooping: true,
          volume: 1.0,
          rate: 1.0,                    // Velocidad normal
          shouldCorrectPitch: true,     // Mantiene pitch correcto
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
        }
      );
      setSound(audioSound);
      
      // Configurar el callback para cuando termine la reproducción
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying || false);
        }
      });
      
    } catch (error) {
      console.error('Error cargando el audio:', error);
      Alert.alert('Error', 'No se pudo cargar el archivo de audio');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reproducir/pausar el audio
  const togglePlayback = async () => {
    if (!sound) {
      // Si no hay sonido asignado, abrir selector
      if (onSoundChange) {
        onSoundChange();
      } else {
        Alert.alert('Sin sonido', 'No hay ningún sonido asignado a este botón');
      }
      return;
    }

    try {
      if (isPlaying) {
        await sound.stopAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error controlando la reproducción:', error);
      Alert.alert('Error', 'No se pudo controlar la reproducción');
    }
  };

  // Cargar el audio cuando cambie soundData
  useEffect(() => {
    if (soundData && soundData.file) {
      loadSound(soundData.file);
    }
  }, [soundData]);

  // Configurar audio session al montar
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Limpiar al desmontar el componente
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const getButtonStyle = () => {
    if (isLoading) return styles.disabledButton;
    if (!soundData) return styles.emptyButton;
    if (isPlaying) return styles.playingButton;
    return styles.playButton;
  };

  const getButtonText = () => {
    if (isLoading) return '...';
    if (!soundData) return '+';
    if (isPlaying) return '⏸';
    return '▶';
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={togglePlayback}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>
        {getButtonText()}
      </Text>
      {soundData && (
        <Text style={styles.soundName} numberOfLines={1}>
          {soundData.name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  playingButton: {
    backgroundColor: '#FF9800',
  },
  emptyButton: {
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#BDBDBD',
    borderStyle: 'dashed',
  },
  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  soundName: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 2,
  },
});

export default LoopButton; 