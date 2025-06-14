import { Audio } from 'expo-av';
import React, { useRef, useState } from 'react';


import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SoundItem = ({ 
  sound, 
  isSelected, 
  onToggleSelection 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Referencia al sonido, a diferencia de useState, no causa un re-renderizado del componente cuando se actualiza.
  const soundRef = useRef(null);

  const handlePlayPreview = async () => {
    try {
      if (isPlaying) {
        // Si está reproduciéndose, detener
        if (soundRef.current) {
          // Detener la reproducción del sonido. Solo se detiene el sonido, no se elimina de la memoria.
          await soundRef.current.stopAsync();
          // Descargar el sonido de la memoria. Libera memoria.
          await soundRef.current.unloadAsync();
          //Sirve limpiar la referencia al sonido, para evitar posibles problemas de memoria.
          soundRef.current = null;
        }
        setIsPlaying(false);
      } else {
        // Si no está reproduciéndose, iniciar
        setIsLoading(true);


        // Crear el sonido.
        const { sound: audioSound } = await Audio.Sound.createAsync(
          sound.file,
          { 
            shouldPlay: true,
            isLooping: false,
            volume: 0.7,
          }
        );

        soundRef.current = audioSound;
        setIsPlaying(true);
        setIsLoading(false);

        // Configurar callback para cuando termine la reproducción de la previsualización. setOnPlaybackStatusUpdate esta hecho para esto,
        // y al terminar la reproducción, status.didJustFinish es true. Despues de esto,se pone setIsPlaying(false)
        // y se limpia la referencia al sonido.
        audioSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            soundRef.current = null;
          }
        });
      }
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
      Alert.alert('Error', 'No se pudo reproducir el sonido');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const handleToggleSelection = () => {
    // Detener reproducción si está activa al cambiar selección
    if (isPlaying && soundRef.current) {
      soundRef.current.stopAsync();
      setIsPlaying(false);
    }
    //onToggleSelection es la función que se ejecuta cuando se selecciona o deselecciona un sonido.
    //por dentro tiene la funcion handleToggleSound de homescreen o index.js en screens o tabs, que es la que se encarga de agregar o quitar el sonido.
    onToggleSelection(sound);
  };

  return (
    <View style={[styles.container, isSelected && styles.selectedContainer]}>
      <View style={styles.soundInfo}>
        <Text style={styles.soundName}>{sound.name}</Text>
        <View style={styles.soundMeta}>
          <Text style={styles.soundCategory}>{sound.category}</Text>
          {sound.bpm && <Text style={styles.soundBpm}>{sound.bpm} BPM</Text>}
          {sound.duration && <Text style={styles.soundDuration}>{sound.duration}</Text>}
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        {/* Botón de Play/Preview */}
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playingButton]}
          onPress={handlePlayPreview}
          disabled={isLoading}
        >
          <Text style={styles.playButtonText}>
            {isLoading ? '⏳' : isPlaying ? '⏹' : '▶'}
          </Text>
        </TouchableOpacity>
        
        {/* Botón de Agregar/Quitar */}
        <TouchableOpacity
          style={[styles.toggleButton, isSelected && styles.selectedButton]}
          onPress={handleToggleSelection}
        >
          <Text style={styles.toggleButtonText}>
            {isSelected ? '✓' : '+'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedContainer: {
    backgroundColor: '#f8f9fa',
    borderColor: '#28a745',
    borderWidth: 2,
  },
  soundInfo: {
    flex: 1,
    marginRight: 12,
  },
  soundName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  soundMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  soundCategory: {
    fontSize: 14,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  soundBpm: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
  },
  soundDuration: {
    fontSize: 12,
    color: '#6c757d',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingButton: {
    backgroundColor: '#dc3545',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#28a745',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#dc3545',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SoundItem; 