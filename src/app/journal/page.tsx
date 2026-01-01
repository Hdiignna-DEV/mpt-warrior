'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Download, Share2 } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

export default function JurnalTrading() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pair, setPair] = useState('');
  const [posisi, setPosisi] = useState<'BUY' | 'SELL'>('BUY');
  const [hasil, setHasil] = useState<'WIN' | 'LOSS'>('WIN');
  const [pip, setPip] = useState('');
  const [catatan, setCatatan] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('trades');
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  // Save ke localStorage
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  const tambahTrade = () => {
    if (!pair || !pip) {
      alert('Isi Pair dan Pip terlebih dahulu!');
      return;
    }

    const tradeBaru: Trade = {
      id: Date.now().toString(),
      pair,
      posisi,
      hasil,
      pip: parseFloat(pip),
      tanggal: new Date().toISOString().split('T')[0],
      catatan,
    };

    setTrades([tradeBaru, ...trades]);
    setPair('');
    setPip('');
    setCatatan('');
    setHasil('WIN');
  };

  const hapusTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  // Calculate statistics
  const totalTrade = trades.length;
  const win = trades.filter((t) => t.hasil === 'WIN').length;
  const loss = totalTrade - win;
  const winRate = totalTrade > 0 ? Math.round((win / totalTrade) * 100) : 0;
  const totalPips = trades.reduce((acc, t) => acc + t.pip, 0);
  const estimatedBalance = 10000 + (totalPips * 10);

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

  const avgPipsPerWin = win > 0 
    ? Math.round(trades.filter(t => t.hasil === 'WIN').reduce((sum, t) => sum + t.pip, 0) / win * 100) / 100
    : 0;

  const avgPipsPerLoss = loss > 0
    ? Math.round(trades.filter(t => t.hasil === 'LOSS').reduce((sum, t) => sum + Math.abs(t.pip), 0) / loss * 100) / 100
    : 0;

  // Export to Enhanced CSV
  const exportToEnhancedCSV = () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-export!');
      return;
    }

    let csvContent = '';

    // HEADER SECTION
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'MPT WARRIOR HUB - TRADING JOURNAL REPORT\n';
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += `Export Date:,${new Date().toLocaleString('id-ID')}\n`;
    csvContent += '\n';

    // SUMMARY STATISTICS
    csvContent += '─────────────────────────────────────────────────────────────\n';
    csvContent += 'SUMMARY STATISTICS\n';
    csvContent += '─────────────────────────────────────────────────────────────\n';
    csvContent += `Total Trades:,${totalTrade}\n`;
    csvContent += `Total WIN:,${win}\n`;
    csvContent += `Total LOSS:,${loss}\n`;
    csvContent += `Win Rate:,${winRate}%\n`;
    csvContent += `Total Pips:,${totalPips >= 0 ? '+' : ''}${totalPips}\n`;
    csvContent += `Initial Balance:,$10,000\n`;
    csvContent += `Estimated Balance:,$${estimatedBalance.toLocaleString('en-US')}\n`;
    csvContent += `Profit/Loss:,$${((estimatedBalance - 10000) * 10).toLocaleString('en-US')}\n`;
    csvContent += '\n';

    // ADVANCED METRICS
    csvContent += '─────────────────────────────────────────────────────────────\n';
    csvContent += 'ADVANCED METRICS\n';
    csvContent += '─────────────────────────────────────────────────────────────\n';
    csvContent += `Best Streak:,${calculateBestStreak()} Wins\n`;
    csvContent += `Average Pips Per Win:,+${avgPipsPerWin}\n`;
    csvContent += `Average Pips Per Loss:,-${avgPipsPerLoss}\n`;
    csvContent += `Risk/Reward Ratio:,${(avgPipsPerWin / avgPipsPerLoss).toFixed(2)}\n`;
    csvContent += '\n';

    // TRADES DETAIL
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'DETAILED TRADES\n';
    csvContent += '═══════════════════════════════════════════════════════════════\n';
    csvContent += 'Pair,Position,Result,Pips,Date,Notes\n';

    // Add each trade
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

    // Create and download
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

  // Export to Simple CSV (basic format)
  const exportToSimpleCSV = () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-export!');
      return;
    }

    const headers = ['Pair', 'Posisi', 'Hasil', 'Pip', 'Tanggal', 'Catatan'];
    const rows = trades.map(trade => [
      trade.pair,
      trade.posisi,
      trade.hasil,
      trade.pip,
      trade.tanggal,
      `"${trade.catatan.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `MPT-Journal-Simple_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setShowExportOptions(false);
  };

  // Export to Excel-style CSV
  const exportToExcelCSV = () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-export!');
      return;
    }

    let csvContent = '';

    // Title
    csvContent += ',MPT WARRIOR HUB - TRADING JOURNAL,\n';
    csvContent += ',,\n';

    // Stats Section
    csvContent += 'STATISTICS,\n';
    csvContent += `Total Trades,${totalTrade}\n`;
    csvContent += `WIN,${win}\n`;
    csvContent += `LOSS,${loss}\n`;
    csvContent += `Win Rate,${winRate}%\n`;
    csvContent += `Total Pips,${totalPips}\n`;
    csvContent += `Balance,$${estimatedBalance.toLocaleString('en-US')}\n`;
    csvContent += ',,\n';

    // Trades Table
    csvContent += 'DETAILED TRADES\n';
    csvContent += 'No.,Pair,Position,Result,Pips,Date,Notes\n';

    trades.forEach((trade, index) => {
      const pipsDisplay = trade.pip > 0 ? `+${trade.pip}` : `${trade.pip}`;
      const notes = trade.catatan ? `"${trade.catatan.replace(/"/g, '""')}"` : '';
      csvContent += `${index + 1},${trade.pair},${trade.posisi},${trade.hasil},${pipsDisplay},${trade.tanggal},${notes}\n`;
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `MPT-Journal-Excel_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setShowExportOptions(false);
  };

  const exportToJSON = () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-export!');
      return;
    }

    const data = {
      exportDate: new Date().toISOString(),
      statistics: {
        totalTrade,
        win,
        loss,
        winRate,
        totalPips,
        estimatedBalance,
        bestStreak: calculateBestStreak(),
        avgPipsPerWin,
        avgPipsPerLoss,
      },
      trades: trades,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `MPT-Journal_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setShowExportOptions(false);
  };

  const shareToClipboard = async () => {
    if (trades.length === 0) {
      alert('Tidak ada trade untuk di-share!');
      return;
    }

    const shareText = `📊 MPT WARRIOR TRADING STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Total Trades: ${totalTrade}
✅ WIN: ${win} | ❌ LOSS: ${loss}
🎯 Win Rate: ${winRate}%
💰 Total Pips: ${totalPips >= 0 ? '+' : ''}${totalPips}
💎 Balance: $${estimatedBalance.toLocaleString('en-US')}
🏆 Best Streak: ${calculateBestStreak()} Wins
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 https://mpt-warrior.vercel.app`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('📋 Stats berhasil dicopy! Siap untuk di-share.');
      setShowExportOptions(false);
    } catch {
      alert('Gagal copy ke clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pt-24 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between gap-3 md:gap-4 mb-4">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <BookOpen className="text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-black text-white">Jurnal Trading</h1>
              <p className="text-slate-400 text-sm md:text-base">Catat setiap trade Anda untuk tracking progress.</p>
            </div>
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-bold text-sm md:text-base"
            >
              <Download size={20} />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* Export Menu - ENHANCED */}
            {showExportOptions && (
              <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 w-56">
                <div className="p-3 border-b border-slate-700 text-sm font-bold text-slate-300">
                  📊 CSV Formats
                </div>

                <button
                  onClick={exportToEnhancedCSV}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-700 text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-green-400">📈 Enhanced CSV</span>
                  <span className="text-xs text-slate-400">Dengan statistics & summary</span>
                </button>

                <button
                  onClick={exportToExcelCSV}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-700 text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-blue-400">📊 Excel Format</span>
                  <span className="text-xs text-slate-400">Optimal untuk Excel/Sheets</span>
                </button>

                <button
                  onClick={exportToSimpleCSV}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-700 text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-yellow-400">📋 Simple CSV</span>
                  <span className="text-xs text-slate-400">Plain text format</span>
                </button>

                <div className="p-3 border-b border-slate-700 text-sm font-bold text-slate-300">
                  🎯 Other Formats
                </div>

                <button
                  onClick={exportToJSON}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-700 text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-purple-400">📁 Export to JSON</span>
                  <span className="text-xs text-slate-400">Backup & data transfer</span>
                </button>

                <button
                  onClick={shareToClipboard}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-sm flex flex-col gap-1"
                >
                  <span className="font-bold text-red-400 flex items-center gap-2">
                    <Share2 size={16} /> Share Stats
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
          <p className="text-slate-400 text-xs md:text-sm mb-1">Total</p>
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
          <p className="text-slate-400 text-xs md:text-sm mb-1">Win Rate</p>
          <p className="text-2xl md:text-3xl font-black text-yellow-400">{winRate}%</p>
        </div>
        <div className={`bg-slate-900/60 rounded-xl p-4 border ${totalPips >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <p className="text-slate-400 text-xs md:text-sm mb-1">Total Pips</p>
          <p className={`text-2xl md:text-3xl font-black ${totalPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPips >= 0 ? '+' : ''}{totalPips}
          </p>
        </div>
      </div>

      {/* Form Input */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm mb-8">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus size={24} className="text-blue-400" /> Input Trade Baru
        </h2>

        <div className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Pair</label>
            <input
              type="text"
              placeholder="Contoh: XAUUSD, EURUSD"
              value={pair}
              onChange={(e) => setPair(e.target.value.toUpperCase())}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Posisi</label>
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

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Hasil</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasil('WIN')}
                className={`py-3 rounded-lg font-bold transition-all ${
                  hasil === 'WIN'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                }`}
              >
                ✅ WIN
              </button>
              <button
                onClick={() => setHasil('LOSS')}
                className={`py-3 rounded-lg font-bold transition-all ${
                  hasil === 'LOSS'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                }`}
              >
                ❌ LOSS
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Pip</label>
            <input
              type="number"
              placeholder="Contoh: 35, -20"
              value={pip}
              onChange={(e) => setPip(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Catatan (Opsional)</label>
            <textarea
              placeholder="Tulis catatan trade Anda di sini..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={tambahTrade}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Tambah Trade
          </button>
        </div>
      </div>

      {/* Daftar Trade */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6">📊 Riwayat Trade</h2>

        {trades.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">Belum ada trade. Mulai input trade Anda!</p>
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