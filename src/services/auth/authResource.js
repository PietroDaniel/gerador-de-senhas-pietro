import api from "../../utils/api";

const signin = (email, password) => {
  return api.post("/auth/signin", {
    email,
    password,
  });
};

const signup = (data) => {
  return api.post("/auth/signup", {
    ...data,
  });
};

const signout = () => {};
