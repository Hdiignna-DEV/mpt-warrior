'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTrades, saveTrades, onTradesUpdated } from '@/utils/storage-sync';
import type { Trade } from '@/utils/storage-sync';

// List of popular trading pairs
const POPULAR_PAIRS = [
  'XAUUSD',
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'AUDUSD',
  'USDCAD',
  'NZDUSD',
  'BTCUSD',
  'ETHUSD',
  'USDINR',
  'USDCHF',
  'EURGBP',
  'EURJPY',
  'GBPJPY',
  'AUDJPY',
  'NZDJPY',
  'EURCHF',
  'GBPCHF',
];

export default function JurnalTrading() {
  const { t } = useTranslation();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pair, setPair] = useState('XAUUSD');
  const [posisi, setPosisi] = useState<'BUY' | 'SELL'>('BUY');
  const [pip, setPip] = useState('');
  const [catatan, setCatatan] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showPairDropdown, setShowPairDropdown] = useState(false);

  // Load dari localStorage
  useEffect(() => {
    const saved = getTrades();
    setTrades(saved);
  }, []);

  // Subscribe to trades updates
  useEffect(() => {
    const unsubscribe = onTradesUpdated((updatedTrades) => {
      setTrades(updatedTrades);
    });
    return unsubscribe;
  }, []);

  // Save ke localStorage
  useEffect(() => {
    if (trades.length > 0) {
      saveTrades(trades);
    }
  }, [trades]);

  // Auto-determine WIN/LOSS based on pips
  const getHasil = (): 'WIN' | 'LOSS' => {
    const pipValue = parseFloat(pip);
    if (isNaN(pipValue)) return 'WIN';
    return pipValue > 0 ? 'WIN' : 'LOSS';
  };

  const tambahTrade = () => {
    if (!pair || !pip) {
      alert(t('journal.fillPairPip'));
      return;
    }

    const pipValue = parseFloat(pip);
    if (isNaN(pipValue) || pipValue === 0) {
      alert(t('journal.invalidPip'));
      return;
    }

    const hasil = getHasil();

    const tradeBaru: Trade = {
      id: Date.now().toString(),
      pair,
      posisi,
      hasil,
      pip: pipValue,
      tanggal: new Date().toISOString().split('T')[0],
      catatan,
    };

    setTrades([tradeBaru, ...trades]);
    setPair('XAUUSD');
    setPip('');
    setCatatan('');
    setPosisi('BUY');
  };

  const hapusTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  // Export functions
  const exportToEnhancedCSV = () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-export!');
      return;
    }

    const totalTrade = trades.length;
    const win = trades.filter((t) => t.hasil === 'WIN').length;
    const loss = totalTrade - win;
    const winRate = totalTrade > 0 ? Math.round((win / totalTrade) * 100) : 0;
    const totalPips = trades.reduce((acc, t) => acc + t.pip, 0);
    const customBalance = parseFloat(localStorage.getItem('mpt_initial_balance') || '10000');

    let csvContent = '';

    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'MPT WARRIOR HUB - TRADING JOURNAL REPORT\n';
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += `Export Date:,${new Date().toLocaleString('id-ID')}\n`;
    csvContent += '\n';

    csvContent += '─────────────────────────────────────────────────────────────\n';
    csvContent += 'SUMMARY STATISTICS\n';
    csvContent += '─────────────────────────────────────────────────────────────\n';
    csvContent += `Total Trades:,${totalTrade}\n`;
    csvContent += `Total WIN:,${win}\n`;
    csvContent += `Total LOSS:,${loss}\n`;
    csvContent += `Win Rate:,${winRate}%\n`;
    csvContent += `Total Pips:,${totalPips >= 0 ? '+' : ''}${totalPips}\n`;
    csvContent += `Initial Balance:,$${customBalance.toLocaleString('en-US')}\n`;
    csvContent += `Estimated Balance:,$${(customBalance + totalPips * 10).toLocaleString('en-US')}\n`;
    csvContent += '\n';

    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'DETAILED TRADES\n';
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'Pair,Position,Result,Pips,Date,Notes\n';

    trades.forEach((trade) => {
      const pipsDisplay = trade.pip > 0 ? `+${trade.pip}` : `${trade.pip}`;
      const notes = trade.catatan ? `"${trade.catatan.replace(/"/g, '""')}"` : '';
      csvContent += `${trade.pair},${trade.posisi},${trade.hasil},${pipsDisplay},${trade.tanggal},${notes}\n`;
    });

    csvContent += '\n';
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'MPT PHILOSOPHY: MINDSET → PLAN → TRADER\n';
    csvContent += 'Remember: Discipline is your competitive advantage!\n';
    csvContent += '═══════════════════════════════════════════════════════════════\n';

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `MPT-Journal_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setShowExportOptions(false);
  };

  const shareToClipboard = async () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-share!');
      return;
    }

    const totalTrade = trades.length;
    const win = trades.filter((t) => t.hasil === 'WIN').length;
    const loss = totalTrade - win;
    const winRate = totalTrade > 0 ? Math.round((win / totalTrade) * 100) : 0;
    const totalPips = trades.reduce((acc, t) => acc + t.pip, 0);
    const customBalance = parseFloat(localStorage.getItem('mpt_initial_balance') || '10000');

    const shareText = `📊 MPT WARRIOR TRADING STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Total Trades: ${totalTrade}
✅ WIN: ${win} | ❌ LOSS: ${loss}
🎯 Win Rate: ${winRate}%
💰 Total Pips: ${totalPips >= 0 ? '+' : ''}${totalPips}
💎 Balance: $${(customBalance + totalPips * 10).toLocaleString('en-US')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 https://mpt-warrior.vercel.app`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('📋 Stats berhasil dicopy! Siap untuk di-share.');
      setShowExportOptions(false);
    } catch (err) {
      alert('Gagal copy ke clipboard');
    }
  };

  const totalTrade = trades.length;
  const win = trades.filter((t) => t.hasil === 'WIN').length;
  const loss = totalTrade - win;
  const winRate = totalTrade > 0 ? Math.round((win / totalTrade) * 100) : 0;
  const totalPips = trades.reduce((acc, t) => acc + t.pip, 0);
  const currentHasil = getHasil();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pt-24 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between gap-3 md:gap-4 mb-4">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <div className="p-2 md:p-3 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <BookOpen className="text-amber-400" size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-black text-amber-400" suppressHydrationWarning>{t('journal.title')}</h1>
              <p className="text-slate-300 text-sm md:text-base" suppressHydrationWarning>{t('journal.subtitle')}</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-bold text-sm md:text-base"
            >
              <Download size={20} />
              <span className="hidden md:inline" suppressHydrationWarning>{t('journal.export')}</span>
            </button>

            {showExportOptions && (
              <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 w-56">
                <button
                  onClick={exportToEnhancedCSV}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-700 text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-green-400" suppressHydrationWarning>📈 {t('journal.exportCSV')}</span>
                  <span className="text-xs text-slate-400">Enhanced with statistics</span>
                </button>

                <button
                  onClick={shareToClipboard}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-red-400 flex items-center gap-2">
                    <Share2 size={16} /> <span suppressHydrationWarning>{t('journal.share')}</span>
                  </span>
                  <span className="text-xs text-slate-400">Copy to clipboard</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-500 via-slate-700 to-transparent rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/50">
          <p className="text-slate-400 text-xs md:text-sm mb-1" suppressHydrationWarning>{t('stats.totalTrades')}</p>
          <p className="text-2xl md:text-3xl font-black text-white">{totalTrade}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-green-500/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">WIN</p>
          <p className="text-2xl md:text-3xl font-black text-green-400">{win}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-red-500/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">LOSS</p>
          <p className="text-2xl md:text-3xl font-black text-red-400">{loss}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1" suppressHydrationWarning>{t('stats.winRate')}</p>
          <p className="text-2xl md:text-3xl font-black text-yellow-400">{winRate}%</p>
        </div>
        <div className={`bg-slate-900/60 rounded-xl p-4 border ${totalPips >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <p className="text-slate-400 text-xs md:text-sm mb-1" suppressHydrationWarning>{t('stats.totalPips')}</p>
          <p className={`text-2xl md:text-3xl font-black ${totalPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPips >= 0 ? '+' : ''}{totalPips}
          </p>
        </div>
      </div>

      {/* Form Input */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm mb-8">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus size={24} className="text-blue-400" /> <span suppressHydrationWarning>{t('journal.addTrade')}</span>
        </h2>

        <div className="space-y-4 md:space-y-5">
          {/* Pair Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2" suppressHydrationWarning>{t('journal.pair')}</label>
            <div className="relative">
              <button
                onClick={() => setShowPairDropdown(!showPairDropdown)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-left hover:border-blue-500 focus:border-blue-500 focus:outline-none flex items-center justify-between"
              >
                <span className="font-bold">{pair}</span>
                <span className="text-slate-400">▼</span>
              </button>

              {showPairDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {POPULAR_PAIRS.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPair(p);
                        setShowPairDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-b-0 ${
                        pair === p ? 'bg-blue-500/30 text-blue-400 font-bold' : 'text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Posisi */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2" suppressHydrationWarning>{t('journal.position')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPosisi('BUY')}
                className={`py-3 rounded-lg font-bold transition-all ${
                  posisi === 'BUY'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                }`}
              >
                🟢 BUY
              </button>
              <button
                onClick={() => setPosisi('SELL')}
                className={`py-3 rounded-lg font-bold transition-all ${
                  posisi === 'SELL'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                }`}
              >
                🔴 SELL
              </button>
            </div>
          </div>

          {/* Pip */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2" suppressHydrationWarning>
              {t('journal.pips')} (Auto-detect)
            </label>
            <input
              type="number"
              placeholder="Example: 35 (WIN) or -20 (LOSS)"
              value={pip}
              onChange={(e) => setPip(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            
            {pip && (
              <div className="mt-3 flex gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-2" suppressHydrationWarning>{t('journal.pips')} Input:</p>
                  <div className={`px-3 py-2 rounded-lg font-bold text-center ${
                    parseFloat(pip) > 0 ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                  }`}>
                    {parseFloat(pip) > 0 ? '+' : ''}{pip}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-2" suppressHydrationWarning>{t('journal.result')} (Auto):</p>
                  <div className={`px-3 py-2 rounded-lg font-bold text-center ${
                    currentHasil === 'WIN' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                  }`}>
                    {currentHasil === 'WIN' ? '✅ WIN' : '❌ LOSS'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2" suppressHydrationWarning>{t('journal.notes')} (Optional)</label>
            <textarea
              placeholder={t('journal.notes') + '...'}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={tambahTrade}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> <span suppressHydrationWarning>{t('journal.addTrade')}</span>
          </button>
        </div>
      </div>

      {/* Trade List */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6">📊 <span suppressHydrationWarning>{t('journal.title')}</span></h2>

        {trades.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg font-bold tracking-wider" suppressHydrationWarning>{t('journal.noData')}</p>
            <p className="text-slate-500 text-sm mt-2" suppressHydrationWarning>{t('journal.startTrading')}</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="bg-slate-800/50 rounded-lg p-4 md:p-5 border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-lg md:text-xl font-black text-white">{trade.pair}</p>
                    <p className="text-xs md:text-sm text-slate-400">{trade.tanggal}</p>
                  </div>
                  <button
                    onClick={() => hapusTrade(trade.id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    trade.posisi === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                  }`}>
                    {trade.posisi}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    trade.hasil === 'WIN' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                  }`}>
                    {trade.hasil}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    trade.pip > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.pip > 0 ? '+' : ''}{trade.pip} pips
                  </span>
                </div>

                {trade.catatan && (
                  <p className="text-sm text-slate-300 bg-slate-900/40 rounded p-2">
                    💭 {trade.catatan}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
