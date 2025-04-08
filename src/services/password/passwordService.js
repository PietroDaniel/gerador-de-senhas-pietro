import { getStorageItem, setStorageItem } from "../../utils/localStorage";

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
  await setStorageItem("senhas", JSON.stringify([]));
}; 