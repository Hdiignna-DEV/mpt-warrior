import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AppStore {
  // User
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setUser: (user) => {
    set({ user, isLoggedIn: !!user });
  },

  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('mpt_token', token);
      set({ token, isLoggedIn: true });
    } else {
      await AsyncStorage.removeItem('mpt_token');
      set({ token: null, isLoggedIn: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('mpt_token');
    set({ user: null, token: null, isLoggedIn: false });
  },

  hydrate: async () => {
    const token = await AsyncStorage.getItem('mpt_token');
    if (token) {
      set({ token, isLoggedIn: true });
    }
  },
}));
