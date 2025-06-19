import Counter from "@/components/counter";
import LoopButton from "@/components/loopButton";
import { useSoundContext } from "@/contexts/SoundContext";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SoundLibraryScreen from "../SoundLibraryScreen";

export default function MixerScreen() {
  const [soundLibraryVisible, setSoundLibraryVisible] = useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [buttonSounds, setButtonSounds] = useState([null, null, null, null]);

  // Usar el contexto
  const { selectedSounds } = useSoundContext();

  useEffect(() => {
    console.log('MixerScreen - Sonidos disponibles en contexto:', selectedSounds.length);
  }, [selectedSounds]);

  const handleSoundChange = (buttonIndex) => {
    console.log('Abriendo biblioteca para botón:', buttonIndex);
    console.log('Sonidos disponibles para seleccionar:', selectedSounds.length);

    if (selectedSounds.length === 0) {
      Alert.alert(
        'Sin sonidos',
        'Primero ve al tab "Home" y selecciona algunos sonidos para poder usarlos aquí.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedButtonIndex(buttonIndex);
    setSoundLibraryVisible(true);
  };

  const handleSoundSelect = (sound) => {
    console.log('Sonido seleccionado para botón:', selectedButtonIndex, sound.name);
    if (selectedButtonIndex !== null) {
      const newButtonSounds = [...buttonSounds];
      newButtonSounds[selectedButtonIndex] = sound;
      setButtonSounds(newButtonSounds);
      console.log('Nuevos sonidos de botones:', newButtonSounds);
      // Alert.alert('Sonido asignado', `${sound.name} asignado al botón ${selectedButtonIndex + 1}`);
    }
    setSoundLibraryVisible(false);
    setSelectedButtonIndex(null);
  };

  const clearButton = (buttonIndex) => {
    const newButtonSounds = [...buttonSounds];
    newButtonSounds[buttonIndex] = null;
    setButtonSounds(newButtonSounds);
    console.log('Botón limpiado:', buttonIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mixer</Text>
          <Text style={styles.subtitle}>Toca + para asignar sonidos</Text>
          <Text style={styles.soundCount}>
            {selectedSounds.length} sonidos disponibles
          </Text>
        </View>
        <Counter />

        <View style={styles.mixerGrid}>
          <View style={styles.row}>
            <View style={styles.buttonContainer}>
              <LoopButton
                soundData={buttonSounds[0]}
                onSoundChange={() => handleSoundChange(0)}
              />
              <TouchableOpacity
                style={[styles.clearButton, !buttonSounds[0] && styles.disabledClearButton]}
                onPress={() => clearButton(0)}
                disabled={!buttonSounds[0]}
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <LoopButton
                soundData={buttonSounds[1]}
                onSoundChange={() => handleSoundChange(1)}
              />
              <TouchableOpacity
                style={[styles.clearButton, !buttonSounds[1] && styles.disabledClearButton]}
                onPress={() => clearButton(1)}
                disabled={!buttonSounds[1]}
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.buttonContainer}>
              <LoopButton
                soundData={buttonSounds[2]}
                onSoundChange={() => handleSoundChange(2)}
              />
              <TouchableOpacity
                style={[styles.clearButton, !buttonSounds[2] && styles.disabledClearButton]}
                onPress={() => clearButton(2)}
                disabled={!buttonSounds[2]}
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <LoopButton
                soundData={buttonSounds[3]}
                onSoundChange={() => handleSoundChange(3)}
              />
              <TouchableOpacity
                style={[styles.clearButton, !buttonSounds[3] && styles.disabledClearButton]}
                onPress={() => clearButton(3)}
                disabled={!buttonSounds[3]}
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <SoundLibraryScreen
        visible={soundLibraryVisible}
        onClose={() => {
          console.log('Cerrando biblioteca de sonidos');
          setSoundLibraryVisible(false);
          setSelectedButtonIndex(null);
        }}
        onSoundSelect={handleSoundSelect}
      />
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50, // Espacio extra para scroll
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 5,
  },
  soundCount: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
  mixerGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400, // Altura mínima para que se vea bien
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  clearButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dc3545',
    borderRadius: 15,
  },
  disabledClearButton: {
    backgroundColor: '#6c757d',
    opacity: 0.5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 