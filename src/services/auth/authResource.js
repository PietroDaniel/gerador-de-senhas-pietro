import api from "../../utils/api";

/**
 * Autentica um usuário com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} Resposta do servidor com token e dados do usuário
 */
const signin = async (email, password) => {
  try {
    const response = await api.post("/api/auth/signin", {
      email,
      password,
    });
    return response; // Retorna a resposta completa para processamento
  } catch (error) {
    throw error;
  }
};

/**
 * Cadastra um novo usuário
 * @param {Object} data - Dados do novo usuário
 * @returns {Promise} Resposta do servidor
 */
const signup = async (data) => {
  try {
    const response = await api.post("/api/auth/signup", data);
    return response; // Retorna a resposta completa
  } catch (error) {
    throw error;
  }
};

/**
 * Método para logout (sem comunicação com o backend)
 */
const signout = () => {
  // Logout é tratado apenas no frontend removendo o token
  return Promise.resolve();
};

export {
    signin, signout, signup
};

