import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudioContext } from "../../contexts/AudioContext";
import { useAuth } from "../../contexts/AuthContext";
import { procesarYGuardarSonido } from "../../services/soundUploader";

export default function ButtonUpload({ }) {
  const { toggleRefresh } = useAudioContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const { auth } = useAuth();

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) setFile(result.assets[0]);
  };

  const handleUpload = async () => {
    if (!title || !file) {
      alert("Por favor completá todos los campos");
      return;
    }

    try {
      const sonidoGuardado = await procesarYGuardarSonido({
        title,
        type,
        file,
        user: auth.user,
      });

      console.log("Archivo subido. URL pública:", sonidoGuardado.url);

      alert("¡Audio subido con éxito!");
      if (toggleRefresh) toggleRefresh();

      resetHooks();
    } catch (error) {
      console.error("Error al subir el archivo desde el UploadButton:", error);
      alert("Hubo un error al subir el archivo.");
    }
  };

  const resetHooks = _ => {
    setModalVisible(false);
    setTitle("");
    setFile(null);
  }

  return (
    <View style={styles.card}>
      <Button title="Subir Audio" onPress={() => setModalVisible(true)} />

      {/* ---------- Modal ---------- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Título */}
            <Text style={styles.label}>Título del Audio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Música de fondo"
              value={title}
              onChangeText={setTitle}
            />

            {/* Tipo */}
            <Text style={[styles.label, { marginTop: 8 }]}>Tipo</Text>
            <Picker
              selectedValue={type}
              onValueChange={setType}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar tipo" value="" enabled={false} />
              <Picker.Item label="Bass" value="BASS" />
              <Picker.Item label="Drums" value="DRUMS" />
              <Picker.Item label="Pads" value="PADS" />
              <Picker.Item label="Shaker" value="SHAKERS" />
            </Picker>

            {/* Archivo */}
            <TouchableOpacity onPress={handlePickFile} style={styles.fileButton}>
              <Text style={styles.fileButtonText}>
                {file ? `Archivo: ${file.name}` : "Seleccionar archivo .mp3"}
              </Text>
            </TouchableOpacity>

            {/* Botones */}
            <View style={styles.buttonRow}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Subir" onPress={handleUpload} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "88%",
  },
  label: { fontWeight: "bold", marginBottom: 4 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  fileButton: {
    backgroundColor: "#1150d2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  fileButtonText: { color: "#fff", textAlign: "center" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
});