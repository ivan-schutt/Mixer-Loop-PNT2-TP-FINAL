import SoundItem from '@/components/sound-item';
import { useSoundContext } from '@/contexts/SoundContext';
import { getSounds } from '@/services/sounds';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  console.log('=== HomeScreen RENDER ===');

  // Obtener contexto
  const contextValue = useSoundContext();
  const { selectedSounds, addSound, removeSound, isSoundSelected } = contextValue;

  // Cargar sonidos disponibles
  const [availableSounds, setAvailableSounds] = useState([]);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const sounds = await getSounds(); 
        setAvailableSounds(sounds);
      } catch (error) {
        console.error('Error al obtener sonidos:', error);
      } 
    };

    fetchSounds();
  }, []);

  console.log('HomeScreen - Contexto obtenido:', !!contextValue);
  console.log('HomeScreen - selectedSounds:', selectedSounds?.length || 0);
  console.log('HomeScreen - addSound function:', typeof addSound);

  const handleToggleSound = (sound) => {
    console.log('=== handleToggleSound ===');
    console.log('Sonido a toggle:', sound.name, 'ID:', sound.id);

    try {
      if (isSoundSelected(sound.id)) {
        console.log('Removiendo sonido...');
        removeSound(sound.id);

      } else {
        console.log('Agregando sonido...');
        const added = addSound(sound);
        console.log('Resultado:', added);

      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Biblioteca de Sonidos</Text>
          <Text style={styles.subtitle}>
            Sonidos seleccionados: {selectedSounds?.length || 0} / {availableSounds.length}
          </Text>
        </View>

        {/* Mostrar sonidos seleccionados */}
        {selectedSounds && selectedSounds.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Sonidos Seleccionados</Text>
            {selectedSounds.map(sound => (
              <View key={sound.id} style={styles.selectedItem}>
                <View style={styles.selectedSoundInfo}>
                  <Text style={styles.selectedText}>{sound.name}</Text>
                  <Text style={styles.selectedCategory}>{sound.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSound(sound.id)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Lista de todos los sonidos usando el componente SoundItem */}
        <View style={styles.availableSection}>
          <Text style={styles.sectionTitle}>Todos los Sonidos Disponibles</Text>
          {availableSounds.map(sound => (
            <SoundItem
              key={sound.id}
              sound={sound}
              isSelected={isSoundSelected(sound.id)}
              //onToggleSelection es la función que se ejecuta cuando se selecciona o deselecciona un sonido.
              //por eso aca se le pasa la funcion handleToggleSound, que es la que se encarga de agregar o quitar el sonido, a
              //sound item. De esta forma, se evita que el componente SoundItem se vuelva a renderizar, y se evita que se vuelva a llamar a la funcion handleToggleSound.
              onToggleSelection={handleToggleSound}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  selectedSoundInfo: {
    flex: 1,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  selectedCategory: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  availableSection: {
    margin: 20,
  },
}); 