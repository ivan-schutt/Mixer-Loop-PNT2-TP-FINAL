import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../../contexts/AuthContext";
import { UseSelectedContext } from '../../contexts/SelectedContext';
import { useSoundsContext } from '../../contexts/SoundsContext';
import { procesarYGuardarSonido } from '../../services/soundUploader';

const MicRecButton = ({ handleNewRecordedSound }) => {
  const [recording, setRecording] = useState(null);
  const { addSound } = UseSelectedContext();
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { auth } = useAuth();
  const { toggleRefresh } = useSoundsContext();

  useEffect(() => {
    checkPermission()
    checkMicAvailable()
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'r' || event.key === 'R') {
        if (recording) {
          stopRecordingAndSave();
        } else {
          startRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      const permission = await checkPermission();
      if (!permission) {
        alert('Permiso denegado. Se necesita permiso para grabar audio');
        return;
      }

      const micAvailable = await checkMicAvailable();
      if (!micAvailable) {
        alert('Sin micrófono. No se detectó ningún micrófono disponible.');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
      await recording.startAsync();
      setRecording(recording);

    } catch (err) {
      console.error('Error al comenzar la grabación:', err);
    }
  };

  const stopRecordingAndSave = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('No se obtuvo URI del audio grabado');

      const title = `Rec Mic ${getFormattedDateTime()}`;
      const type = 'MICREC';
      const file = { uri, name: 'micrec.mp3' };

      const sonidoGuardado = await procesarYGuardarSonido({
        title,
        type,
        file,
        user: auth.user,
      });

      const newSound = {
        id: sonidoGuardado.id,
        name: sonidoGuardado.title,
        file: { uri: sonidoGuardado.url },
        type: sonidoGuardado.type,
        fromMic: true,
      };

      addSound(newSound);
      if (handleNewRecordedSound) handleNewRecordedSound(newSound);
      if (toggleRefresh) toggleRefresh();

      console.log('Grabación subida y guardada con éxito:', sonidoGuardado.url);
    } catch (error) {
      console.error('Error grabando o subiendo audio:', error);
      alert('Error. No se pudo guardar la grabación');
    } finally {
      setRecording(null);
    }
  };

  const checkPermission = async () => {
    try {
      const permission = await Audio.getPermissionsAsync();
      setHasPermission(permission.granted);
      return permission.granted;
    } catch (err) {
      console.warn('Error al pedir permisos:', err);
      setHasPermission(false);
      return false;
    }
  };

  const checkMicAvailable = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const micAvailable = devices.some(device => device.kind === 'audioinput');
        setIsMicAvailable(micAvailable);
        return micAvailable;
      } else {
        setIsMicAvailable(true);
        return true;
      }
    } catch (err) {
      setIsMicAvailable(false);
      return false;
    }
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    const sec = pad(now.getSeconds());

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          recording ? styles.buttonRecording : styles.buttonIdle,
          (!hasPermission || !isMicAvailable) && { opacity: 0.4 },
        ]}
        onPress={() => (recording ? stopRecordingAndSave() : startRecording())}
      >
        <Text style={styles.buttonText}>{recording ? 'STOP' : 'REC MIC'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIdle: {
    backgroundColor: 'red',
  },
  buttonRecording: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MicRecButton;