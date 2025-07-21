// utils/auth.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'token';

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to save the token to localStorage', e);
    }
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken() {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to get the token from localStorage', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export async function logout() {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove the token from localStorage', e);
    }
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}