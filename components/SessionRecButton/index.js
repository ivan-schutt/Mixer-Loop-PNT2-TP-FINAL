import { useEventLogContext } from "@/contexts/EventLogContext";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

const SessionRecButton = () => {
  const { 
    isRecording, 
    toggleRecording, 
    downloadUrl, 
    downloadAudio, 
    lastRenderResult 
  } = useEventLogContext();

  const getButtonStyle = () => {
    return isRecording ? styles.recordingButton : styles.stoppedButton;
  };

  const getButtonText = () => {
    return isRecording ? "⏹️ STOP REC" : "🔴 START REC";
  };

  const handleDownload = () => {
    if (downloadUrl) {
      downloadAudio();
      Alert.alert(
        "Descarga iniciada", 
        `Descargando: ${lastRenderResult?.filename || 'mix.mp3'}`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle()]}
        onPress={toggleRecording}
      >
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>
      
      {downloadUrl && !isRecording && (
        <TouchableOpacity
          style={[styles.button, styles.downloadButton]}
          onPress={handleDownload}
        >
          <Text style={styles.buttonText}>📥 DOWNLOAD</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 10,
  },
  recordingButton: {
    backgroundColor: "#FF4444",
  },
  stoppedButton: {
    backgroundColor: "#666666",
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SessionRecButton; 