'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { CommanderArkaFullDisplay } from '@/components/ChatUIEnhancers';
import { 
  TrendingUp, Target, DollarSign, Award, Edit2, X, Check, Zap, 
  TrendingDown, Calendar, BookOpen, Calculator, Bot, BarChart3, 
  Flame, Sparkles, ArrowUpRight, ArrowDownRight, Activity, 
  Clock, CheckCircle2, XCircle, Trophy, Rocket, Shield, Sword, Brain, FileText, Lock
} from 'lucide-react';
import { getInitialBalance, saveInitialBalance } from '@/utils/storage-sync';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BentoGrid } from '@/components/Dashboard/BentoGrid';
import { toast } from '@/utils/toast';
import { CurrencySelector, useCurrency } from '@/components/CurrencySelector';
import { formatCurrency, type Currency } from '@/utils/helpers';
import { getExchangeRate, initializeExchangeRate } from '@/utils/exchange-rate';
// FASE 2.6.4: Import discipline metrics components
import { EmotionDistribution, DisciplineTrend, EmotionPerformance } from '@/components/Dashboard/DisciplineMetrics';
// Warrior Ranking Widget
import { WarriorRankingWidget } from '@/components/leaderboard/WarriorRankingWidget';
import { LeaderboardArkaTrigger } from '@/components/LeaderboardArkaTrigger';
import { useLeaderboardRankTrigger } from '@/hooks/useLeaderboardRankTrigger';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { trigger: rankTrigger } = useLeaderboardRankTrigger();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customBalance, setCustomBalance] = useState<number>(10000000); // Default 10 juta IDR
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState<string>('10000000');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(15750);
  const [showArkaPanel, setShowArkaPanel] = useState(true); // Show/hide Arka panel

  // Initialize exchange rate on mount
  useEffect(() => {
    initializeExchangeRate().then(() => {
      getExchangeRate().then(rate => setExchangeRate(rate));
    });
  }, []);

  // Load trades from API
  const loadTrades = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) return;

      const response = await fetch('/api/trades', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Map API response to dashboard format
        const mappedTrades = data.trades.map((t: any) => ({
          id: t.id,
          pair: t.pair,
          posisi: t.position,
          hasil: t.result,
          pip: t.pips,
          tanggal: new Date(t.tradeDate).toLocaleDateString('id-ID'),
          catatan: t.notes || '',
        }));
        setTrades(mappedTrades);
      }
    } catch (error) {
      console.error('Error loading trades:', error);
    }
  };

  // Load trades and balance on mount
  useEffect(() => {
    setIsLoading(true);
    
    // Load trades from API
    loadTrades();
    
    // Load initial balance
    const initialBalance = getInitialBalance();
    setCustomBalance(initialBalance);
    setTempBalance(initialBalance.toString());

    setIsLoading(false);
  }, []);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadTrades();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Listen for custom event when trades updated
  useEffect(() => {
    const handleTradesUpdate = () => {
      loadTrades();
    };

    window.addEventListener('tradesUpdated', handleTradesUpdate);

    return () => {
      window.removeEventListener('tradesUpdated', handleTradesUpdate);
    };
  }, []);

  // Also listen to storage changes for balance
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'mpt_initial_balance' && event.newValue) {
        try {
          const balance = parseFloat(event.newValue);
          setCustomBalance(balance);
          setTempBalance(balance.toString());
        } catch (error) {
          console.error('Error updating balance from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle balance edit
  const handleSaveBalance = () => {
    const newBalance = parseFloat(tempBalance);
    
    if (isNaN(newBalance) || newBalance <= 0) {
      toast.error('Invalid balance', 'Balance must be a positive number');
      return;
    }

    setCustomBalance(newBalance);
    saveInitialBalance(newBalance);
    setIsEditingBalance(false);
    
    const formattedBalance = formatCurrency(newBalance, currency);
    toast.success('Balance updated!', `New balance: ${formattedBalance}`);
  };

  const handleCancelEdit = () => {
    setTempBalance(customBalance.toString());
    setIsEditingBalance(false);
  };

  // Handle doctrine access with decrypting animation
  const handleAccessDoctrine = () => {
    setIsDecrypting(true);
    setTimeout(() => {
      window.location.href = '/tutorial';
    }, 800);
  };

  // Calculate statistics
  const totalTrades = trades.length;
  const winTrades = trades.filter(t => t.hasil === 'WIN').length;
  const lossTrades = totalTrades - winTrades;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  
  const calculateBestStreak = () => {
    let currentStreak = 0;
    let bestStreak = 0;
    trades.forEach(trade => {
      if (trade.hasil === 'WIN') {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    return bestStreak;
  };

  const totalPips = trades.reduce((sum, trade) => sum + trade.pip, 0);
  const currentBalance = customBalance + (totalPips * 16500);
  const profitLoss = currentBalance - customBalance;
  const profitLossPercentage = customBalance > 0 ? ((profitLoss / customBalance) * 100).toFixed(2) : '0.00';

  const avgPipsPerWin = winTrades > 0 
    ? Math.round(trades.filter(t => t.hasil === 'WIN').reduce((sum, t) => sum + t.pip, 0) / winTrades * 100) / 100
    : 0;

  const recentTrades = trades.slice(0, 5);
  const bestStreak = calculateBestStreak();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-zinc-400" suppressHydrationWarning>{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sky-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-sky-950/20">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 dark:bg-sky-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section - The Warrior Toggle Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-8 md:p-12 shadow-2xl shadow-amber-500/30"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="text-sm font-semibold text-white tracking-wide" suppressHydrationWarning>{t('dashboard.commandCenter')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg" suppressHydrationWarning>
                {t('dashboard.hero.title')} 🎯
              </h1>
              
              <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed" suppressHydrationWarning>
                {t('dashboard.hero.subtitle')}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/journal">
                  <Button variant="glass" size="lg" leftIcon={<BookOpen className="w-5 h-5" />} suppressHydrationWarning>
                    {t('dashboard.button.newTrade')}
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" suppressHydrationWarning>
                    {t('dashboard.button.viewAnalytics')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Balance Card - Floating Design */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-zinc-400" suppressHydrationWarning>{t('dashboard.portfolioValue')}</span>
                {!isEditingBalance && (
                  <button
                    onClick={() => setIsEditingBalance(true)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              
              {/* Currency Selector */}
              <div className="mb-4">
                <CurrencySelector value={currency} onChange={setCurrency} className="scale-90 origin-left" />
              </div>

              {isEditingBalance ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Initial Balance ({currency})
                    </label>
                    <input
                      type="number"
                      value={tempBalance}
                      onChange={(e) => setTempBalance(e.target.value)}
                      placeholder={currency === 'IDR' ? '10000000' : '1000'}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {currency === 'IDR' ? 'Contoh: 10000000 (10 juta), 5000000 (5 juta)' : 'Example: 1000, 5000, 10000'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveBalance} className="flex-1">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="flex-1">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-black text-gray-900 dark:text-zinc-100 mb-2">
                    {formatCurrency(currentBalance, currency)}
                  </div>
                  
                  <div className={`flex items-center gap-2 text-sm font-semibold ${
                    profitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {profitLoss >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>
                      {profitLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(profitLoss), currency)} ({profitLoss >= 0 ? '+' : ''}{profitLossPercentage}%)
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* THE MPT WAY - OPERATIONAL DOCTRINE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative"
        >
          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-[0.3em]">
                  [ OPERATIONAL DOCTRINE ]
                </h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-zinc-100">
                Kuasai Medan Perang dengan The MPT Way
              </h3>
            </div>
          </div>

          {/* Featured Doctrine Card */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300 animate-pulse" />
            
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-6 md:p-8 border-2 border-amber-500/50 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* Left: Icon & Badge */}
                <div className="flex flex-col items-center lg:items-start space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/30 rounded-xl blur-xl" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Classified
                    </span>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 space-y-6">
                  {/* Title */}
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-2">
                      The MPT Way: Tactical Trading Protocol
                    </h4>
                    <p className="text-slate-400 text-sm md:text-base">
                      Modul operasional lengkap untuk menguasai market dengan presisi dan disiplin. Akses sekarang untuk mempelajari strategi yang telah terbukti.
                    </p>
                  </div>

                  {/* 3 Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pillar 1: Strategy */}
                    <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-2">
                        <Sword className="w-5 h-5 text-amber-500" />
                        <h5 className="font-bold text-white text-sm">The Strategy</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Teknik membaca struktur pasar dengan presisi tinggi
                      </p>
                    </div>

                    {/* Pillar 2: Risk Management */}
                    <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <h5 className="font-bold text-white text-sm">Risk Management</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Protokol perlindungan modal dalam kondisi market apa pun
                      </p>
                    </div>

                    {/* Pillar 3: Psychology */}
                    <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-amber-500" />
                        <h5 className="font-bold text-white text-sm">Warrior Psychology</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Mentalitas pejuang yang tenang dan tidak emosional
                      </p>
                    </div>
                  </div>

                  {/* Access Button */}
                  <button
                    onClick={handleAccessDoctrine}
                    disabled={isDecrypting}
                    className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-black uppercase tracking-[0.3em] text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:text-slate-500 disabled:shadow-none group"
                  >
                    {isDecrypting ? (
                      <>
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-slate-950 animate-pulse" style={{animationDelay: '0ms'}} />
                          <div className="w-1 h-4 bg-slate-950 animate-pulse" style={{animationDelay: '100ms'}} />
                          <div className="w-1 h-4 bg-slate-950 animate-pulse" style={{animationDelay: '200ms'}} />
                        </div>
                        <span>DECRYPTING...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Access Doctrine</span>
                      </>
                    )}
                  </button>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Format: PDF // Access: Authorized
                    </p>
                    <p className="text-[10px] font-mono text-amber-500/60 uppercase">
                      For Warrior Eyes Only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/*         </span>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Bento Grid Stats - NEW DESIGN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <BentoGrid 
            stats={{
              totalTrades,
              winRate,
              balance: currentBalance,
              profitLoss,
              bestStreak,
              avgPipsPerWin,
            }}
          />
        </motion.div>

        {/* Warrior Ranking Widget - Mini Leaderboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <WarriorRankingWidget />
        </motion.div>

        {/* Quick Actions - NEW GRID DESIGN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-sky-500" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/journal" className="group">
              <Card variant="glass" interactive className="h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100">Trade Journal</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Log new trades</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/calculator" className="group">
              <Card variant="glass" interactive className="h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100">Calculator</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Risk management</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-mentor" className="group">
              <Card variant="glass" interactive className="h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100">AI Mentor</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Get insights</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/achievements" className="group">
              <Card variant="glass" interactive className="h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100">Achievements</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">View progress</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* FASE 2.6.4: Discipline Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <EmotionDistribution trades={trades} />
          <DisciplineTrend trades={trades} />
          <EmotionPerformance trades={trades} />
        </motion.div>

        {/* Recent Trades - MODERN TABLE DESIGN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <Activity className="w-6 h-6 text-sky-500" />
              Recent Trades
            </h2>
            <Link href="/journal">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <Card variant="glass" padding="none">
            {recentTrades.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">No trades yet</h3>
                <p className="text-gray-600 dark:text-zinc-400 mb-4">Start logging your trades to see them here</p>
                <Link href="/journal">
                  <Button variant="primary">Log Your First Trade</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-zinc-800">
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-zinc-400">Date</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-zinc-400">Pair</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-zinc-400">Type</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-zinc-400">Pips</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-zinc-400">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map((trade, index) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                            <Clock className="w-4 h-4" />
                            {new Date(trade.tanggal).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900 dark:text-zinc-100">{trade.pair}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="neutral" size="sm">
                            {trade.posisi}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-bold ${
                            trade.pip >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {trade.pip >= 0 ? '+' : ''}{trade.pip}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {trade.hasil === 'WIN' ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              Win
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-semibold text-sm">
                              <XCircle className="w-4 h-4" />
                              Loss
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Performance Insights - NEW SECTION */}
        {totalTrades > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card variant="bento" className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-sky-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Win Rate</h3>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-zinc-100">{winRate}%</div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{winTrades}W / {lossTrades}L</p>
            </Card>

            <Card variant="bento" className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Best Streak</h3>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-zinc-100">{bestStreak}</div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Consecutive wins</p>
            </Card>

            <Card variant="bento" className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Avg Pips/Win</h3>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-zinc-100">+{avgPipsPerWin}</div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Per winning trade</p>
            </Card>
          </motion.div>
        )}

      </div>

      {/* Touchpoint 2: Commander Arka Floating Button - Bottom Right Corner */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40">
        {/* Minimize Button */}
        {!showArkaPanel && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowArkaPanel(true)}
            className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full shadow-lg shadow-amber-500/50 transition-all duration-300 hover:scale-110 cursor-pointer"
            title="Buka Commander Arka"
          >
            <div className="w-10 h-10 md:w-12 md:h-12">
              <CommanderArkaFullDisplay pose="vision" />
            </div>
          </motion.button>
        )}

        {/* Expanded Panel */}
        {showArkaPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 md:p-5 shadow-2xl shadow-amber-500/20 w-72 md:w-80"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowArkaPanel(false)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full text-white flex items-center justify-center text-lg font-bold transition-colors"
              title="Tutup panel"
            >
              ×
            </button>

            <div className="flex items-start gap-3">
              {/* Mascot */}
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 mt-1">
                <CommanderArkaFullDisplay pose="vision" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-amber-400 font-bold text-sm md:text-base">Commander Online</span>
                </div>
                <p className="text-slate-300 text-xs md:text-sm leading-tight">
                  Siap membantu Anda dalam setiap trading decision
                </p>
                <Link href="/ai-mentor">
                  <button className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors w-full">
                    Konsultasi Sekarang
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Arka Leaderboard Trigger Notification */}
        {rankTrigger && (
          <LeaderboardArkaTrigger
            message={rankTrigger.message}
            pose={rankTrigger.arkaPose}
            isVisible={rankTrigger.showArka}
            onClose={() => {}}
          />
        )}
      </div>
    </div>
  );
}
