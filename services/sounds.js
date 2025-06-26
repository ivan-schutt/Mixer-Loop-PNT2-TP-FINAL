

const sounds = () => [
  {
    id: '1',
    name: 'Drum Loop Live',
    file: ('https://rsavyhrqfdpjviikufad.supabase.co/storage/v1/object/public/mixerloop/Drums%201.mp3'),
    category: 'Drums',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '2',
    name: 'Drum Full Chorus',
    file: ('https://rsavyhrqfdpjviikufad.supabase.co/storage/v1/object/public/mixerloop/Drums%202.mp3'),
    category: 'Drums',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '3',
    name: 'Bass Loop',
    file: ('https://rsavyhrqfdpjviikufad.supabase.co/storage/v1/object/public/mixerloop/Bass%201.mp3'),
    category: 'Bass',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '4',
    name: 'Pad Flange',
    file: ('https://rsavyhrqfdpjviikufad.supabase.co/storage/v1/object/public/mixerloop//Pad%201.mp3'),
    category: 'Pad',
    duration: '0:08',
    bpm: '120',
  },
  {
    id: '5',
    name: 'Upload',
    file: ('https://rsavyhrqfdpjviikufad.supabase.co/storage/v1/object/public/mixerloop/Pad%201.mp3'),
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


export {
  getSoundById,
  getSounds,
  saveSound,
  updateSound
};

