import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Trade {
  id: string;
  pair: string;
  posisi: "BUY" | "SELL";
  hasil: "WIN" | "LOSS";
  pip: number;
  tanggal: string;
  catatan: string;
}

interface TradeStore {
  trades: Trade[];
  balance: number;
  userId: string;
  addTrade: (trade: Trade) => void;
  removeTrade: (id: string) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  setTrades: (trades: Trade[]) => void;
  setBalance: (balance: number) => void;
  setUserId: (userId: string) => void;
  clearAll: () => void;
}

export const useTradeStore = create<TradeStore>()(
  persist(
    (set) => ({
      trades: [],
      balance: 10000,
      userId: "",
      addTrade: (trade) =>
        set((state) => ({
          trades: [trade, ...state.trades],
        })),
      removeTrade: (id) =>
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
        })),
      updateTrade: (id, updates) =>
        set((state) => ({
          trades: state.trades.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      setTrades: (trades) => set({ trades }),
      setBalance: (balance) => set({ balance }),
      setUserId: (userId) => set({ userId }),
      clearAll: () =>
        set({
          trades: [],
          balance: 10000,
          userId: "",
        }),
    }),
    {
      name: "mpt-trade-store",
    }
  )
);

interface UIStore {
  theme: "light" | "dark" | "system";
  currency: string;
  notificationsEnabled: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setCurrency: (currency: string) => void;
  setNotifications: (enabled: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "dark",
      currency: "USD",
      notificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: "mpt-ui-store",
    }
  )
);
