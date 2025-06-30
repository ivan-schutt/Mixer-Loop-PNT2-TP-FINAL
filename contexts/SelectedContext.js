import { createContext, useContext, useState } from 'react';

const SelectedContext = createContext();

export const UseSelectedContext = () => {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error('UseSelectedContext debe usarse dentro de SelectedProvider');
  }
  
  // Log cada vez que se accede al contexto
  console.log('=== UseSelectedContext llamado ===');
  console.log('selectedSounds count:', context.selectedSounds?.length || 0);
  console.log('selectedSounds:', context.selectedSounds?.map(s => s.name) || []);
  console.log('=== fin UseSelectedContext ===');
  
  return context;
};

export const SelectedProvider = ({ children }) => {
  const [selectedSounds, setSelectedSounds] = useState([]);

  const addSound = (sound) => {
    console.log('=== ADD SOUND ===');
    console.log('Agregando sonido al contexto:', sound.name, 'ID:', sound.id);
    console.log('Sonidos antes de agregar:', selectedSounds.length);
    
    // Verificar si el sonido ya está seleccionado. some es un metodo que se usa para verificar si un elemento existe en un array.
    //some devuelve un booleano. verifica todos los elementos del array y si alguno coincide con el id del sonido que se esta agregando, retorna true.
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
      //se utiliza filter para filtrar los elementos del array
      //lo que estaria haciendo es agregar al nuevo array los elementos que no tengan el id que se esta removiendo. 
      //por lo tanto, el aray que se devuelve es el mismo array pero sin el elemento que se esta removiendo.      

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

  console.log('=== SelectedProvider RENDER ===');
  console.log('selectedSounds count:', selectedSounds.length);
  console.log('selectedSounds:', selectedSounds.map(s => `${s.id}:${s.name}`));
  console.log('=== FIN SelectedProvider RENDER ===');

  return (
    <SelectedContext.Provider value={{
      selectedSounds,
      addSound,
      removeSound,
      clearAllSounds,
      isSoundSelected
    }}>
      {children}
    </SelectedContext.Provider>
  );
}; 