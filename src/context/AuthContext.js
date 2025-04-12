import { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from "../Services/UserServices/AuthService";
import { Buffer } from "buffer";

export const AuthContext = createContext();

const decodeJWT = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Token invalide ou inexistant");
  }

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error("Format de token invalide");

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const jsonPayload = Buffer.from(padded, 'base64').toString('utf-8');

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Erreur lors du décodage du token :", err.message);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: '',
    userRole: '',
    user_id: '',
    isLoading: true
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');
        const user_id = await AsyncStorage.getItem('user_id');

        if (token && role) {
          setAuthState({ token, userRole: role, isLoading: false, user_id });
        } else {
          await clearSession();
        }
      } catch (error) {
        await clearSession();
      }
    };

    loadSession();
  }, []);

  const clearSession = async () => {
    await AsyncStorage.multiRemove(['authToken', 'userRole']);
    setAuthState({ token: null, userRole: null, isLoading: false , user_id: null });
  };

  const login = async (email, password) => {
    try {
      const response = await AuthService.Login(email, password);
      console.log('Login response:', response);

      const { access_token: token } = response;
      if (!token) throw new Error('Token manquant dans la réponse');

      const decoded = decodeJWT(token);
      const role = decoded?.userRole;

      if (!role) throw new Error('Role introuvable dans le token');

      await AsyncStorage.multiSet([
        ['authToken', token],
        ['userRole', role]
      ]);

      setAuthState({
        token,
        userRole: role,
        isLoading: false
      });

      return { token, role };
    } catch (error) {
      console.error('Erreur pendant le login :', error.message);
      await clearSession();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout: clearSession,
        isAuthenticated: !!authState.token
      }}
    >
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};
