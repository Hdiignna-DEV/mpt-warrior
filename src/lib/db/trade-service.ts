/**
 * Trade Service
 * CRUD operations for trades container in Azure Cosmos DB
 */

import { getTradesContainer } from './cosmos-client';
import { v4 as uuidv4 } from 'uuid';

export interface Trade {
  id: string;
  userId: string; // Partition key
  pair: string;
  position: 'BUY' | 'SELL';
  result: 'WIN' | 'LOSS';
  pips: number;
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  notes?: string;
  emotionalState?: 'calm' | 'confident' | 'nervous' | 'frustrated' | 'excited';
  tags?: string[];
  screenshot?: string;
  tradeDate: string; // ISO date string
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new trade for a user
 */
export async function createTrade(userId: string, tradeData: Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Trade> {
  const container = getTradesContainer();
  
  const newTrade: Trade = {
    id: uuidv4(),
    userId,
    ...tradeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await container.items.create(newTrade);
  console.log('[createTrade] Created trade:', newTrade.id, 'for user:', userId);
  
  return newTrade;
}

/**
 * Get all trades for a specific user
 */
export async function getUserTrades(userId: string): Promise<Trade[]> {
  const container = getTradesContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.tradeDate DESC",
    parameters: [{ name: "@userId", value: userId }],
  };

  const { resources } = await container.items.query<Trade>(query).fetchAll();
  console.log('[getUserTrades] Found', resources.length, 'trades for user:', userId);
  
  return resources;
}

/**
 * Get a single trade by ID (requires userId for partition key)
 */
export async function getTradeById(userId: string, tradeId: string): Promise<Trade | null> {
  const container = getTradesContainer();
  
  try {
    const { resource } = await container.item(tradeId, userId).read<Trade>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Update an existing trade
 */
export async function updateTrade(userId: string, tradeId: string, updates: Partial<Trade>): Promise<Trade> {
  const container = getTradesContainer();
  
  const { resource: existingTrade } = await container.item(tradeId, userId).read<Trade>();
  
  if (!existingTrade) {
    throw new Error('Trade not found');
  }

  const updatedTrade: Trade = {
    ...existingTrade,
    ...updates,
    id: tradeId, // Ensure ID doesn't change
    userId, // Ensure partition key doesn't change
    updatedAt: new Date(),
  };

  await container.item(tradeId, userId).replace(updatedTrade);
  console.log('[updateTrade] Updated trade:', tradeId);
  
  return updatedTrade;
}

/**
 * Delete a trade
 */
export async function deleteTrade(userId: string, tradeId: string): Promise<void> {
  const container = getTradesContainer();
  
  await container.item(tradeId, userId).delete();
  console.log('[deleteTrade] Deleted trade:', tradeId);
}

/**
 * Get trade statistics for a user
 */
export async function getUserTradeStats(userId: string): Promise<{
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPips: number;
  bestWin: number;
  worstLoss: number;
}> {
  const trades = await getUserTrades(userId);
  
  const wins = trades.filter(t => t.result === 'WIN').length;
  const losses = trades.filter(t => t.result === 'LOSS').length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const totalPips = trades.reduce((sum, t) => sum + t.pips, 0);
  const bestWin = Math.max(...trades.filter(t => t.result === 'WIN').map(t => t.pips), 0);
  const worstLoss = Math.min(...trades.filter(t => t.result === 'LOSS').map(t => t.pips), 0);
  
  return {
    totalTrades,
    wins,
    losses,
    winRate: Math.round(winRate * 100) / 100,
    totalPips: Math.round(totalPips * 100) / 100,
    bestWin,
    worstLoss,
  };
}
