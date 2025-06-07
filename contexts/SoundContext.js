import React, { createContext, useContext, useState } from 'react';

const SoundContext = createContext();

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

  const addSound = (sound) => {
    console.log('=== ADD SOUND ===');
    console.log('Agregando sonido al contexto:', sound.name, 'ID:', sound.id);
    console.log('Sonidos antes de agregar:', selectedSounds.length);
    
    const isAlreadySelected = selectedSounds.some(s => s.id === sound.id);
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

  const removeSound = (soundId) => {
    console.log('=== REMOVE SOUND ===');
    console.log('Removiendo sonido del contexto:', soundId);
    console.log('Sonidos antes de remover:', selectedSounds.length);
    
    setSelectedSounds(prev => {
      const newSounds = prev.filter(s => s.id !== soundId);
      console.log('Sonidos después de remover:', newSounds.length);
      console.log('Lista actualizada:', newSounds.map(s => `${s.id}:${s.name}`));
      return newSounds;
    });
  };

  const clearAllSounds = () => {
    console.log('=== CLEAR ALL SOUNDS ===');
    setSelectedSounds([]);
  };

  const isSoundSelected = (soundId) => {
    const isSelected = selectedSounds.some(s => s.id === soundId);
    console.log(`isSoundSelected(${soundId}):`, isSelected);
    return isSelected;
  };

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
      isSoundSelected
    }}>
      {children}
    </SoundContext.Provider>
  );
}; 