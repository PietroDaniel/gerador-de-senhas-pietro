import { getStorageItem, removeStorageItem, setStorageItem } from "../../utils/localStorage";

export function gerarSenha(tamanho = 8) {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

export const savePassword = async (senha) => {
  try {
    const saved = await getStorageItem("senhas");
    const historico = saved ? JSON.parse(saved) : [];

    historico.push(senha);

    await setStorageItem("senhas", JSON.stringify(historico));
  } catch (error) {
    console.error("Erro ao salvar a senha.", error);
  }
};

export const getPasswords = async () => {
  try {
    const saved = await getStorageItem("senhas");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao recuperar as senhas.", error);
    return [];
  }
};

export const clearPasswords = async () => {
  try {
    // Abordagem dupla para garantir que funcione:
    // 1. Definir como array vazio
    await setStorageItem("senhas", JSON.stringify([]));
    
    // 2. Tentar remover a chave completamente para maior certeza
    try {
      await removeStorageItem("senhas");
    } catch (e) {
      // Ignora erro na remoção, pois já definimos como array vazio acima
      console.log("Aviso: Não foi possível remover a chave, mas o array foi esvaziado");
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao limpar histórico de senhas:", error);
    throw error;
  }
}; 