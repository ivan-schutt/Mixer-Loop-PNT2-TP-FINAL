const URL_API = 'http://localhost:8080/api/sounds';

const sendSessionLog = (sessionData) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL_API}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // si lo necesitás
      },
      body: JSON.stringify(sessionData)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Sesión enviada exitosamente:", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al enviar sesión:", error);
        reject(error);
      });
  });
};

const renderSessionEvents = (events) => {
  const sessionData = {
    events: events,
    sessionInfo: {
      totalEvents: events.length,
      sessionDuration: events.length > 0 ? Math.max(...events.map(e => e.timeInSeconds)) : 0,
      timestamp: new Date().toISOString(),
      playEvents: events.filter(e => e.action === 'play').length,
      stopEvents: events.filter(e => e.action === 'stop').length
    }
  };

  return sendSessionLog(sessionData);
};

const downloadRenderedAudio = (downloadUrl, filename) => {
  return new Promise((resolve, reject) => {
    try {
      // Validar que existe URL de descarga
      if (!downloadUrl) {
        throw new Error('No hay URL de descarga disponible');
      }

      console.log('Iniciando descarga:', downloadUrl);

      // Crear elemento de descarga temporal
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      
      // Agregar al DOM temporalmente
      document.body.appendChild(link);
      
      // Simular clic para iniciar descarga
      link.click();
      
      // Limpiar elemento temporal
      document.body.removeChild(link);
      
      console.log('✅ Descarga iniciada exitosamente:', filename);
      resolve(true);
      
    } catch (error) {
      console.error('❌ Error en descarga:', error);
      reject(error);
    }
  });
};

export {
  sendSessionLog,
  renderSessionEvents,
  downloadRenderedAudio
}; 