'use client';

export type Currency = 'USD' | 'IDR';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

interface Analytics {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPips: number;
  averagePips: number;
  profitFactor: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  largestWin: number;
  largestLoss: number;
  averageRRR: number; // Average Risk/Reward Ratio
  trades: Trade[];
}

export const calculateAnalytics = (trades: Trade[]): Analytics => {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalPips: 0,
      averagePips: 0,
      profitFactor: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      largestWin: 0,
      largestLoss: 0,
      averageRRR: 0,
      trades: [],
    };
  }

  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.hasil === 'WIN').length;
  const losses = trades.filter((t) => t.hasil === 'LOSS').length;
  const winRate = (wins / totalTrades) * 100;

  const winPips = trades
    .filter((t) => t.hasil === 'WIN')
    .reduce((acc, t) => acc + t.pip, 0);
  const lossPips = trades
    .filter((t) => t.hasil === 'LOSS')
    .reduce((acc, t) => acc + Math.abs(t.pip), 0);

  const totalPips = winPips - lossPips;
  const averagePips = totalTrades > 0 ? totalPips / totalTrades : 0;

  // Profit Factor = Gross Profit / Gross Loss
  const profitFactor = lossPips > 0 ? winPips / lossPips : winPips > 0 ? Infinity : 0;

  // Calculate Average RRR (Risk/Reward Ratio)
  const avgWinSize = wins > 0 ? winPips / wins : 0;
  const avgLossSize = losses > 0 ? lossPips / losses : 0;
  const averageRRR = avgLossSize > 0 ? avgWinSize / avgLossSize : 0;

  // Calculate consecutive wins/losses
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;

  for (let i = 0; i < trades.length; i++) {
    if (trades[i].hasil === 'WIN') {
      consecutiveWins++;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
      consecutiveLosses = 0;
    } else {
      consecutiveLosses++;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
      consecutiveWins = 0;
    }
  }

  // Find largest win and loss
  const winTrades = trades.filter((t) => t.hasil === 'WIN');
  const lossTrades = trades.filter((t) => t.hasil === 'LOSS');

  const largestWin = winTrades.length > 0 ? Math.max(...winTrades.map((t) => t.pip)) : 0;
  const largestLoss =
    lossTrades.length > 0
      ? Math.min(...lossTrades.map((t) => -Math.abs(t.pip)))
      : 0;

  return {
    totalTrades,
    wins,
    losses,
    winRate,
    totalPips,
    averagePips,
    profitFactor,
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
    largestWin,
    largestLoss,
    averageRRR,
    trades,
  };
};

export const getMonthlyStats = (
  trades: Trade[]
): Record<string, Analytics> => {
  const monthlyTrades: Record<string, Trade[]> = {};

  trades.forEach((trade) => {
    const date = new Date(trade.tanggal);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyTrades[monthKey]) {
      monthlyTrades[monthKey] = [];
    }
    monthlyTrades[monthKey].push(trade);
  });

  const monthlyStats: Record<string, Analytics> = {};
  for (const [month, monthTrades] of Object.entries(monthlyTrades)) {
    monthlyStats[month] = calculateAnalytics(monthTrades);
  }

  return monthlyStats;
};

export const getPairStats = (
  trades: Trade[]
): Record<string, Analytics> => {
  const pairTrades: Record<string, Trade[]> = {};

  trades.forEach((trade) => {
    if (!pairTrades[trade.pair]) {
      pairTrades[trade.pair] = [];
    }
    pairTrades[trade.pair].push(trade);
  });

  const pairStats: Record<string, Analytics> = {};
  for (const [pair, pTrades] of Object.entries(pairTrades)) {
    pairStats[pair] = calculateAnalytics(pTrades);
  }

  return pairStats;
};

export const getEquityCurve = (
  trades: Trade[],
  initialBalance: number,
  currency: Currency = 'IDR',
  pipValuePerLot: number = 10
): Array<{ date: string; equity: number }> => {
  let currentEquity = initialBalance;
  const curve: Array<{ date: string; equity: number }> = [
    { date: 'Start', equity: initialBalance },
  ];

  trades.forEach((trade) => {
    // For IDR accounts, pip value is higher (multiply by exchange rate)
    const pipValue = currency === 'IDR' ? pipValuePerLot * 15750 : pipValuePerLot;
    const tradeProfit = trade.hasil === 'WIN' ? trade.pip * pipValue : -Math.abs(trade.pip * pipValue);
    currentEquity += tradeProfit;

    curve.push({
      date: new Date(trade.tanggal).toLocaleDateString('id-ID'),
      equity: currentEquity,
    });
  });

  return curve;
};

export const getDrawdown = (
  trades: Trade[], 
  initialBalance: number,
  currency: Currency = 'IDR',
  pipValuePerLot: number = 10
): { peak: number; drawdown: number; drawdownPercent: number } => {
  let currentEquity = initialBalance;
  let peak = initialBalance;
  let maxDrawdown = 0;

  trades.forEach((trade) => {
    const pipValue = currency === 'IDR' ? pipValuePerLot * 15750 : pipValuePerLot;
    const tradeProfit = trade.hasil === 'WIN' ? trade.pip * pipValue : -Math.abs(trade.pip * pipValue);
    currentEquity += tradeProfit;

    if (currentEquity > peak) {
      peak = currentEquity;
    }

    const drawdown = peak - currentEquity;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  return {
    peak,
    drawdown: maxDrawdown,
    drawdownPercent: peak > 0 ? (maxDrawdown / peak) * 100 : 0,
  };
};

export const analytics = {
  // Track page view
  trackPageView: (pageName: string) => {
    const views = JSON.parse(localStorage.getItem('mpt_analytics_views') || '{}');
    views[pageName] = (views[pageName] || 0) + 1;
    views.lastVisit = new Date().toISOString();
    localStorage.setItem('mpt_analytics_views', JSON.stringify(views));
  },

  // Track action
  trackAction: (action: string, metadata?: Record<string, unknown>) => {
    const actions = JSON.parse(localStorage.getItem('mpt_analytics_actions') || '[]');
    actions.push({
      action,
      metadata,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 actions
    if (actions.length > 100) actions.shift();
    localStorage.setItem('mpt_analytics_actions', JSON.stringify(actions));
  },

  // Get stats
  getStats: () => {
    const views = JSON.parse(localStorage.getItem('mpt_analytics_views') || '{}');
    const actions = JSON.parse(localStorage.getItem('mpt_analytics_actions') || '[]');
    return { views, actions };
  },

  // Track session
  trackSession: () => {
    const sessions = JSON.parse(localStorage.getItem('mpt_sessions') || '[]');
    sessions.push({
      start: new Date().toISOString(),
    });
    localStorage.setItem('mpt_sessions', JSON.stringify(sessions));
  },
};