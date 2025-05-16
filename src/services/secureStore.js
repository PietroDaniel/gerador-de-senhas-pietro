import * as SecureStore from 'expo-secure-store';

export const setItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving data to local storage", error);
  }
};

export const getItem = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (error) {
    console.error("Error retrieving data from local storage", error);
  }
};

export const removeItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error removing data from local storage", error);
  }
}; 