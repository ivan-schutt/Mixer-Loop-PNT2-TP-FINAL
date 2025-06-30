import { createContext, useContext, useEffect, useState } from "react";
import { getSounds } from "../services/sounds";
import { useAuth } from "./AuthContext";

const SoundsContext = createContext();

export function SoundsProvider({ children }) {
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

  return <SoundsContext.Provider value={{ availableSounds, toggleRefresh }}>{children}</SoundsContext.Provider>;
}

export function useSoundsContext() {
  const context = useContext(SoundsContext);

  if (!context) {
    throw new Error('useAvailable debe ser usado dentro de un SoundsProvider');
  }

  return context;
}

