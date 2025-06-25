const AUTH_KEY = "@auth_data";
import axios from "axios";

const login = async (email, password) => {
  try {
    return new Promise(async (resolve, reject) => {
      const shouldLogin = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          email,
          password,
        }
      );

      setTimeout(() => {
        console.log("shouldLogin.status", shouldLogin);
        if (shouldLogin.status === 200) {
          resolve({
            access_token: "1234567890",
            expires_in: 3600,
          });
        } else {
        }
      }, 1000);
    });
  } catch (error) {
    const msg = error.response?.data?.message || "Error al iniciar sesión";
    throw new Error(msg);
  }
};

export default {
  login,
  AUTH_KEY,
};
