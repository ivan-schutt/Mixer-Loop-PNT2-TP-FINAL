const AUTH_KEY = '@auth_data';

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    // TODO: Llamar a la API de login cuando la tengan implementada.


    setTimeout(() => {
      const shouldLogin = email.toString().toLowerCase() === 'admin' && password.toString() === '123456';
      if (shouldLogin) {
        resolve({
          access_token: '1234567890',
          expires_in: 3600,
          user: {
            id: 1,
            fullName: 'John Doe',
            email: email,
            role: 'admin'
          }
        })
      } else {
        reject(new Error('Email o contraseña incorrectos'))
      }
    }, 1000)
  })
}

export default {
  login,
  AUTH_KEY
}