import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signin, signup } from '../services/auth/authService';
import api from '../utils/api';

// Interface AuthContextProps
interface AuthContextProps {
  onRegister: (name: string, email: string, password: string, confirmPassword: string, birthDate: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
  authState: AuthenticatedProps;
}

// Interface AuthenticatedProps
interface AuthenticatedProps {
  token: string | null;
  authenticated: boolean | null;
}

// Interface AuthProviderProps
interface AuthProviderProps {
  children: React.ReactNode;
}

// TOKEN QUE SERÁ SALVO NA MEMÓRIA LOCAL
const TOKEN_KEY = "access-token";

// RESPONSÁVEL POR CRIAR O CONTEXTO AUTH
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

// ESTADO DE AUTH LOCAL
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthenticatedProps>({
    token: null,
    authenticated: null,
  });

  // RESPONSÁVEL POR PEGAR O TOKEN INICIAL
  useEffect(() => {
    const loadToken = async () => {
      // pegar token no localStorage
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      // se o token existir, adicionar no header da api
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        setAuthState({
          token,
          authenticated: true,
        });
      }
    };
    
    loadToken();
  }, []);
  
  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    birthDate: string
  ) => {
    try {
      await signup({ name, email, password, confirmPassword, birthDate });
    } catch (error) {
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      // chamar função de signin
      const result = await signin(email, password);
      
      // alterar estado local
      setAuthState({
        authenticated: true,
        token: result.token,
      });
      
      // adicionar token no header
      api.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
      
      // adicionar token no localStorage
      await SecureStore.setItemAsync(TOKEN_KEY, result.token);
      
      // retornar resultado
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = async () => {
    // remover token do localStorage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    
    // remover token do header
    api.defaults.headers.common["Authorization"] = "";
    
    // resetar estado local
    setAuthState({
      token: null,
      authenticated: null,
    });
  };
  
  // O VALOR QUE O CONTEXTO DISPONIBILIZA
  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
