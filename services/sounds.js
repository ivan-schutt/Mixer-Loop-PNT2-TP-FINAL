const URL_API = 'http://localhost:8080/api/sounds'

const sounds = () => [
  {
    id: '1',
    name: 'Bass 1',
    file: ('https://rsavyhrqfdpjviikufad.supabase.co/storage/v1/object/sign/mixerloop/Bass%201.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lMTFhYmM3Ny0xOGUwLTRjNzItYjM1ZC1hOWZhNDYwMGY1ZWEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaXhlcmxvb3AvQmFzcyAxLm1wMyIsImlhdCI6MTc1MTAzNzM4NywiZXhwIjoxNzgyNTczMzg3fQ.0HOClQVIis3vTSnITATZ8C7OV838mojIEuGr7YPXyR8'),
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
    fetch(`${URL_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}`
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

