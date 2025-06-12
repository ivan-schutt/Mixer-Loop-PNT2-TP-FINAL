import { createContext, useContext, useEffect, useState, } from "react";
import AsyncStorage from "../services/AsyncStorage";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  useEffect(() => {

    AsyncStorage.getData(authService.AUTH_KEY).then((data) => {
      console.log("Encuentro dato en el AsyncStorage", data);
      if (data) {
        setAuth(data);
      }
    });
  }, []);

  useEffect(() => {
    console.log("Cambio el estado de auth", auth);
    if (auth) {
      console.log("Procedo a modificar el AsyncStorage");
      AsyncStorage.storeData(authService.AUTH_KEY, auth);
    }else{
      AsyncStorage.clearData();
    }
  }, [auth]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return authContext;
}

