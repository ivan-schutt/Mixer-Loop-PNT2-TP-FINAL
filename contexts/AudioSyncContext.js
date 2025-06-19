import { createContext, useContext, useRef, useState } from "react";

const AudioSyncContext = createContext();

export const useAudioSyncContext = () => {
  const context = useContext(AudioSyncContext);
  if (!context) {
    throw new Error(
      "useAudioSyncContext debe usarse dentro de AudioSyncProvider"
    );
  }
  return context;
};

export const AudioSyncProvider = ({ children }) => {
  const BPM = 120;
  const BEATS_PER_BAR = 4;
  const BEAT_DURATION = (60 / BPM) * 1000;

  const [isPlaying, setIsPlaying] = useState(false);

  //current count va a manejar los valores de 1 a 4(En relaidad lo que defina(BEATS_PER_BAR)

  const [currentCount, setCurrentCount] = useState(0);

  //beats va a manejar los beats totales, algo que usaremos con useRef. Esto va a funcioanr en el background, y nos va a servir para
  //crear el log de audios cuando querramos renderizar.

  const beats = useRef(0);

  //vamos a tener un tercer valor que va a ser reloj, con el tiempo real y en lo posible, que funcione con milisegundos corriendo todo el tiempo, como si fuera un DAW.

  //crear reloj aca

  //por las dudas tambien agrego compas, por si en algun momento nos interesa tenerlo. En el caso de que queramos
  //que se visuallice, tendriamos que cambiar a useState, por ahora dejo useRef.
  const currentBar = useRef(1);

  //en principio en base al tiempo que tengo y aprovechando la logica actual de loopButton, voy a utilizar un useRef a modo de contador
  //que cuando se reproduce un track, simplemente incrementa el contador. Y vice versa cuando se retire un track.
  //Me parece que esto lo podermos implementar mejor, en caso de que nos sirva podriamos tanto ir guardando ids
  // de los botones activos, o desarollar algo utilizando useEffect. Evaluemos esto luego de que implement los nuevos
  //cambios.
  const activeTracks = useRef(0);

  //intervalo para poder controlar el contador
  const intervalRef = useRef(null);

  const startSync = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentCount(prev => {
        let newCount = prev + 1;

        if (newCount > BEATS_PER_BAR) {
          currentBar.current++;
          newCount = 1;
        }

        return newCount;
      });
    }, BEAT_DURATION);
  };

  const stopSync = () => {
    //por ahora voy a hacer que reinicie , pero despues deberiamos evaluar si hacemos lo de la session, lo charlamos.
    //detener el interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    restartSync();
  };

  const restartSync = () => {
    setCurrentCount(0);
    beats.current = 0;
    currentBar.current = 1;
  };

  const addActiveTrack = () => {
    //cuando se reproduce un track, simplemente incrementa el contador
    activeTracks.current++;

    if (activeTracks.current === 1 && !intervalRef.current) {
      startSync();
    }
  };

  const removeActiveTrack = () => {
    if (activeTracks.current > 0) {
      activeTracks.current--;

      if (activeTracks.current === 0) {
        //cuando se retire el último track se detiene y reinicia
        stopSync();
      }
    }
  };

  return (
    <AudioSyncContext.Provider
      value={{
        isPlaying,
        currentCount,
        beats,
        currentBar,
        activeTracks,
        addActiveTrack,
        removeActiveTrack
      }}
    >
      {children}
    </AudioSyncContext.Provider>
  );
};
