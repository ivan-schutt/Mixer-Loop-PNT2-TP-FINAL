import { useSoundContext } from '@/contexts/SoundContext';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SoundLibraryScreen = ({ visible, onClose, onSoundSelect }) => {
  const [previewSound, setPreviewSound] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(null);
  const { selectedSounds } = useSoundContext();
  
  console.log('=== SoundLibraryScreen RENDER ===');
  console.log('Sonidos en contexto:', selectedSounds?.length || 0);

  useEffect(() => {
    // Configurar audio session
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (previewSound) {
        previewSound.unloadAsync();
      }
    };
  }, []);

  const playPreview = async (sound) => {
    try {
      console.log('Reproduciendo preview:', sound.name);
      
      // Parar preview anterior si existe
      if (previewSound) {
        await previewSound.unloadAsync();
        setPreviewSound(null);
      }

      // Cargar nuevo sonido
      const { sound: audioSound } = await Audio.Sound.createAsync(
        sound.file,
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.7,
        }
      );

      setPreviewSound(audioSound);
      setIsPlayingPreview(sound.id);

      // Configurar callback para cuando termine
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setIsPlayingPreview(null);
        }
      });

    } catch (error) {
      console.error('Error playing preview:', error);
      Alert.alert('Error', 'No se pudo reproducir el preview');
    }
  };

  const stopPreview = async () => {
    try {
      if (previewSound) {
        await previewSound.unloadAsync();
        setPreviewSound(null);
        setIsPlayingPreview(null);
      }
    } catch (error) {
      console.error('Error stopping preview:', error);
    }
  };

  const handleSoundSelect = (sound) => {
    console.log('Sonido seleccionado desde biblioteca:', sound.name);
    stopPreview();
    onSoundSelect(sound);
    onClose();
  };

  const renderSoundItem = ({ item }) => (
    <View style={styles.soundItem}>
      <View style={styles.soundInfo}>
        <Text style={styles.soundName}>{item.name}</Text>
        <Text style={styles.soundCategory}>{item.category}</Text>
      </View>
      
      <View style={styles.soundActions}>
        <TouchableOpacity
          style={[
            styles.previewButton,
            isPlayingPreview === item.id && styles.playingButton
          ]}
          onPress={() => 
            isPlayingPreview === item.id ? stopPreview() : playPreview(item)
          }
        >
          <Text style={styles.buttonText}>
            {isPlayingPreview === item.id ? '⏹' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSoundSelect(item)}
        >
          <Text style={styles.selectButtonText}>Seleccionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Biblioteca de Sonidos</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {selectedSounds && selectedSounds.length > 0 ? (
          <FlatList
            data={selectedSounds}
            keyExtractor={(item) => item.id}
            renderItem={renderSoundItem}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay sonidos disponibles</Text>
            <Text style={styles.emptySubText}>
              Ve al tab Home y selecciona algunos sonidos primero
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 20,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  soundInfo: {
    flex: 1,
  },
  soundName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  soundCategory: {
    fontSize: 14,
    color: '#666',
  },
  soundActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default SoundLibraryScreen; 