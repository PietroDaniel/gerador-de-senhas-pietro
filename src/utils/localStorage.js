import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getStorageItem(item) {
  let value = null;
  try {
    value = await AsyncStorage.getItem(item);
    
    // Logging para debug
    if (!value) {
      console.log(`Item '${item}' não encontrado no storage ou vazio`);
    } else {
      console.log(`Item '${item}' recuperado com sucesso, tamanho: ${value.length}`);
    }
    
  } catch (error) {
    console.error(`Erro ao recuperar item '${item}' do storage:`, error);
  }
  return value;
}

export async function setStorageItem(item, value) {
  try {
    await AsyncStorage.setItem(item, value);
    console.log(`Item '${item}' salvo no storage com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao salvar item '${item}' no storage:`, error);
    return false;
  }
}

export async function removeStorageItem(item) {
  try {
    await AsyncStorage.removeItem(item);
    console.log(`Item '${item}' removido do storage com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao remover item '${item}' do storage:`, error);
    return false;
  }
} 