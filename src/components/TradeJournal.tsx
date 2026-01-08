'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
  // FASE 2.3 Enhanced fields
  screenshotUrl?: string;
  emotion?: 'Tenang' | 'Takut' | 'Serakah';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskPercent?: number;
  mtaCheckList?: {
    planReviewed: boolean;
    noFearTrade: boolean;
    risiBersih: boolean;
    takeProfit: boolean;
    noPanicClose: boolean;
  };
  disciplineScore?: number;
}

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [pair, setPair] = useState('XAUUSD');
  const [posisi, setPosisi] = useState<'BUY' | 'SELL'>('BUY');
  const [pip, setPip] = useState('');
  const [catatan, setCatatan] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showPairDropdown, setShowPairDropdown] = useState(false);

  // FASE 2.3: Enhanced journal form fields
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<'Tenang' | 'Takut' | 'Serakah'>('Tenang');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [riskPercent, setRiskPercent] = useState('');
  const [mtaCheckList, setMtaCheckList] = useState({
    planReviewed: false,
    noFearTrade: false,
    risiBersih: false,
    takeProfit: false,
    noPanicClose: false,
  });
  const [disciplineScore, setDisciplineScore] = useState(0);

  // Load trades from API
  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/trades', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Convert API format to display format
        const formattedTrades = data.trades.map((t: any) => ({
          id: t.id,
          pair: t.pair,
          posisi: t.position,
          hasil: t.result,
          pip: t.pips,
          tanggal: t.tradeDate.split('T')[0],
          catatan: t.notes || '',
        }));
        setTrades(formattedTrades);
      } else {
        console.error('Failed to load trades');
      }
    } catch (error) {
      console.error('Error loading trades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-determine WIN/LOSS based on pips
  const getHasil = (): 'WIN' | 'LOSS' => {
    const pipValue = parseFloat(pip);
    if (isNaN(pipValue)) return 'WIN';
    return pipValue > 0 ? 'WIN' : 'LOSS';
  };

  // FASE 2.3: Handle screenshot upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File terlalu besar. Max 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('❌ File harus berupa gambar (PNG, JPG, WebP)');
        return;
      }

      setScreenshotFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // FASE 2.3: Calculate discipline score based on MTA checklist
  const calculateDisciplineScore = (): number => {
    const checkedItems = Object.values(mtaCheckList).filter(Boolean).length;
    return Math.round((checkedItems / 5) * 100);
  };

  // FASE 2.3: Calculate risk-reward ratio
  const calculateRiskReward = (): { risk: number; reward: number; ratio: number } | null => {
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);

    if (isNaN(entry) || isNaN(sl) || isNaN(tp)) return null;

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const ratio = reward > 0 ? reward / risk : 0;

    return { risk, reward, ratio };
  };

  const tambahTrade = async () => {
    if (!pair || !pip) {
      alert(t('journal.fillPairPip'));
      return;
    }

    const pipValue = parseFloat(pip);
    if (isNaN(pipValue) || pipValue === 0) {
      alert(t('journal.invalidPip'));
      return;
    }

    // FASE 2.3: Calculate final discipline score
    const finalScore = calculateDisciplineScore();

    setSubmitting(true);
    try {
      const token = localStorage.getItem('mpt_token');
      
      // Prepare form data for file upload if screenshot exists
      let body: any = {
        pair,
        position: posisi,
        result: getHasil(),
        pips: pipValue,
        notes: catatan,
        tradeDate: new Date().toISOString(),
        // FASE 2.3: Enhanced fields
        emotion,
        entryPrice: entryPrice ? parseFloat(entryPrice) : undefined,
        stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
        riskPercent: riskPercent ? parseFloat(riskPercent) : undefined,
        mtaCheckList,
        disciplineScore: finalScore,
      };

      const requestOptions: any = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };

      // If screenshot exists, we would upload it separately (FASE 2.4)
      if (screenshotFile) {
        // For now, we'll include it as base64 for smaller files
        const reader = new FileReader();
        reader.onload = async () => {
          body.screenshotBase64 = reader.result;
          
          const response = await fetch('/api/trades', {
            ...requestOptions,
            body: JSON.stringify(body),
          });

          await handleTradeResponse(response);
        };
        reader.readAsDataURL(screenshotFile);
      } else {
        const response = await fetch('/api/trades', requestOptions);
        await handleTradeResponse(response);
      }
    } catch (error) {
      console.error('Error adding trade:', error);
      alert(t('journal.errorSaving'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTradeResponse = async (response: Response) => {
    if (response.ok) {
      // Reload trades from API
      await loadTrades();
      
      // FASE 2.4: If screenshot exists, automatically analyze it
      if (screenshotFile) {
        try {
          const token = localStorage.getItem('mpt_token');
          const formData = new FormData();
          formData.append('image', screenshotFile);
          formData.append('message', `Analyze this chart for ${pair} ${posisi} position. Entry: ${entryPrice}, SL: ${stopLoss}, TP: ${takeProfit}`);

          const chartResponse = await fetch('/api/trades/analyze-chart', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (chartResponse.ok) {
            const analysisData = await chartResponse.json();
            console.log('✅ Chart analyzed:', analysisData);
            // Could show analysis in modal or toast here
          }
        } catch (error) {
          console.error('Error analyzing chart:', error);
          // Non-blocking error - trade was saved successfully
        }
      }
      
      // Emit event to notify other components (like Dashboard)
      window.dispatchEvent(new CustomEvent('tradesUpdated'));
      
      // Reset form
      setPair('XAUUSD');
      setPip('');
      setCatatan('');
      setPosisi('BUY');
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setEmotion('Tenang');
      setEntryPrice('');
      setStopLoss('');
      setTakeProfit('');
      setRiskPercent('');
      setMtaCheckList({
        planReviewed: false,
        noFearTrade: false,
        risiBersih: false,
        takeProfit: false,
        noPanicClose: false,
      });
      
      alert('✅ Trade berhasil disimpan!');
    } else {
        const data = await response.json();
        alert('❌ ' + (data.error || 'Gagal menyimpan trade'));
      }
    } catch (error) {
      console.error('Error adding trade:', error);
      alert('❌ Terjadi kesalahan saat menyimpan trade');
    } finally {
      setSubmitting(false);
    }
  };

  const hapusTrade = async (id: string) => {
    if (!confirm('Hapus trade ini?')) return;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await loadTrades();
        // Emit event to notify Dashboard
        window.dispatchEvent(new CustomEvent('tradesUpdated'));
        alert('✅ Trade dihapus');
      } else {
        alert('❌ Gagal menghapus trade');
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const analyzeMyTrades = async () => {
    if (trades.length === 0) {
      alert('❌ Belum ada trade untuk dianalisis');
      return;
    }

    setAnalyzing(true);
    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/ai/analyze-trades', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis);
      } else {
        const data = await response.json();
        alert('❌ ' + (data.error || 'Gagal menganalisis trades'));
      }
    } catch (error) {
      console.error('Error analyzing trades:', error);
      alert('❌ Terjadi kesalahan saat menganalisis trades');
    } finally {
      setAnalyzing(false);
    }
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
    csvContent += `Initial Balance:,Rp ${customBalance.toLocaleString('id-ID')}\n`;
    csvContent += `Estimated Balance:,Rp ${(customBalance + totalPips * 150000).toLocaleString('id-ID')}\n`;
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
💎 Balance: Rp ${(customBalance + totalPips * 150000).toLocaleString('id-ID')}
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

          <div className="flex items-center gap-2">
            {/* AI Analyze Button */}
            <button
              onClick={analyzeMyTrades}
              disabled={analyzing || trades.length === 0}
              className="p-2 md:p-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-bold text-sm md:text-base"
              title={trades.length === 0 ? 'Add trades first' : 'Analyze your trading performance'}
            >
              {analyzing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span className="hidden md:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🧠</span>
                  <span className="hidden md:inline">Analyze Trades</span>
                </>
              )}
            </button>

            {/* Export Button */}
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
              type="text"
              inputMode="text"
              pattern="-?[0-9]*\.?[0-9]*"
              placeholder="Example: 35 (WIN) or -20 (LOSS)"
              value={pip}
              onChange={(e) => setPip(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              style={{ 
                WebkitTextFillColor: '#fff !important',
                color: '#fff !important',
                opacity: '1 !important'
              }}
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

          {/* FASE 2.3: Screenshot Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">📸 Screenshot Grafik (Optional)</label>
            <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
                id="screenshot-input"
              />
              <label htmlFor="screenshot-input" className="cursor-pointer">
                <div className="text-center">
                  <p className="text-slate-300 font-semibold mb-2">Klik atau drag gambar grafik di sini</p>
                  <p className="text-xs text-slate-500">Max 5MB (PNG, JPG, WebP)</p>
                </div>
              </label>
            </div>
            {screenshotPreview && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-700">
                <img src={screenshotPreview} alt="preview" className="w-full h-48 object-contain bg-slate-900" />
                <button
                  onClick={() => {
                    setScreenshotFile(null);
                    setScreenshotPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs font-bold"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {/* FASE 2.3: Emotion Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">😌 Emosi saat Trade</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Tenang', 'Takut', 'Serakah'] as const).map((em) => (
                <button
                  key={em}
                  onClick={() => setEmotion(em)}
                  className={`py-3 rounded-lg font-bold transition-all ${
                    emotion === em
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                  }`}
                >
                  {em === 'Tenang' && '😌'} {em === 'Takut' && '😨'} {em === 'Serakah' && '🤑'} {em}
                </button>
              ))}
            </div>
          </div>

          {/* FASE 2.3: Risk/Reward Fields */}
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-300 mb-4">📊 Risk / Reward Analysis</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-400">Entry Price</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="1.2000"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Stop Loss</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="1.1950"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Take Profit</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="1.2050"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Risk %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="2"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            {calculateRiskReward() && (
              <div className="mt-3 text-xs text-slate-300 space-y-1">
                <p>📍 Risk: <span className="text-red-400 font-bold">{calculateRiskReward()?.risk.toFixed(4)}</span></p>
                <p>🎯 Reward: <span className="text-green-400 font-bold">{calculateRiskReward()?.reward.toFixed(4)}</span></p>
                <p>⚖️ Ratio: <span className={`font-bold ${calculateRiskReward()!.ratio >= 2 ? 'text-green-400' : 'text-yellow-400'}`}>{calculateRiskReward()?.ratio.toFixed(2)}:1</span></p>
              </div>
            )}
          </div>

          {/* FASE 2.3: MTA Checklist */}
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-300 mb-4">✅ MTA Checklist (Moving Target Abandon)</label>
            <div className="space-y-3">
              {[
                { key: 'planReviewed', label: 'Plan reviewed sebelum entry' },
                { key: 'noFearTrade', label: 'No fear trade - strictly follow plan' },
                { key: 'risiBersih', label: 'Risi bersih per trade < 2%' },
                { key: 'takeProfit', label: 'Take profit hit atau exit plan dilakukan' },
                { key: 'noPanicClose', label: 'Tidak panic close atau revenge trade' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer hover:bg-slate-700/30 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={mtaCheckList[item.key as keyof typeof mtaCheckList]}
                    onChange={(e) =>
                      setMtaCheckList({
                        ...mtaCheckList,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border border-slate-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/30">
              <p className="text-xs text-slate-400 mb-1">Discipline Score:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-800/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      calculateDisciplineScore() >= 80
                        ? 'bg-green-500'
                        : calculateDisciplineScore() >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${calculateDisciplineScore()}%` }}
                  />
                </div>
                <span className="font-bold text-sm text-white w-12 text-right">{calculateDisciplineScore()}%</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={tambahTrade}
            disabled={submitting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin">⏳</div> Menyimpan...
              </>
            ) : (
              <>
                <Plus size={20} /> <span suppressHydrationWarning>{t('journal.addTrade')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trade List */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6">📊 <span suppressHydrationWarning>{t('journal.title')}</span></h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-slate-400">Loading trades...</p>
          </div>
        ) : trades.length === 0 ? (
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
                  {/* FASE 2.3: Show emotion if available */}
                  {trade.emotion && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-purple-500/30 text-purple-400`}>
                      {trade.emotion === 'Tenang' && '😌'} {trade.emotion === 'Takut' && '😨'} {trade.emotion === 'Serakah' && '🤑'} {trade.emotion}
                    </span>
                  )}
                  {/* FASE 2.3: Show discipline score if available */}
                  {trade.disciplineScore !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trade.disciplineScore >= 80
                        ? 'bg-green-500/30 text-green-400'
                        : trade.disciplineScore >= 60
                          ? 'bg-yellow-500/30 text-yellow-400'
                          : 'bg-red-500/30 text-red-400'
                    }`}>
                      📊 {trade.disciplineScore}%
                    </span>
                  )}
                </div>

                {/* FASE 2.3: Screenshot preview */}
                {trade.screenshotUrl && (
                  <div className="mb-3 rounded border border-slate-700 overflow-hidden">
                    <img src={trade.screenshotUrl} alt="trade chart" className="w-full h-32 object-contain bg-slate-900" />
                  </div>
                )}

                {/* FASE 2.3: Risk/Reward info if available */}
                {trade.entryPrice && trade.stopLoss && trade.takeProfit && (
                  <div className="mb-3 text-xs text-slate-400 bg-slate-900/40 rounded p-2 space-y-1">
                    <p>📍 Entry: {trade.entryPrice.toFixed(4)} | SL: {trade.stopLoss.toFixed(4)} | TP: {trade.takeProfit.toFixed(4)}</p>
                  </div>
                )}

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

      {/* AI Analysis Modal */}
      {aiAnalysis && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setAiAnalysis(null)}
        >
          <div 
            className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-purple-500/30 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                  <h2 className="text-2xl font-black text-purple-400">AI Trading Analysis</h2>
                  <p className="text-slate-400 text-sm">Powered by Claude Sonnet 4.5 - Advanced AI Analysis</p>
                </div>
              </div>
              <button
                onClick={() => setAiAnalysis(null)}
                className="text-slate-400 hover:text-white transition-colors p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="prose prose-invert prose-purple max-w-none">
                <div 
                  className="text-slate-300 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ 
                    __html: aiAnalysis
                      .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-purple-400 mt-6 mb-3">$1</h3>')
                      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-purple-300 mt-8 mb-4">$1</h2>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                      .replace(/- (.*)/g, '<li class="ml-4 text-slate-300">$1</li>')
                      .replace(/\n\n/g, '</p><p class="my-4">')
                      .replace(/^(?!<[h|l|p])(.*)$/gm, '<p>$1</p>')
                  }}
                />
              </div>
              
              {/* Close Button */}
              <div className="mt-8 pt-6 border-t border-purple-500/20 flex justify-end">
                <button
                  onClick={() => setAiAnalysis(null)}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-colors"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
