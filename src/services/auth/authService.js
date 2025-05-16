import * as authResource from "./authResource";

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const signin = (email: string, password: string) => {
  return authResource.signin(email, password);
};

export const signup = (data: SignupData) => {
  return authResource.signup(data);
};

export const signout = () => {
  return authResource.signout();
};
