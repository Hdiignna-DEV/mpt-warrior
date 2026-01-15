import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mpt-warrior.vercel.app/api';

export const authStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token to secure storage
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));

      set({
        token,
        user,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Call logout endpoint
      await axios.post(`${API_URL}/auth/logout`);

      // Clear secure storage
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');

      set({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Clear locally even if API call fails
      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
      });

      const { token, user } = response.data;

      // Save token to secure storage
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));

      set({
        token,
        user,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return false;

      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data.user;
      set({ token, user });
      return true;
    } catch (error) {
      // Token invalid, clear it
      await SecureStore.deleteItemAsync('userToken');
      set({ token: null, user: null });
      return false;
    }
  },
}));
