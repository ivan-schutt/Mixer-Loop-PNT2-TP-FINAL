import ButtonUpload from '@/components/buttonUpload/ButtonUpload';
import SoundItem from '@/components/soundItem';
import { useSoundContext } from '@/contexts/SoundContext';
import { Picker } from "@react-native-picker/picker";
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAudioContext } from '../../contexts/AudioContext';
import { useAuth } from "../../contexts/AuthContext";

export default function HomeScreen() {
  console.log('=== HomeScreen RENDER ===');

  // Obtener contexto
  const { selectedSounds, addSound, removeSound, isSoundSelected } = useSoundContext();
  // Para obtener el nombre del usuiario que subió el audio
  const { auth } = useAuth();
  // Para filtrar sonidos por tipo
  const [selectedFilter, setSelectedFilter] = useState('TODOS');
  // Para refrescar y obtener sonidos del backend
  const { availableSounds , toggleRefresh } = useAudioContext();

  // Generar tipos de sonidos disponibles dinámicamente
  const soundTypes = (() => {
    // Extraer tipos únicos de availableSounds
    const uniqueTypes = [...new Set(
      availableSounds
        .map(sound => sound.category || sound.type)
        .filter(type => type) // Filtrar valores null/undefined
    )];
    // Crear array con "Todos" primero, luego los tipos encontrados
    return [
      { label: 'Todos los sonidos', value: 'TODOS' },
      ...uniqueTypes.map(type => ({
        label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(), // Capitalizar
        value: type
      }))
    ];
  })();

  // Filtrar sonidos según el tipo seleccionado
  const filteredSounds = availableSounds.filter(sound => {
    if (selectedFilter === 'TODOS') return true;

    return sound.category === selectedFilter || sound.type === selectedFilter;
  });

  console.log('HomeScreen - selectedSounds:', selectedSounds?.length || 0);
  console.log('HomeScreen - addSound function:', typeof addSound);
  console.log('HomeScreen - filteredSounds:', filteredSounds.length, 'of', availableSounds.length);

  //handleToggleSound funciona en relacion al contexto de sound context.
  const handleToggleSound = (sound) => {
    console.log('=== handleToggleSound ===');
    console.log('Sonido a toggle:', sound.name, 'ID:', sound.id);

    try {
      if (isSoundSelected(sound.id)) {
        //si el sonido ya esta seleccionado, se remueve.
        console.log('Removiendo sonido...');
        removeSound(sound.id);

      } else {
        //si el sonido no esta seleccionado, se agrega.
        console.log('Agregando sonido...');
        const added = addSound(sound);
        console.log('Resultado:', added);

      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    console.log('Filtro cambiado a:', value);
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

        <ButtonUpload onUploadSuccess={toggleRefresh} />

        {/* Filtro de sonidos */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filtrar por tipo:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFilter}
              onValueChange={handleFilterChange}
              style={styles.picker}
            >
              {soundTypes.map(type => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Lista de todos los sonidos usando el componente SoundItem */}
        <View style={styles.availableSection}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'TODOS'
              ? 'Todos los Sonidos Disponibles'
              : `Sonidos de ${selectedFilter}`}
            {` (${filteredSounds.length})`}
          </Text>

          {filteredSounds.length === 0 ? (
            <View style={styles.noSoundsContainer}>
              <Text style={styles.noSoundsText}>
                No hay sonidos disponibles para el filtro seleccionado
              </Text>
            </View>
          ) : (
            filteredSounds.map(sound => (
              <SoundItem
                key={sound.id}
                sound={sound}
                isSelected={isSoundSelected(sound.id)}
                //onToggleSelection es la función que se ejecuta cuando se selecciona o deselecciona un sonido.
                //por eso aca se le pasa la funcion handleToggleSound, que es la que se encarga de agregar o quitar el sonido, a
                //sound item. De esta forma, se evita que el componente SoundItem se vuelva a renderizar, y se evita que se vuelva a llamar a la funcion handleToggleSound.
                onToggleSelection={handleToggleSound}
                onUploadSuccess={toggleRefresh}
              />
            ))
          )}
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
  filterSection: {
    margin: 20,
    marginTop: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    height: 50,
  },
  availableSection: {
    margin: 20,
  },
  noSoundsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  noSoundsText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
}); 