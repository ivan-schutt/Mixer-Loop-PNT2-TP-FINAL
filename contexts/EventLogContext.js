import { createContext, useContext, useState } from "react";
import { renderSessionEvents } from "@/services/eventLogService";
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
  const { resetBeats } = useAudioSyncContext();
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
    // Resetear beats al iniciar nueva grabación
    resetBeats();
    setEvents([]); // Limpiar eventos anteriores
    setDownloadUrl(null); // Limpiar URL de descarga anterior
    setLastRenderResult(null); // Limpiar resultado anterior
    setIsRecording(true);
    console.log('🔴 Grabación de sesión iniciada - Beats reseteados');
  };

  const stopRecording = async () => {
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

  // Función para descargar el archivo
  const downloadAudio = () => {
    if (downloadUrl) {
      // Crear elemento de descarga temporal
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = lastRenderResult?.filename || 'mix.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('📥 Descarga iniciada:', downloadUrl);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
