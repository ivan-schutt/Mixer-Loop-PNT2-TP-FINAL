import { createContext, useContext, useState } from "react";
import { renderSessionEvents, downloadRenderedAudio } from "@/services/eventLogService";
import { useAudioSyncContext } from "./AudioSyncContext";

const EventLogContext = createContext();

export const useEventLogContext = () => {
  const context = useContext(EventLogContext);
  if (!context) {
    throw new Error(
      "useEventLogContext debe usarse dentro de EventLogProvider"
    );
  }
  return context;
};

export const EventLogProvider = ({ children }) => {
  const { resetBeats, activeTracks, stopAllTracks } = useAudioSyncContext();
  const [events, setEvents] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [lastRenderResult, setLastRenderResult] = useState(null);

  const addEvent = (soundUrl, timeInSeconds, action) => {
    // Solo registrar eventos si está grabando
    if (!isRecording) return;

    const newEvent = {
      id: Date.now() + Math.random(), // ID único
      soundUrl,
      timeInSeconds,
      action, // 'play' o 'stop'
      timestamp: new Date().toISOString(),
    };

    setEvents(prev => [...prev, newEvent]);
    console.log('Evento registrado:', newEvent);
  };

  const startRecording = () => {
    // Validar que no haya tracks activos antes de empezar a grabar
    if (activeTracks.current > 0) {      
      alert('❌ Para iniciar grabación, todos los sonidos deben estar pausados');
      return false;
    }

    // Resetear beats al iniciar nueva grabación
    resetBeats();
    setEvents([]); // Limpiar eventos anteriores
    setDownloadUrl(null); // Limpiar URL de descarga anterior
    setLastRenderResult(null); // Limpiar resultado anterior
    setIsRecording(true);
    console.log('🔴 Grabación de sesión iniciada - Beats reseteados');
    return true;
  };

  const stopRecording = async () => {
    // Primero parar todos los sonidos que estén reproduciéndose
    if (activeTracks.current > 0) {      
      stopAllTracks();
    }

    setIsRecording(false);
    console.log('⏹️ Grabación de sesión detenida');
    console.log('📊 LOG DE SESIÓN COMPLETO:', events);
    
    // Enviar eventos al backend
    if (events.length > 0) {
      try {
        console.log('🚀 Enviando sesión al backend...');
        const response = await renderSessionEvents(events);
        console.log('✅ Sesión renderizada exitosamente:', response);
        
        // Guardar URL de descarga y resultado
        if (response.downloadUrl) {
          setDownloadUrl(`http://localhost:8080${response.downloadUrl}`);
          setLastRenderResult(response);
          console.log('🔗 URL de descarga disponible:', response.downloadUrl);
        }
        
        // Limpiar eventos después de envío exitoso
        setEvents([]);
        console.log('🧹 Eventos limpiados después del envío exitoso');
      } catch (error) {
        console.error('❌ Error al enviar sesión al backend:', error);
        console.log('⚠️ Los eventos se mantienen por si quieres reintentarlo');
      }
    } else {
      console.log('ℹ️ No hay eventos para enviar');
    }
    
    // Resetear beats al terminar grabación
    resetBeats();
    console.log('🔄 Beats reseteados al terminar grabación');
  };

  // Función para descargar el archivo usando el service
  const downloadAudio = async () => {
    try {
      const filename = lastRenderResult?.filename || 'mix.mp3';
      await downloadRenderedAudio(downloadUrl, filename);
    } catch (error) {
      console.error('❌ Error al descargar archivo:', error);
      // Opcionalmente podrías mostrar un Alert aquí
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      // startRecording ahora retorna true/false según si pudo empezar
      const started = startRecording();
      if (!started) {
        console.log('No se pudo iniciar grabación');
      }
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const getEventsByAction = (action) => {
    return events.filter(event => event.action === action);
  };

  const getEventsByTimeRange = (startTime, endTime) => {
    return events.filter(event => 
      event.timeInSeconds >= startTime && event.timeInSeconds <= endTime
    );
  };

  return (
    <EventLogContext.Provider
      value={{
        events,
        isRecording,
        downloadUrl,
        lastRenderResult,
        addEvent,
        clearEvents,
        getEventsByAction,
        getEventsByTimeRange,
        startRecording,
        stopRecording,
        toggleRecording,
        downloadAudio,
      }}
    >
      {children}
    </EventLogContext.Provider>
  );
};
