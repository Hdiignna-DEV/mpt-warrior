// Constants untuk MPT Warrior

export const TRADING_PAIRS = {
  FOREX: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'NZDUSD', 'USDCAD', 'USDCHF'],
  INDICES: ['US30', 'SPX500', 'UK100', 'DAX40', 'ASX200'],
  COMMODITIES: ['GOLD', 'SILVER', 'CRUDE_OIL', 'NATURAL_GAS'],
  CRYPTO: ['BTCUSD', 'ETHUSD', 'XRPUSD', 'ADAUSD'],
};

export const EMOTIONS = {
  FEAR: { label: 'Takut', color: 'text-red-500', value: 'fear' },
  GREED: { label: 'Serakah', color: 'text-yellow-500', value: 'greed' },
  CONFIDENCE: { label: 'Percaya Diri', color: 'text-green-500', value: 'confidence' },
  DOUBT: { label: 'Ragu', color: 'text-blue-500', value: 'doubt' },
  FRUSTRATION: { label: 'Frustrasi', color: 'text-orange-500', value: 'frustration' },
  EXCITEMENT: { label: 'Bersemangat', color: 'text-purple-500', value: 'excitement' },
};

export const TRADE_STATUS = {
  OPEN: { label: 'Terbuka', color: 'bg-blue-500', value: 'OPEN' },
  CLOSED: { label: 'Ditutup', color: 'bg-slate-500', value: 'CLOSED' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-500', value: 'CANCELLED' },
  PENDING: { label: 'Pending', color: 'bg-yellow-500', value: 'PENDING' },
};

export const TRADE_RESULT = {
  WIN: { label: 'Profit', color: 'text-green-500', icon: '📈' },
  LOSS: { label: 'Loss', color: 'text-red-500', icon: '📉' },
  BREAKEVEN: { label: 'BE', color: 'text-yellow-500', icon: '➡️' },
};

export const TRADE_DIRECTION = {
  BUY: { label: 'BUY', color: 'text-green-500', value: 'BUY' },
  SELL: { label: 'SELL', color: 'text-red-500', value: 'SELL' },
};

export const TIMEFRAMES = {
  M1: { label: '1 Menit', value: '1m', minutes: 1 },
  M5: { label: '5 Menit', value: '5m', minutes: 5 },
  M15: { label: '15 Menit', value: '15m', minutes: 15 },
  M30: { label: '30 Menit', value: '30m', minutes: 30 },
  H1: { label: '1 Jam', value: '1h', minutes: 60 },
  H4: { label: '4 Jam', value: '4h', minutes: 240 },
  D1: { label: '1 Hari', value: '1d', minutes: 1440 },
  W1: { label: '1 Minggu', value: '1w', minutes: 10080 },
  MN: { label: '1 Bulan', value: '1M', minutes: 43200 },
};

export const ACHIEVEMENT_TYPES = {
  CONSISTENCY: {
    id: 'consistency',
    label: 'Konsistensi',
    icon: '🎯',
    color: 'from-blue-500 to-blue-600',
  },
  DISCIPLINE: {
    id: 'discipline',
    label: 'Disiplin',
    icon: '⚔️',
    color: 'from-red-500 to-red-600',
  },
  SKILL: {
    id: 'skill',
    label: 'Skill',
    icon: '⭐',
    color: 'from-yellow-500 to-yellow-600',
  },
  PSYCHOLOGY: {
    id: 'psychology',
    label: 'Psikologi',
    icon: '🧠',
    color: 'from-purple-500 to-purple-600',
  },
};

export const ACHIEVEMENTS = {
  FIRST_TRADE: {
    id: 'first_trade',
    title: 'First Blood',
    description: 'Catat trade pertama Anda',
    type: 'SKILL',
    icon: '🎬',
    reward: 10,
  },
  FIVE_WINS: {
    id: 'five_wins',
    title: 'Mulai Panas',
    description: '5 kemenangan berturut-turut',
    type: 'CONSISTENCY',
    icon: '🔥',
    reward: 50,
  },
  TEN_WINS: {
    id: 'ten_wins',
    title: 'Streak Master',
    description: '10 kemenangan berturut-turut',
    type: 'CONSISTENCY',
    icon: '🌟',
    reward: 100,
  },
  PERFECT_DAY: {
    id: 'perfect_day',
    title: 'Perfect Day',
    description: 'Win rate 100% dalam sehari',
    type: 'DISCIPLINE',
    icon: '🏆',
    reward: 75,
  },
  RISK_MASTER: {
    id: 'risk_master',
    title: 'Risk Master',
    description: 'Maintain 1% risk per trade untuk 30 hari',
    type: 'DISCIPLINE',
    icon: '🎲',
    reward: 125,
  },
  EMOTION_CONTROL: {
    id: 'emotion_control',
    title: 'Emotion Control',
    description: 'Stay calm: 5 losses dengan confidence tinggi',
    type: 'PSYCHOLOGY',
    icon: '🧘',
    reward: 75,
  },
  HIGH_RR: {
    id: 'high_rr',
    title: 'High Risk:Reward Master',
    description: 'Average R:R ratio > 3:1',
    type: 'SKILL',
    icon: '📊',
    reward: 100,
  },
  JOURNAL_WARRIOR: {
    id: 'journal_warrior',
    title: 'Journal Warrior',
    description: 'Write detailed journal entry untuk 20 trades',
    type: 'PSYCHOLOGY',
    icon: '📝',
    reward: 60,
  },
  WEEK_PROFIT: {
    id: 'week_profit',
    title: 'Weekly Winner',
    description: 'Profit 7 hari berturut-turut',
    type: 'CONSISTENCY',
    icon: '💰',
    reward: 150,
  },
  MONTH_PROFIT: {
    id: 'month_profit',
    title: 'Monthly Champion',
    description: 'Profit seluruh bulan',
    type: 'DISCIPLINE',
    icon: '👑',
    reward: 250,
  },
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto',
};

export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  IDR: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah' },
};

export const API_LIMITS = {
  CHAT_MAX_TOKENS: 1024,
  CHAT_MAX_HISTORY: 50,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
};

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Input tidak valid',
  SERVER_ERROR: 'Terjadi kesalahan di server',
  NETWORK_ERROR: 'Kesalahan koneksi jaringan',
  AUTH_ERROR: 'Autentikasi gagal',
  NOT_FOUND: 'Data tidak ditemukan',
  DUPLICATE: 'Data sudah ada',
  FORBIDDEN: 'Anda tidak memiliki akses',
};

export const SUCCESS_MESSAGES = {
  SAVED: 'Data berhasil disimpan',
  DELETED: 'Data berhasil dihapus',
  UPDATED: 'Data berhasil diperbarui',
  COPIED: 'Disalin ke clipboard',
  EXPORTED: 'Data berhasil diekspor',
};

export const VALIDATION_RULES = {
  MIN_ACCOUNT_SIZE: 100,
  MAX_ACCOUNT_SIZE: 1000000,
  MIN_RISK_PERCENT: 0.1,
  MAX_RISK_PERCENT: 10,
  MIN_RR_RATIO: 0.5,
  MAX_RR_RATIO: 10,
  MIN_LEVERAGE: 1,
  MAX_LEVERAGE: 500,
};
