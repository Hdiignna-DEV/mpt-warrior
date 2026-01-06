import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      "header.stats.totalTrades": "Total Trades",
      "header.stats.winRate": "Win Rate",
      "header.stats.profitLoss": "Profit/Loss",
      "header.stats.streak": "Streak",
      
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.journal": "Journal",
      "nav.analytics": "Analytics",
      "nav.aiMentor": "AI Mentor",
      "nav.calculator": "Calculator",
      "nav.achievements": "Achievements",
      "nav.adminHQ": "Admin HQ",
      
      // AI Mentor
      "ai.title": "AI Mentor",
      "ai.subtitle": "Your Trading Intelligence Assistant",
      "ai.placeholder": "Ask your trading question...",
      "ai.send": "Send",
      "ai.translate": "Translate",
      "ai.thinking": "Analyzing...",
      
      // War Zone Calendar
      "warzone.title": "WAR ZONE CALENDAR",
      "warzone.subtitle": "Real-Time Economic Events",
      "warzone.alert": "WAR ZONE ALERT",
      "warzone.economicCalendar": "Economic Calendar (Live)",
      "warzone.warning": "HIGH IMPACT",
      "warzone.warningText": "Stay away or tighten SL!",
      "warzone.close": "CLOSE",
      "warzone.impact.high": "CRITICAL VOLATILITY - STAY CLEAR",
      "warzone.impact.medium": "TACTICAL CAUTION REQUIRED",
      "warzone.impact.low": "MINIMAL THREAT - PROCEED",
      "warzone.noEvents": "NO HOSTILE ACTIVITY DETECTED",
      "warzone.loading": "SCANNING ECONOMIC BATTLEFIELD...",
      
      // Footer
      "footer.brand": "MPT WARRIOR",
      "footer.tagline": "Trading Excellence Hub. Mindset, Plan, Risk, Discipline with structured system.",
      "footer.rights": "All rights reserved",
      "footer.links.about": "About",
      "footer.links.contact": "Contact",
      "footer.links.privacy": "Privacy",
      "footer.links.terms": "Terms",
      
      // Trading Terms
      "term.long": "Long",
      "term.short": "Short",
      "term.stopLoss": "Stop Loss",
      "term.takeProfit": "Take Profit",
      "term.leverage": "Leverage",
      "term.margin": "Margin",
      "term.pnl": "P&L",
      "term.entry": "Entry",
      "term.exit": "Exit",
      
      // Economic Terms (tooltips)
      "economic.hawkish": "Hawkish: Favoring higher interest rates",
      "economic.dovish": "Dovish: Favoring lower interest rates",
      "economic.nfp": "Non-Farm Payroll: Employment data",
      "economic.gdp": "GDP: Economic growth indicator",
      "economic.cpi": "CPI: Inflation measure",
      "economic.fomc": "FOMC: Federal Reserve meeting",
      
      // Buttons & Actions
      "action.save": "Save",
      "action.cancel": "Cancel",
      "action.delete": "Delete",
      "action.edit": "Edit",
      "action.add": "Add",
      "action.refresh": "Refresh",
      "action.export": "Export",
      "action.import": "Import",
      
      // Messages
      "msg.loading": "Loading...",
      "msg.success": "Success!",
      "msg.error": "Error occurred",
      "msg.noData": "No data available",
      "msg.confirm": "Are you sure?",
      
      // Language Module
      "lang.switch": "REGION SYNC",
      "lang.id": "Indonesian",
      "lang.en": "English",
      "lang.active": "Active Language",
      
      // Dashboard
      "dashboard.commandCenter": "MPT WARRIOR COMMAND CENTER",
      "dashboard.hero.title": "Adapt to Every Market Condition",
      "dashboard.hero.subtitle": "Command your trades in the dark of the night or the light of the day. MPT Warrior provides the clarity you need, whenever you need it.",
      "dashboard.button.newTrade": "New Trade",
      "dashboard.button.viewAnalytics": "View Analytics",
      "dashboard.portfolioValue": "Portfolio Value",
      "dashboard.loading": "Loading dashboard...",
      
      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.noData": "No data available",
      
      // Journal
      "journal.title": "Trade Journal",
      "journal.subtitle": "Track and analyze your trading history",
      
      // Analytics
      "analytics.title": "Analytics Dashboard",
      "analytics.subtitle": "Performance metrics and insights",
      
      // Calculator
      "calculator.title": "Risk Calculator",
      "calculator.subtitle": "Calculate position size and risk",
      
      // AI Mentor
      "aiMentor.title": "AI Trading Mentor",
      "aiMentor.subtitle": "Get intelligent trading insights",
      
      // Achievements
      "achievements.title": "Trading Achievements",
      "achievements.subtitle": "Track your milestones and progress",
      
      // Trade Journal
      "journal.addTrade": "Add Trade",
      "journal.pair": "Pair",
      "journal.position": "Position",
      "journal.pips": "Pips",
      "journal.notes": "Notes",
      "journal.date": "Date",
      "journal.result": "Result",
      "journal.actions": "Actions",
      "journal.export": "Export",
      "journal.share": "Share",
      "journal.exportJSON": "Export as JSON",
      "journal.exportCSV": "Export as CSV",
      "journal.noTrades": "No trades yet",
      "journal.noData": "NO OPERATIONS RECORDED",
      "journal.startTrading": "Begin your tactical operations",
      "journal.fillPairPip": "Fill Pair and Pips first!",
      "journal.invalidPip": "Pips must be a non-zero number!",
      "journal.selectPair": "Select a pair",
      
      // Statistics
      "stats.totalTrades": "Total Trades",
      "stats.winRate": "Win Rate",
      "stats.profitFactor": "Profit Factor",
      "stats.totalPips": "Total Pips",
      "stats.avgPips": "Avg Pips/Trade",
      "stats.maxWins": "Max Consecutive Wins",
      "stats.maxLoss": "Max Consecutive Losses",
      "stats.sharpeRatio": "Sharpe Ratio",
      "stats.drawdown": "Max Drawdown",
      "stats.riskReward": "Risk/Reward Ratio",
      "stats.bestPair": "Best Performing Pair",
      "stats.worstPair": "Worst Performing Pair",
      "stats.monthlyPerformance": "Monthly Performance",
      "stats.pairPerformance": "Pair Performance",
      "stats.equityCurve": "Equity Curve",
      "stats.noDataYet": "No data yet - start trading!",
      
      // Achievements
      "achievement.earned": "Earned",
      "achievement.locked": "Locked",
      "achievement.rarity.common": "Common",
      "achievement.rarity.rare": "Rare",
      "achievement.rarity.epic": "Epic",
      "achievement.rarity.legendary": "Legendary",
      "achievement.progress": "Progress",
      "achievement.unlocked": "badges unlocked",
      "achievement.firstTrade.name": "First Trade",
      "achievement.firstTrade.desc": "Complete your first trade",
      "achievement.tenTrades.name": "Decathlon",
      "achievement.tenTrades.desc": "Complete 10 trades",
      "achievement.hundredTrades.name": "Centaur",
      "achievement.hundredTrades.desc": "Complete 100 trades",
      "achievement.fiveWins.name": "Winning Streak",
      "achievement.fiveWins.desc": "Get 5 consecutive wins",
      "achievement.perfectDay.name": "Perfect Day",
      "achievement.perfectDay.desc": "100% Win Rate in a single day",
      "achievement.profitWarrior.name": "Profit Warrior",
      "achievement.profitWarrior.desc": "Achieve 75% Win Rate",
      "achievement.consistent.name": "Consistent Trader",
      "achievement.consistent.desc": "Trade for 7 consecutive days",
      "achievement.masterTrader.name": "Master Trader",
      "achievement.masterTrader.desc": "80% Win Rate on 50+ trades",
      "achievement.bigPips.name": "Big Pips Hunter",
      "achievement.bigPips.desc": "Land a 100+ pip trade",
      "achievement.resilient.name": "Resilient Trader",
      "achievement.resilient.desc": "Recover from a 5 loss streak",
      "achievement.nextMilestones": "Next Milestones",
      "achievement.masterWarrior": "Master Warrior!",
      "achievement.allUnlocked": "Congratulations! You've unlocked all badges!",
    }
  },
  id: {
    translation: {
      // Header
      "header.stats.totalTrades": "Total Trade",
      "header.stats.winRate": "Win Rate",
      "header.stats.profitLoss": "Profit/Loss",
      "header.stats.streak": "Streak",
      
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.journal": "Jurnal",
      "nav.analytics": "Analitik",
      "nav.aiMentor": "AI Mentor",
      "nav.calculator": "Kalkulator",
      "nav.achievements": "Pencapaian",
      "nav.adminHQ": "Admin HQ",
      
      // AI Mentor
      "ai.title": "AI Mentor",
      "ai.subtitle": "Asisten Kecerdasan Trading Anda",
      "ai.placeholder": "Tanyakan pertanyaan trading Anda...",
      "ai.send": "Kirim",
      "ai.translate": "Terjemahkan",
      "ai.thinking": "Menganalisis...",
      
      // War Zone Calendar
      "warzone.title": "KALENDER ZONA PERANG",
      "warzone.subtitle": "Event Ekonomi Real-Time",
      "warzone.alert": "PERINGATAN ZONA PERANG",
      "warzone.economicCalendar": "Kalender Ekonomi (Live)",
      "warzone.warning": "DAMPAK TINGGI",
      "warzone.warningText": "Jauhi atau perketat SL!",
      "warzone.close": "TUTUP",
      "warzone.impact.high": "VOLATILITAS KRITIS - JAUHI MARKET",
      "warzone.impact.medium": "KEWASPADAAN TAKTIS DIPERLUKAN",
      "warzone.impact.low": "ANCAMAN MINIMAL - LANJUTKAN",
      "warzone.noEvents": "TIDAK ADA AKTIVITAS HOSTILE TERDETEKSI",
      "warzone.loading": "MEMINDAI MEDAN EKONOMI...",
      
      // Footer
      "footer.brand": "MPT WARRIOR",
      "footer.tagline": "Hub Keunggulan Trading. Mentalitas, Rencana, Risk, Disiplin dengan sistem terstruktur.",
      "footer.rights": "Semua hak dilindungi",
      "footer.links.about": "Tentang",
      "footer.links.contact": "Kontak",
      "footer.links.privacy": "Privasi",
      "footer.links.terms": "Syarat",
      
      // Trading Terms
      "term.long": "Long/Beli",
      "term.short": "Short/Jual",
      "term.stopLoss": "Stop Loss",
      "term.takeProfit": "Take Profit",
      "term.leverage": "Leverage",
      "term.margin": "Margin",
      "term.pnl": "P&L",
      "term.entry": "Entry",
      "term.exit": "Exit",
      
      // Economic Terms (tooltips)
      "economic.hawkish": "Hawkish: Mendukung suku bunga lebih tinggi",
      "economic.dovish": "Dovish: Mendukung suku bunga lebih rendah",
      "economic.nfp": "Non-Farm Payroll: Data ketenagakerjaan AS",
      "economic.gdp": "GDP: Indikator pertumbuhan ekonomi",
      "economic.cpi": "CPI: Ukuran inflasi",
      "economic.fomc": "FOMC: Pertemuan Federal Reserve",
      
      // Buttons & Actions
      "action.save": "Simpan",
      "action.cancel": "Batal",
      "action.delete": "Hapus",
      "action.edit": "Edit",
      "action.add": "Tambah",
      "action.refresh": "Muat Ulang",
      "action.export": "Ekspor",
      "action.import": "Impor",
      
      // Messages
      "msg.loading": "Memuat...",
      "msg.success": "Berhasil!",
      "msg.error": "Terjadi kesalahan",
      "msg.noData": "Tidak ada data",
      "msg.confirm": "Anda yakin?",
      
      // Language Module
      "lang.switch": "SINKRONISASI REGIONAL",
      "lang.id": "Bahasa Indonesia",
      "lang.en": "Bahasa Inggris",
      "lang.active": "Bahasa Aktif",
      
      // Dashboard
      "dashboard.commandCenter": "PUSAT KOMANDO MPT WARRIOR",
      "dashboard.hero.title": "Beradaptasi dengan Setiap Kondisi Pasar",
      "dashboard.hero.subtitle": "Komandoi trading Anda dalam kegelapan malam atau terang hari. MPT Warrior memberikan kejelasan yang Anda butuhkan, kapanpun Anda membutuhkannya.",
      "dashboard.button.newTrade": "Trade Baru",
      "dashboard.button.viewAnalytics": "Lihat Analitik",
      "dashboard.portfolioValue": "Nilai Portofolio",
      "dashboard.loading": "Memuat dashboard...",
      
      // Common
      "common.loading": "Memuat...",
      "common.save": "Simpan",
      "common.cancel": "Batal",
      "common.edit": "Edit",
      "common.delete": "Hapus",
      "common.noData": "Tidak ada data",
      
      // Journal
      "journal.title": "Jurnal Trading",
      "journal.subtitle": "Lacak dan analisis riwayat trading Anda",
      
      // Analytics
      "analytics.title": "Dashboard Analitik",
      "analytics.subtitle": "Metrik performa dan wawasan",
      
      // Calculator
      "calculator.title": "Kalkulator Risiko",
      "calculator.subtitle": "Hitung ukuran posisi dan risiko",
      
      // AI Mentor
      "aiMentor.title": "AI Mentor Trading",
      "aiMentor.subtitle": "Dapatkan wawasan trading cerdas",
      
      // Achievements
      "achievements.title": "Pencapaian Trading",
      "achievements.subtitle": "Lacak pencapaian dan progres Anda",
      
      // Trade Journal
      "journal.addTrade": "Tambah Trade",
      "journal.pair": "Pair",
      "journal.position": "Posisi",
      "journal.pips": "Pip",
      "journal.notes": "Catatan",
      "journal.date": "Tanggal",
      "journal.result": "Hasil",
      "journal.actions": "Aksi",
      "journal.export": "Ekspor",
      "journal.share": "Bagikan",
      "journal.exportJSON": "Ekspor sebagai JSON",
      "journal.exportCSV": "Ekspor sebagai CSV",
      "journal.noTrades": "Belum ada trade",
      "journal.noData": "TIDAK ADA OPERASI TERDETEKSI",
      "journal.startTrading": "Mulai operasi taktis Anda",
      "journal.fillPairPip": "Isi Pair dan Pip terlebih dahulu!",
      "journal.invalidPip": "Pip harus berupa angka bukan 0!",
      "journal.selectPair": "Pilih pair",
      
      // Statistics
      "stats.totalTrades": "Total Trade",
      "stats.winRate": "Win Rate",
      "stats.profitFactor": "Profit Factor",
      "stats.totalPips": "Total Pip",
      "stats.avgPips": "Rata-rata Pip/Trade",
      "stats.maxWins": "Kemenangan Beruntun Max",
      "stats.maxLoss": "Kekalahan Beruntun Max",
      "stats.sharpeRatio": "Sharpe Ratio",
      "stats.drawdown": "Max Drawdown",
      "stats.riskReward": "Rasio Risk/Reward",
      "stats.bestPair": "Pair Terbaik",
      "stats.worstPair": "Pair Terburuk",
      "stats.monthlyPerformance": "Performa Bulanan",
      "stats.pairPerformance": "Performa Pair",
      "stats.equityCurve": "Kurva Ekuitas",
      "stats.noDataYet": "Belum ada data - mulai trading!",
      
      // Achievements
      "achievement.earned": "Didapatkan",
      "achievement.locked": "Terkunci",
      "achievement.rarity.common": "Umum",
      "achievement.rarity.rare": "Langka",
      "achievement.rarity.epic": "Epik",
      "achievement.rarity.legendary": "Legendaris",
      "achievement.progress": "Progres",
      "achievement.unlocked": "lencana terbuka",
      "achievement.firstTrade.name": "Trade Pertama",
      "achievement.firstTrade.desc": "Selesaikan trade pertama Anda",
      "achievement.tenTrades.name": "Decathlon",
      "achievement.tenTrades.desc": "Selesaikan 10 trade",
      "achievement.hundredTrades.name": "Centaur",
      "achievement.hundredTrades.desc": "Selesaikan 100 trade",
      "achievement.fiveWins.name": "Winning Streak",
      "achievement.fiveWins.desc": "Dapatkan 5 kemenangan beruntun",
      "achievement.perfectDay.name": "Hari Sempurna",
      "achievement.perfectDay.desc": "Win Rate 100% dalam satu hari",
      "achievement.profitWarrior.name": "Prajurit Profit",
      "achievement.profitWarrior.desc": "Raih Win Rate 75%",
      "achievement.consistent.name": "Trader Konsisten",
      "achievement.consistent.desc": "Trading 7 hari berturut-turut",
      "achievement.masterTrader.name": "Master Trader",
      "achievement.masterTrader.desc": "Win Rate 80% dari 50+ trade",
      "achievement.bigPips.name": "Pemburu Pip Besar",
      "achievement.bigPips.desc": "Dapatkan trade 100+ pip",
      "achievement.resilient.name": "Trader Tangguh",
      "achievement.resilient.desc": "Bangkit dari 5 kali kekalahan beruntun",
      "achievement.nextMilestones": "Pencapaian Berikutnya",
      "achievement.masterWarrior": "Master Warrior!",
      "achievement.allUnlocked": "Selamat! Anda telah membuka semua lencana!",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'id'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mpt-language',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
