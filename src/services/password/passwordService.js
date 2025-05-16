import PasswordItem from "../../models/PasswordItem";
import api from "../../utils/api";
import { getStorageItem, setStorageItem } from "../../utils/localStorage";

/**
 * Gera uma senha aleatória
 * @param {number} tamanho - Tamanho da senha
 * @returns {string} Senha gerada
 */
export function gerarSenha(tamanho = 8) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    senha += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return senha;
}

// Função para salvar senha localmente (backup caso o backend não esteja disponível)
const savePasswordLocally = async (password, name = "") => {
  try {
    const saved = await getStorageItem("passwords");
    const history = saved ? JSON.parse(saved) : [];

    const newItem = {
      id: Date.now().toString(),
      name: name || `Item ${history.length + 1}`,
      password,
      createdAt: new Date().toISOString(),
    };

    history.push(newItem);

    await setStorageItem("passwords", JSON.stringify(history));
    return newItem;
  } catch (error) {
    console.error("Erro ao salvar a senha localmente.", error);
    throw error;
  }
};

/**
 * Salva uma senha no backend (ou localmente se o backend falhar)
 * @param {string} password - Senha a ser salva
 * @param {string} name - Nome do item da senha
 * @returns {Promise} Item de senha criado
 */
export const savePassword = async (password, name = "") => {
  try {
    // Tentar salvar no backend usando o endpoint do Spring Boot
    const response = await api.post("/api/items", { 
      name, 
      password 
    });
    
    // Converter resposta do backend para o modelo PasswordItem
    return PasswordItem.fromBackendResponse(response.data);
  } catch (error) {
    console.log("Erro ao salvar no backend, salvando localmente", error);
    // Fallback para armazenamento local
    return await savePasswordLocally(password, name);
  }
};

/**
 * Obtém a lista de senhas salvas
 * @returns {Promise<Array>} Lista de senhas
 */
export const getPasswords = async () => {
  try {
    // Tentar obter do backend usando o endpoint do Spring Boot
    const response = await api.get("/api/items");
    
    // Converter resposta do backend para uma lista de objetos PasswordItem
    return PasswordItem.fromBackendList(response.data);
  } catch (error) {
    console.log("Erro ao obter senhas do backend, usando local storage", error);
    // Fallback para armazenamento local
    try {
      const saved = await getStorageItem("passwords");
      const items = saved ? JSON.parse(saved) : [];
      return PasswordItem.fromBackendList(items);
    } catch (localError) {
      console.error("Erro ao recuperar as senhas localmente.", localError);
      return [];
    }
  }
};

/**
 * Deleta uma senha pelo ID
 * @param {string|number} id - ID da senha a ser deletada
 * @returns {Promise<boolean>} Indica se a operação foi bem-sucedida
 */
export const deletePassword = async (id) => {
  try {
    // Tentar deletar no backend usando o endpoint do Spring Boot
    await api.delete(`/api/items/${id}`);
    return true;
  } catch (error) {
    console.log("Erro ao deletar senha no backend, atualizando localmente", error);
    // Fallback para armazenamento local
    try {
      const saved = await getStorageItem("passwords");
      if (!saved) return false;
      
      const history = JSON.parse(saved);
      const newHistory = history.filter(item => item.id !== id);
      
      await setStorageItem("passwords", JSON.stringify(newHistory));
      return true;
    } catch (localError) {
      console.error("Erro ao deletar a senha localmente.", localError);
      return false;
    }
  }
};

/**
 * Limpa todas as senhas salvas
 */
export const clearPasswords = async () => {
  try {
    // Tentar limpar no backend usando o endpoint específico do Spring Boot
    await api.delete("/api/items/all");
    console.log("Senhas limpas com sucesso no backend");
    return true;
  } catch (error) {
    console.log("Erro ao limpar senhas no backend, limpando localmente", error);
    // Fallback para armazenamento local
    await setStorageItem("passwords", JSON.stringify([]));
    return false;
  }
}; 