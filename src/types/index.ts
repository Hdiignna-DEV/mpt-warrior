// Type definitions untuk MPT Warrior

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
  stats: UserStats;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  timezone: string;
  notifications: boolean;
  language: string;
  riskPercent: number;
}

export interface UserStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalProfit: number;
  bestWin: number;
  worstLoss: number;
  streakWins: number;
  streakLosses: number;
  largestWin: number;
  largestLoss: number;
}

export interface Trade {
  id: string;
  userId: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING';
  result?: 'WIN' | 'LOSS' | 'BREAKEVEN';
  pipsProfit?: number;
  moneyProfit?: number;
  riskAmount: number;
  rewardAmount?: number;
  riskRewardRatio: number;
  timeframe: string;
  createdAt: Date;
  closedAt?: Date;
  notes?: string;
  journalEntryId?: string;
  emotion?: string;
  screenshot?: string;
  tags?: string[];
}

export interface JournalEntry {
  id: string;
  userId: string;
  tradeId?: string;
  title: string;
  content: string; // Rich text HTML
  emotions: string[];
  lessons: string[];
  tags: string[];
  images: string[]; // URLs or base64
  createdAt: Date;
  updatedAt: Date;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string; // base64 or URL
  timestamp: Date;
  tokens?: number;
  metadata?: {
    sessionId?: string;
    model?: string;
    temperature?: number;
  };
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  reward: number;
  unlockedAt: Date;
  progress: number; // 0-100
  requirements: AchievementRequirement;
}

export interface AchievementRequirement {
  type: string;
  value: number;
  current: number;
  completed: boolean;
}

export interface EconomicEvent {
  id: string;
  country: string;
  flag: string;
  eventName: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  previous?: number | string;
  forecast?: number | string;
  actual?: number | string;
  unit: string;
  date: Date;
  time: string;
  isReleased: boolean;
  importance: number; // 1-3
}

export interface CalculatorInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  leverage: number;
  pipsPerPoint: number;
}

export interface CalculatorResult {
  riskAmount: number;
  potentialProfit: number;
  riskRewardRatio: number;
  positionSize: number;
  marginRequired: number;
  stopLoss: number;
  takeProfit: number;
}

export interface ChartData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Analytics {
  userId: string;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  totalProfit: number;
  monthlyProfit: Map<string, number>;
  weeklyProfit: Map<string, number>;
  dailyProfit: Map<string, number>;
  pairPerformance: Map<string, PairStats>;
}

export interface PairStats {
  pair: string;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalProfit: number;
  averageWin: number;
  averageLoss: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface FilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  pair?: string;
  direction?: 'BUY' | 'SELL';
}

export interface NotificationData {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface BackupData {
  version: string;
  timestamp: Date;
  trades: Trade[];
  journalEntries: JournalEntry[];
  achievements: Achievement[];
  userSettings: UserSettings;
}

export interface DatabaseConfig {
  endpoint: string;
  key: string;
  database: string;
  containers: {
    trades: string;
    users: string;
    journals: string;
    achievements: string;
    chats: string;
    events: string;
  };
}

export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

// Form Types
export interface TradeFormData {
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  notes?: string;
  emotion?: string;
}

export interface JournalFormData {
  title: string;
  content: string;
  emotions: string[];
  lessons: string[];
  tags: string[];
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Error Types
export class TradeError extends Error {
  constructor(
    public code: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'TradeError';
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Event Types
export type TradeEventType = 'created' | 'updated' | 'closed' | 'deleted';

export interface TradeEvent {
  type: TradeEventType;
  tradeId: string;
  userId: string;
  timestamp: Date;
  data: Partial<Trade>;
}
