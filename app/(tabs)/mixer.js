import Counter from "@/components/counter";
import LoopButton from "@/components/loopButton";
import MicRecButton from "@/components/MicRecButton";
import SessionRecButton from "@/components/SessionRecButton";
import { useSoundContext } from "@/contexts/SoundContext";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import SoundLibraryScreen from "../SoundLibraryScreen";

export default function MixerScreen() {
  const PADS_TOTAL = 4;
  //const COLS = 4;
  const [soundLibraryVisible, setSoundLibraryVisible] = useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const { selectedSounds } = useSoundContext();
  const [buttonSounds, setButtonSounds] = useState(Array(PADS_TOTAL).fill(null));

  useEffect(() => {
    console.log('MixerScreen - Sonidos disponibles en contexto:', selectedSounds.length);
    setButtonSounds(prevButtonSounds => {
      const selectedIds = new Set(selectedSounds.map(s => s.id));
      return prevButtonSounds.map(sound => {
        if (sound && !selectedIds.has(sound.id)) {
          return null; // limpiar botón si sonido no existe
        }
        return sound;
      });
    });
  }, [selectedSounds]);

  const handleSoundChange = (buttonIndex) => {
    console.log('Abriendo biblioteca para botón:', buttonIndex);
    console.log('Sonidos disponibles para seleccionar:', selectedSounds.length);

    if (selectedSounds.length === 0) {
      alert('Primero ve al tab "Home" y selecciona algunos sonidos para poder usarlos aquí.');
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

  // Encuentra el primer índice disponible en buttonSounds (micRecButton)
/*   const getFirstAvailableIndex = () => buttonSounds.findIndex((s) => !s); */

  const renderPad = ({ item: soundData, index }) => (
    <View style={styles.buttonContainer}>
      <LoopButton
        soundData={soundData}
        onSoundChange={() => handleSoundChange(index)}
      />
      <TouchableOpacity
        style={[
          styles.clearButton,
          !soundData && styles.disabledClearButton,
        ]}
        onPress={() => clearButton(index)}
        disabled={!soundData}
      >
        <Text style={styles.clearButtonText}>Limpiar</Text>
      </TouchableOpacity>
    </View>
  );

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

        <View style={styles.sessionRecContainer}>
          <SessionRecButton />
        </View>

        <View>
          <MicRecButton handleNewRecordedSound={() => {}} />
        </View>

        <FlatList
          data={buttonSounds}
          renderItem={renderPad}
          keyExtractor={(item, index) => item?.id || index.toString()}
          //numColumns={COLS}
          horizontal={true}
          scrollEnabled={true}
          contentContainerStyle={[styles.mixerGrid, { marginTop: -100 }]}
          ItemSeparatorComponent={() => <View style={{ width: -100 }} />}
        />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
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
    minHeight: 400,
  },
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: 15, // 👈 espacio entre cada botón horizontalmente
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
  sessionRecContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
}); 