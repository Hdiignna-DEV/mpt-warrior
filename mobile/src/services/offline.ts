import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trade } from './trades';

const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  TRADES: 'trades_cache',
  LAST_SYNC: 'last_sync',
  OFFLINE_MODE: 'offline_mode',
  PENDING_TRADES: 'pending_trades',
};

export const offlineService = {
  /**
   * Save user data to local storage
   */
  async saveUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  /**
   * Get cached user data
   */
  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  /**
   * Save trades to local cache
   */
  async saveTrades(trades: Trade[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error saving trades:', error);
    }
  },

  /**
   * Get cached trades
   */
  async getTrades(): Promise<Trade[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRADES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting trades:', error);
      return [];
    }
  },

  /**
   * Add offline trade (pending sync)
   */
  async addOfflineTrade(trade: Trade): Promise<void> {
    try {
      const pending = await this.getPendingTrades();
      pending.push({
        ...trade,
        offline: true,
        syncStatus: 'pending',
      });
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_TRADES, JSON.stringify(pending));
    } catch (error) {
      console.error('Error adding offline trade:', error);
    }
  },

  /**
   * Get pending trades waiting to sync
   */
  async getPendingTrades(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRADES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pending trades:', error);
      return [];
    }
  },

  /**
   * Clear pending trades (after successful sync)
   */
  async clearPendingTrades(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_TRADES);
    } catch (error) {
      console.error('Error clearing pending trades:', error);
    }
  },

  /**
   * Set offline mode flag
   */
  async setOfflineMode(isOffline: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, JSON.stringify(isOffline));
    } catch (error) {
      console.error('Error setting offline mode:', error);
    }
  },

  /**
   * Check if app is in offline mode
   */
  async isOfflineMode(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_MODE);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error checking offline mode:', error);
      return false;
    }
  },

  /**
   * Get last sync time
   */
  async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  },

  /**
   * Clear all offline data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  },

  /**
   * Sync pending trades with server
   */
  async syncPendingTrades(): Promise<boolean> {
    try {
      const pending = await this.getPendingTrades();
      if (pending.length === 0) {
        return true;
      }

      const { tradesService } = await import('./trades');
      for (const trade of pending) {
        try {
          // Send to server
          if (trade.id.startsWith('offline_')) {
            // Create new trade if it was created offline
            await tradesService.createTrade(trade);
          } else {
            // Update existing trade
            await tradesService.updateTrade(trade.id, trade);
          }
        } catch (error) {
          console.error(`Error syncing trade ${trade.id}:`, error);
          return false;
        }
      }

      // Clear pending trades after successful sync
      await this.clearPendingTrades();
      return true;
    } catch (error) {
      console.error('Error syncing pending trades:', error);
      return false;
    }
  },
};
