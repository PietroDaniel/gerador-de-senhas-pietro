import api from "../../utils/api";
import { SignupData } from "./authService";

export const signin = (email: string, password: string) => {
  return api.post("/auth/signin", {
    email,
    password,
  });
};

export const signup = (data: SignupData) => {
  return api.post("/auth/signup", {
    ...data,
  });
};

export const signout = () => {
  // Implementação futura
}; 