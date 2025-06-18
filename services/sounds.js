// const URL_API = '';

const sounds = () => [
  {
    id: '1',
    name: 'Drum Loop Live',
    file: require('../assets/audio/drums/DSC_NGL_120_drum_loop_live.mp3'),
    category: 'Drums',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '2',
    name: 'Drum Full Chorus',
    file: require('../assets/audio/drums/DS_PCH_120_drum_full_better_chorus.mp3'),
    category: 'Drums',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '3',
    name: 'Bass Loop',
    file: require('../assets/audio/drums/nd2_bass120_class_Cm.mp3'),
    category: 'Bass',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '4',
    name: 'Pad Flange',
    file: require('../assets/audio/drums/TL_MS_Pad_Loop_Pad_Flange_Low_Pulse_Cm_120.mp3'),
    category: 'Pad',
    duration: '0:08',
    bpm: '120',
  },
];

/* const getSounds = () => {
  // Simular una llamada a una API
  return new Promise((resolve, reject) => {
    const response = fetch(`${URL_API}/read`)
    response.then(response => {
      //console.log("response", response);
      return response.json();
    }).then(data => {
      //console.log("data", data);
      resolve(data);
    })
    .catch(error =>{
      console.log("error", error);
      reject(error);
    })   
  }); */


const getSounds = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sampleList = sounds();
      if (sampleList.length > 0) {
        resolve(sampleList);
      } else {
        reject(new Error('No samples found'));
      }
    }, 10);
  });
};

const getSoundById = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL_API}/read/${id}`)
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log("error al obtener sonido por id", error);
        reject(error);
      })
  });
}

const updateSound = (sound) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL_API}/update/${sound.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(sound)
    })
      .then(response => {
        console.log("response", response);
        if (response.ok) {
          resolve(true);
        } else {
          reject(new Error("Error al actualizar sonido"));
        }
      })
      .catch(error => {
        console.log("error al actualizar sonido", error);
        reject(error);
      })
  });
}

const saveSound = (sound) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL_API}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sound)
    })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log("error al guardar sonido", error);
        reject(error);
      })
  })
}

let micRecordings = [];

export const saveMicRecordingUri = (uri) => {
  micRecordings.push({
    uri,
    timestamp: new Date().toISOString()
  });
};

export const getMicRecordings = () => micRecordings;

export {
  getSoundById,
  getSounds,
  saveSound,
  updateSound
};

