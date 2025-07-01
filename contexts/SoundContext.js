import { createContext, useContext, useEffect, useState } from 'react';
import { useAudioContext } from './AudioContext';

const SoundContext = createContext();

// useSoundContext
// SoundContext
// SoundProvider

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext debe usarse dentro de SoundProvider');
  }

  // Log cada vez que se accede al contexto
  console.log('=== useSoundContext llamado ===');
  console.log('selectedSounds count:', context.selectedSounds?.length || 0);
  console.log('selectedSounds:', context.selectedSounds?.map(s => s.name) || []);
  console.log('=== fin useSoundContext ===');

  return context;
};

export const SoundProvider = ({ children }) => {
  const [selectedSounds, setSelectedSounds] = useState([]);
  const { availableSounds: existingSounds } = useAudioContext();

  // Se ejecuta cuando cambian los sonidos disponibles
  // Filtra los sonidos seleccionados para quedarse solo con los que aún existen
  useEffect(() => {
    if (!existingSounds || existingSounds.length === 0) return;

    const existingIds = new Set(existingSounds.map(s => s.id));

    setSelectedSounds(prev =>
      prev.filter(s => existingIds.has(s.id) || s.pending === true)
    );
  }, [existingSounds]);

  const markSoundAsNotPending = (soundId) => {
    setSelectedSounds(prev =>
      prev.map(s =>
        s.id === soundId ? { ...s, pending: false } : s
      )
    );
  };

  // Agrega un sonido si no está ya seleccionado
  const addSound = (sound) => {
    console.log('=== ADD SOUND ===');
    console.log('Agregando sonido al contexto:', sound.name, 'ID:', sound.id);
    console.log('Sonidos antes de agregar:', selectedSounds.length);
    const isAlreadySelected = selectedSounds.some(s => s.id === sound.id);
    // Verificar si el sonido ya está seleccionado. some es un metodo que se usa para verificar si un elemento existe en un array.
    //some devuelve un booleano. verifica todos los elementos del array y si alguno coincide con el id del sonido que se esta agregando, retorna true. 
    if (!isAlreadySelected) {
      setSelectedSounds(prev => {
        const newSounds = [...prev, sound];
        console.log('Nuevos sonidos en contexto:', newSounds.length);
        console.log('Lista actualizada:', newSounds.map(s => `${s.id}:${s.name}`));
        return newSounds;
      });
      return true; // Sonido agregado
    } else {
      console.log('Sonido ya existía:', sound.id);
    }
    return false; // Sonido ya existía
  };

  // Remueve un sonido por su ID
  const removeSound = (soundId) => {
    console.log('=== REMOVE SOUND ===');
    console.log('Removiendo sonido del contexto:', soundId);
    console.log('Sonidos antes de remover:', selectedSounds.length);

    setSelectedSounds(prev => {
      // Se utiliza filter para crear un nuevo array sin el sonido que tenga ese ID
      //lo que estaria haciendo es agregar al nuevo array los elementos que no tengan el id que se esta removiendo. 
      //por lo tanto, el aray que se devuelve es el mismo array pero sin el elemento que se esta removiendo.
      const newSounds = prev.filter(s => s.id !== soundId);
      console.log('Sonidos después de remover:', newSounds.length);
      console.log('Lista actualizada:', newSounds.map(s => `${s.id}:${s.name}`));
      return newSounds;
    });
  };

  // Limpia completamente todos los sonidos seleccionados
  const clearAllSounds = () => {
    console.log('=== CLEAR ALL SOUNDS ===');
    setSelectedSounds([]);
  };

  // Verifica si un sonido está seleccionado por su ID
  const isSoundSelected = (soundId) => {
    const isSelected = selectedSounds.some(s => s.id === soundId);
    console.log(`isSoundSelected(${soundId}):`, isSelected);
    return isSelected;
  };

  // Log del render del proveedor
  console.log('=== SoundProvider RENDER ===');
  console.log('selectedSounds count:', selectedSounds.length);
  console.log('selectedSounds:', selectedSounds.map(s => `${s.id}:${s.name}`));
  console.log('=== FIN SoundProvider RENDER ===');

  return (
    <SoundContext.Provider value={{
      selectedSounds,
      addSound,
      removeSound,
      clearAllSounds,
      isSoundSelected,
      markSoundAsNotPending
    }}>
      {children}
    </SoundContext.Provider>
  );
};