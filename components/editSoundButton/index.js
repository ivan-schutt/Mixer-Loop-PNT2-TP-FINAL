import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { updateSound } from "../../services/sounds";

const EditSoundButton = ({ soundData, onUploadSuccess }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (soundData) {
      setTitle(soundData.name || ""); // O la propiedad que corresponda para título
      setType(soundData.category || ""); // O la propiedad tipo que corresponda
    }
  }, [soundData]);

  const handleEdit = async () => {
    if (!title || !type) {
      alert("Por favor completá todos los campos");
      return;
    }

    try {
      await updateSound({ id: soundData.id, title, type });
      alert("¡Audio editado con éxito!");

      if (onUploadSuccess) onUploadSuccess();

      setModalVisible(false);

    } catch (error) {
      console.error("Error al editar el archivo:", error);
      alert("Hubo un error al editar el archivo.");
    }
  };

  return (
    <>
      {/* Botón redondo naranja con ícono ✎ */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>✎</Text>
      </TouchableOpacity>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Título del Audio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el título"
              value={title}
              onChangeText={setTitle}
            />

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

            <View style={styles.buttonRow}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Editar" onPress={handleEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: "#fd7e14", // naranja
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EditSoundButton;
