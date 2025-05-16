import User from "../../models/User";
import { signin as signinResource, signout as signoutResource, signup as signupResource } from "./authResource";

/**
 * Autentica um usuário no sistema
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} Resposta com token e informações do usuário
 */
export const signin = async (email, password) => {
  try {
    const response = await signinResource(email, password);
    // Converter resposta para o modelo User
    return User.fromBackendResponse(response.data);
  } catch (error) {
    throw error;
  }
};

/**
 * Cadastra um novo usuário no sistema
 * @param {Object} data - Dados com name, email, password, confirmPassword e birthDate
 * @returns {Promise} Resposta do cadastro
 */
export const signup = async (data) => {
  // Converter data de nascimento no formato correto para o backend
  if (data.birthDate && typeof data.birthDate === 'string') {
    // Verificar e converter formato DD/MM/AAAA para formato aceito pelo Java (AAAA-MM-DD)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.birthDate.match(dateRegex);
    
    if (match) {
      const [_, day, month, year] = match;
      
      // Validar data (mês entre 1 e 12, dia válido para o mês)
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);
      const yearNum = parseInt(year);
      
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900) {
        data.birthDate = `${year}-${month}-${day}`;
      } else {
        throw new Error("Data de nascimento inválida");
      }
    } else {
      // Tentar outro formato (talvez o usuário já tenha inserido como AAAA-MM-DD)
      const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      if (!isoRegex.test(data.birthDate)) {
        throw new Error("Formato de data inválido. Use DD/MM/AAAA");
      }
    }
  }
  
  return signupResource(data);
};

/**
 * Realiza o logout do usuário
 */
export const signout = () => {
  return signoutResource();
};
