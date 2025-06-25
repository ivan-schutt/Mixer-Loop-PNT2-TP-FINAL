const AUTH_KEY = "@auth_data";
import axios from "axios";

const login = async ({email, password }) => {
  console.log(email, password)
  try {
    const response = await axios.post('http://localhost:8080/api/users/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al ingresar';
    throw new Error(msg);
  }
};

const register = async ({ nombre, email, password }) => {
  try {
    const response = await axios.post('http://localhost:8080/api/users/register', {
      nombre,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al registrar';
    throw new Error(msg);
  }
};



export default {
  login,
  register,
  AUTH_KEY,
};
