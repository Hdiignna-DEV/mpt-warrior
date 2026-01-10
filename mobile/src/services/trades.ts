import apiClient from './api';

export interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan?: string;
}

export const tradesService = {
  async getTrades(limit: number = 50): Promise<Trade[]> {
    const response = await apiClient.get('/trades', { params: { limit } });
    return response.data;
  },

  async getTrade(id: string): Promise<Trade> {
    const response = await apiClient.get(`/trades/${id}`);
    return response.data;
  },

  async createTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
    const response = await apiClient.post('/trades', trade);
    return response.data;
  },

  async updateTrade(id: string, trade: Partial<Trade>): Promise<Trade> {
    const response = await apiClient.put(`/trades/${id}`, trade);
    return response.data;
  },

  async deleteTrade(id: string): Promise<void> {
    await apiClient.delete(`/trades/${id}`);
  },
};
