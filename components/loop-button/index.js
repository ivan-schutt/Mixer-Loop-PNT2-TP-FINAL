import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

const LoopButton = ({ soundData, onSoundChange }) => {
  const [sound, setSound] = useState(null); // Para móviles
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs para Web Audio
  const audioContextRef = useRef(null);
  const bufferRef = useRef(null);
  const sourceRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Cargar el archivo de audio
  const loadSound = async (audioFile) => {
    if (isLoadingRef.current) return; // Evitar cargas simultáneas
    isLoadingRef.current = true;

    try {
      setIsLoading(true);

      if (Platform.OS === 'web') {
        // Web: Usar AudioContext para precisión en loops
        await cleanupWebSound();
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext)();
        }

        const response = await fetch(audioFile.uri || audioFile);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        bufferRef.current = audioBuffer;

      } else {
        await cleanupMobileSound();
        const { sound: audioSound } = await Audio.Sound.createAsync(
          audioFile,
          {
            shouldPlay: false,
            isLooping: true,
            volume: 1.0, // Velocidad normal
            rate: 1.0, // Mantiene pitch correcto
            shouldCorrectPitch: true,
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
      }
    } catch (error) {
      console.error('Error cargando el audio:', error);
      Alert.alert('Error', 'No se pudo cargar el archivo de audio');
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Función para reproducir/pausar el audio
  const togglePlayback = async () => {
    if (Platform.OS === 'web') {
      // Web
      if (!bufferRef.current || !audioContextRef.current) {
        onSoundChange?.();
        return;
      }

      if (isPlaying) {
        await cleanupWebSound();
        setIsPlaying(false);
      } else {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = bufferRef.current;
        source.loop = true;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
      }

    } else {
      // Móvil
      if (!sound) {
        onSoundChange?.();
        return;
      }

      try {
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) {
          Alert.alert('Error', 'El sonido no está cargado todavía');
          return;
        }

        if (status.isPlaying) {
          await sound.stopAsync();
        } else {
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Error controlando la reproducción:', error);
        Alert.alert('Error', 'No se pudo controlar la reproducción');
      }
    }
  };

   // Descargar y limpiar sonido móvil si ya había uno
  const cleanupMobileSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (e) {
        console.warn('Error limpiando sonido anterior:', e);
      }
    }
    setSound(null);
  };

  // Limpiar audio web si estaba sonando
  const cleanupWebSound = async () => {
    try {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (e) {
          console.warn('sourceRef ya detenido o no pudo detenerse:', e.message);
        }
        try {
          sourceRef.current.disconnect();
        } catch (e) {
          console.warn('Error desconectando source:', e.message);
        }
        sourceRef.current = null;
      }

      bufferRef.current = null;

      if (audioContextRef.current) {
        // Cerramos el contexto actual y creamos uno nuevo para limpiar todo
        await audioContextRef.current.close().catch((err) => {
          console.warn('Error cerrando audioContext:', err);
        });
        audioContextRef.current = new (window.AudioContext)();
      }

    } catch (err) {
      console.warn('Error limpiando WebAudio:', err);
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  // Cargar el audio si cambia
  useEffect(() => {
    const resetSound = async () => {
      if (soundData && soundData.file) {
        await loadSound(soundData.file);
      } else {
        // Se limpió soundData: detener sonido + limpiar visual
        if (Platform.OS === 'web') {
          cleanupWebSound();
        } else {
          await cleanupMobileSound();
        }

        // Forzar actualización visual
        setIsPlaying(false);
      }
    };

    resetSound();
  }, [soundData]);



  // Audio session para móviles
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }

    // Limpiar al desmontar el componente
    return () => {
      if (Platform.OS === 'web') {
        cleanupWebSound();
      } else {
        cleanupMobileSound();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return isPlaying ? '⏸' : '▶';
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={togglePlayback}
      disabled={isLoading}
      accessibilityLabel={soundData ? `Botón de sonido ${soundData.name}` : 'Botón sin sonido asignado'}
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
