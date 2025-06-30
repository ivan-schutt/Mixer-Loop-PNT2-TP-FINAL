import { createContext, useContext, useEffect, useState } from "react";
import { getSounds } from "../services/sounds";
import { useAuth } from "./AuthContext";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [refresh, setRefresh] = useState(null);
  const { auth } = useAuth();
  const [availableSounds, setAvailableSounds] = useState([]);

  useEffect(() => {
    if (!auth?.user?._id) return;

    const fetchSounds = async () => {
      try {
        const sounds = await getSounds(auth.user._id);
        setAvailableSounds(sounds);
        console.log('refresh', refresh);
      } catch (error) {
        console.error('Error al obtener sonidos:', error);
      }
    };

    fetchSounds();
  }, [refresh, auth]);

  const toggleRefresh = () => setRefresh(prev => !prev);

  return <SoundContext.Provider value={{ availableSounds, toggleRefresh }}>{children}</SoundContext.Provider>;
}

export function useSoundContext() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error('useAvailable debe ser usado dentro de un SoundProvider');
  }

  return context;
}

