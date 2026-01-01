// Configuration untuk MPT Warrior App

export const config = {
  app: {
    name: "MPT Warrior",
    description: "Mindset Plan Trader - Complete Trading System",
    version: "1.0.0",
    author: "MPT Team",
  },

  // API Configuration
  api: {
    gemini: {
      baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
      model: "gemini-flash-latest",
      maxTokens: 1024,
    },
    cosmosDb: {
      endpoint: process.env.NEXT_PUBLIC_COSMOS_ENDPOINT || "https://localhost:8081/",
      database: "mpt-warrior",
      containers: {
        trades: "trades",
        users: "users",
        achievements: "achievements",
        journalEntries: "journal_entries",
        chatHistory: "chat_history",
      },
    },
  },

  // Trading Configuration
  trading: {
    defaultRiskPercent: 2,
    maxRiskPercent: 5,
    minRiskPercent: 0.5,
    defaultLeverage: 1,
    maxLeverage: 100,
    // 4 Pilar MPT
    fouPillars: ["Mindset", "Plan", "Risk (1%)", "Discipline"],
  },

  // Risk Management
  riskManagement: {
    riskPerTrade: 1, // Satu persen per trade
    maxDrawdown: 20, // 20% drawdown max
    dailyLossLimit: 5, // 5% daily loss limit
    accountSizeThreshold: 10000, // Minimum account size
  },

  // UI Configuration
  ui: {
    theme: {
      defaultMode: "dark",
      supportedModes: ["light", "dark"],
      colors: {
        primary: "#0ea5e9",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
      },
    },
    pagination: {
      pageSize: 20,
      maxPages: 10,
    },
  },

  // Features
  features: {
    aiMentor: true,
    tradingJournal: true,
    achievements: true,
    analytics: true,
    economicCalendar: true,
    riskCalculator: true,
    panicButton: true,
    darkMode: true,
    pwa: true,
  },

  // Cache Configuration
  cache: {
    ttl: 3600, // 1 hour
    maxSize: 100, // items
  },

  // Logging
  logging: {
    enabled: true,
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    maxLogSize: 1000,
  },

  // Database
  database: {
    useEmulator: process.env.NODE_ENV === "development",
    connectionTimeout: 10000,
    requestTimeout: 30000,
  },

  // Performance
  performance: {
    enableCompression: true,
    enableCaching: true,
    preloadAssets: true,
  },
};

export type Config = typeof config;
