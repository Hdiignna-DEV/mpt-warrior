/**
 * Storage Sync Utility
 * Provides synchronized access to localStorage with event notifications
 */

export interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  pair: string;
  trade: {
    entry: number;
    exit: number;
    stopLoss: number;
    takeProfit: number;
    pips: number;
    result: 'WIN' | 'LOSS';
  };
  emotionalState: 'calm' | 'confident' | 'nervous' | 'frustrated' | 'excited';
  notes: string;
  screenShot?: string;
  tags: string[];
  lessonLearned?: string;
}

// Storage Keys
export const STORAGE_KEYS = {
  TRADES: 'trades',
  JOURNAL_ENTRIES: 'mpt_journal_entries',
  INITIAL_BALANCE: 'mpt_initial_balance',
  THEME: 'mpt-theme',
} as const;

/**
 * Get trades from localStorage
 */
export const getTrades = (): Trade[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TRADES);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting trades:', error);
    return [];
  }
};

/**
 * Save trades to localStorage and notify
 */
export const saveTrades = (trades: Trade[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    // Dispatch event for real-time sync
    notifyTradesUpdated(trades);
  } catch (error) {
    console.error('Error saving trades:', error);
  }
};

/**
 * Get journal entries from localStorage
 */
export const getJournalEntries = (): JournalEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
};

/**
 * Save journal entries and sync to trades
 */
export const saveJournalEntries = (entries: JournalEntry[]): void => {
  try {
    // Save to journal storage
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
    
    // Convert journal entries to trades format for dashboard
    const trades: Trade[] = entries.map((entry) => ({
      id: entry.id,
      pair: entry.pair,
      posisi: 'BUY' as const,
      hasil: entry.trade.result,
      pip: entry.trade.pips,
      tanggal: entry.date,
      catatan: entry.notes || entry.lessonLearned || '',
    }));

    // Sync to trades storage
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    
    // Notify listeners
    notifyTradesUpdated(trades);
  } catch (error) {
    console.error('Error saving journal entries:', error);
  }
};

/**
 * Get initial balance
 */
export const getInitialBalance = (): number => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.INITIAL_BALANCE);
    return saved ? parseFloat(saved) : 10000;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 10000;
  }
};

/**
 * Save initial balance
 */
export const saveInitialBalance = (balance: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INITIAL_BALANCE, balance.toString());
    notifyBalanceUpdated(balance);
  } catch (error) {
    console.error('Error saving balance:', error);
  }
};

/**
 * Add a single trade
 */
export const addTrade = (trade: Trade): void => {
  const trades = getTrades();
  saveTrades([trade, ...trades]);
};

/**
 * Update a single trade
 */
export const updateTrade = (id: string, updates: Partial<Trade>): void => {
  const trades = getTrades();
  const updated = trades.map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveTrades(updated);
};

/**
 * Delete a trade
 */
export const deleteTrade = (id: string): void => {
  const trades = getTrades();
  saveTrades(trades.filter((t) => t.id !== id));
};

/**
 * Notify listeners about trades update
 */
export const notifyTradesUpdated = (trades: Trade[]): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('tradesUpdated', { detail: trades })
    );
  }
};

/**
 * Notify listeners about balance update
 */
export const notifyBalanceUpdated = (balance: number): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('balanceUpdated', { detail: balance })
    );
  }
};

/**
 * Subscribe to trades updates
 */
export const onTradesUpdated = (callback: (trades: Trade[]) => void): (() => void) => {
  const handler = (event: any) => {
    callback(event.detail);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('tradesUpdated', handler);
    
    return () => {
      window.removeEventListener('tradesUpdated', handler);
    };
  }

  return () => {};
};

/**
 * Subscribe to balance updates
 */
export const onBalanceUpdated = (callback: (balance: number) => void): (() => void) => {
  const handler = (event: any) => {
    callback(event.detail);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('balanceUpdated', handler);
    
    return () => {
      window.removeEventListener('balanceUpdated', handler);
    };
  }

  return () => {};
};

/**
 * Subscribe to storage changes (for cross-tab sync)
 */
export const onStorageChange = (
  callback: (key: string, newValue: any) => void
): (() => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        callback(event.key, parsed);
      } catch {
        callback(event.key, event.newValue);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handler);
    
    return () => {
      window.removeEventListener('storage', handler);
    };
  }

  return () => {};
};

/**
 * Clear all data
 */
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRADES);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.INITIAL_BALANCE);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
