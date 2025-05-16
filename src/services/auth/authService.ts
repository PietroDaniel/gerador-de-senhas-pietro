import * as authResource from "./authResource";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const signin = async (email: string, password: string): Promise<SigninResponse> => {
  const response = await authResource.signin(email, password);
  return response.data;
};

export const signup = async (data: SignupData) => {
  const response = await authResource.signup(data);
  return response.data;
};

export const signout = () => {
  return authResource.signout();
}; 