import { useAudioSyncContext } from "@/contexts/AudioSyncContext";
import { useEventLogContext } from "@/contexts/EventLogContext";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

const LoopButton = ({ soundData, onSoundChange }) => {
  const { addActiveTrack, removeActiveTrack, currentCount, beats } = useAudioSyncContext();
  const { addEvent } = useEventLogContext();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //agrego estado cuedForPlayback para agregar a la logica de reproduccion
  const [cuedForPlayback, setCuedForPlayback] = useState(false);

  //agrego istado para confirmar que se esta reproduciendo en Sync, ideaLmente esto deberia manejarese
  //con el isPlaying que ya tenemos, posiblemente tengamos que refactorear despues
  const [isPlayingOnSync, setIsPlayingOnSync] = useState(false);

  //agrego shouldlisten para agregar logica de reproduccion en sync, de esta forma podemos lograr
  //que el componente no este usando useEffect todo el tiempo, sino solo cuando se necesite.
  const [shouldListen, setShouldListen] = useState(false);

  //en principio que queria aplicar use effect con condicional del esitlo, shouldListen ? [currentCount] : []); 
  //para que solo se ejecute cuando se ncesite, pero use effect de esa forma tendria que usarse en funciones separadas y eso
  // no es posible, useEffect solo se puede usar en el componente principal, despues analizamos posibles soluciones
  useEffect(() => {
    if (currentCount === 1 && shouldListen && isPlayingOnSync === false && cuedForPlayback === true) {
      sound.playAsync();
      setIsPlayingOnSync(true);
      setShouldListen(false);     
      registerPlaybackEvent('play');
    } else if ((currentCount === 1 || currentCount === 0) && shouldListen && isPlayingOnSync === true) {
      sound.stopAsync();
      setIsPlayingOnSync(false);
      setShouldListen(false);      
      registerPlaybackEvent('stop');
    }
  }, [currentCount, shouldListen]);

  // Cargar el audio cuando cambie soundData. Si no hay soundData, limpiar el sonido actual.
  // Si el sonido es borrado de este componente, se detiene la reproducción y deja el espacio para seleccionar otro sonido.
  useEffect(() => {
    const cleanupSound = async () => {
      if (sound) {
        await sound.unloadAsync();
        stopPlayback();
        setSound(null);
        setIsPlaying(false);
        setCuedForPlayback(false);
        setShouldListen(false);
        setIsPlayingOnSync(false);
      }
    };

    const handleSoundLoad = async () => {
      try {
        await loadSound(soundData.file);

        if (soundData.fromMic) {
          startPlayback(); // Play automático de MicRecButton
        }
      } catch (error) {
        console.error('Error cargando sonido:', error);
      }
    };

    if (soundData && soundData.file) {
      handleSoundLoad();
    } else {
      cleanupSound();
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

  // Cargar el archivo de audio
  const loadSound = async (audioFile) => {
    try {
      setIsLoading(true);

      // Si hay un sonido anterior, descargarlo
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: audioSound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: false,
        isLooping: true,
        volume: 1.0,
        rate: 1.0, // Velocidad normal
        shouldCorrectPitch: true, // Mantiene pitch correcto
        pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
      });
      setSound(audioSound);

      // Configurar el callback para cuando termine la reproducción
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying || false);
        }
      });
    } catch (error) {
      console.error("Error cargando el audio:", error);
      Alert.alert("Error", "No se pudo cargar el archivo de audio");
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
        Alert.alert("Sin sonido", "No hay ningún sonido asignado a este botón");
      }
      return;
    }

    try {
      if (isPlaying) {
        stopPlayback();
        console.log("stopPlayback");
      } else {
        startPlayback();
        console.log("startPlayback");
      }
    } catch (error) {
      console.error("Error controlando la reproducción:", error);
      Alert.alert("Error", "No se pudo controlar la reproducción");
    }
  };

  // Función auxiliar para registrar eventos de reproducción
  const registerPlaybackEvent = (action) => {
    if (soundData && soundData.file) {
      const timeInSeconds = beats.current * 0.5;
      const soundUrl = soundData.file.uri || soundData.file || soundData.name;
      addEvent(soundUrl, timeInSeconds, action);
    }
  };

  //Limpiar toda esta logica a futuro.
  //la idea es que por un tema de eficiencia, solo cuando se haya querido hacer play o stop, el componente comienze a raccionar al contador
  //de esta manera, no estan todos los componentes prestando atencion al contador todo el tiempo, sino solo cuando se necesite.
  const startPlayback = () => {
    console.log("startPlayback ejecutado");
    addActiveTrack();
    setCuedForPlayback(true);
    setShouldListen(true);
  };

  const stopPlayback = () => {
    removeActiveTrack();
    setShouldListen(true);
    setCuedForPlayback(false);
  };

  const getButtonStyle = () => {
    if (isLoading) return styles.disabledButton;
    if (!soundData) return styles.emptyButton;
    if (isPlaying) return styles.playingButton;
    return styles.playButton;
  };

  const getButtonText = () => {
    if (isLoading) return "...";
    if (!soundData) return "+";
    if (isPlaying) return "⏸";
    return "▶";
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={togglePlayback}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>{getButtonText()}</Text>
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
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
  },
  playButton: {
    backgroundColor: "#4CAF50",
  },
  playingButton: {
    backgroundColor: "#FF9800",
  },
  emptyButton: {
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#BDBDBD",
    borderStyle: "dashed",
  },
  disabledButton: {
    backgroundColor: "#666666",
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  soundName: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
    paddingHorizontal: 2,
  },
});

export default LoopButton;
