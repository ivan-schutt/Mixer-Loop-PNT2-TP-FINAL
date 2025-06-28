const URL_API = 'http://localhost:8080/api/sounds'

const getSounds = (userId) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL_API}?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // si lo necesitás
      }
    })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log("Error al obtener sonidos:", error);
        reject(error);
      });
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

