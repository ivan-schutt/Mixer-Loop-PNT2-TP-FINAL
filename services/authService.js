import axios from 'axios';

const AUTH_KEY = '@auth_data';

const login = async (email, password) => {

  try{
    const response = await axios.post('http://localhost:8080/api/users/conexion', {email, password});
    return response.data

  /* return new Promise((resolve, reject) => {


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
} */

} catch(error){
  const msg = error.response?.data?.message || 'Error al iniciar sesión';
  throw new Error(msg);
}
}

export default {
  login,
  AUTH_KEY
}