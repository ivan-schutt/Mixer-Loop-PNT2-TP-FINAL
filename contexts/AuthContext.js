import { createContext, useContext, useEffect, useState, } from "react";
import AsyncStorage from "../services/AsyncStorage";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const validarUsuarioEnAsyncStorage = async () => {
      try {
        const data = await AsyncStorage.getData(authService.AUTH_KEY);
        const userId = data?.user?._id;

        if (data) {
          const sigueExistiendo = await authService.validarUsuarioActivo(userId);

          if (sigueExistiendo) {
            setAuth(data);
          } else {
            console.warn("El usuario fue eliminado del backend. Limpiando sesión.");
            await AsyncStorage.clearData();
            setAuth(null);
          }
        }
      } catch (err) {
        console.error("Error al leer o validar AsyncStorage:", err);
      } finally {
        setLoading(false);
      }
    };

    validarUsuarioEnAsyncStorage();
  }, []);

  useEffect(() => {
    if (auth) {
      console.log("Procedo a modificar el AsyncStorage");
      AsyncStorage.storeData(authService.AUTH_KEY, auth);
    } else {
      AsyncStorage.clearData();
    }
  }, [auth]);

  return <AuthContext.Provider value={{ auth, setAuth, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return authContext;
}

