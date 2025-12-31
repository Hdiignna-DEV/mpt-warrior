'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'MENANG' | 'KALAH';
  pip: number;
  tanggal: string;
  catatan: string;
}

export default function JurnalTrading() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pair, setPair] = useState('');
  const [posisi, setPosisi] = useState<'BUY' | 'SELL'>('BUY');
  const [hasil, setHasil] = useState<'MENANG' | 'KALAH'>('MENANG');
  const [pip, setPip] = useState('');
  const [catatan, setCatatan] = useState('');

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
    setHasil('MENANG');
  };

  const hapusTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  const totalTrade = trades.length;
  const menang = trades.filter((t) => t.hasil === 'MENANG').length;
  const kalah = totalTrade - menang;
  const winRate = totalTrade > 0 ? Math.round((menang / totalTrade) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pt-24 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <BookOpen className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white">Jurnal Trading</h1>
            <p className="text-slate-400 text-sm md:text-base">Catat setiap trade Anda untuk tracking progress.</p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-500 via-slate-700 to-transparent rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/50">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Total Trade</p>
          <p className="text-2xl md:text-3xl font-black text-white">{totalTrade}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-green-500/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Menang</p>
          <p className="text-2xl md:text-3xl font-black text-green-400">{menang}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-red-500/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Kalah</p>
          <p className="text-2xl md:text-3xl font-black text-red-400">{kalah}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/30">
          <p className="text-slate-400 text-xs md:text-sm mb-1">Win Rate</p>
          <p className="text-2xl md:text-3xl font-black text-yellow-400">{winRate}%</p>
        </div>
      </div>

      {/* Form Input */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm mb-8">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus size={24} className="text-blue-400" /> Input Trade Baru
        </h2>

        <div className="space-y-4 md:space-y-5">
          {/* Pair */}
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

          {/* Posisi */}
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

          {/* Hasil */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Hasil</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasil('MENANG')}
                className={`py-3 rounded-lg font-bold transition-all ${
                  hasil === 'MENANG'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                }`}
              >
                ✅ MENANG
              </button>
              <button
                onClick={() => setHasil('KALAH')}
                className={`py-3 rounded-lg font-bold transition-all ${
                  hasil === 'KALAH'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                }`}
              >
                ❌ KALAH
              </button>
            </div>
          </div>

          {/* Pip */}
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

          {/* Catatan */}
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

          {/* Submit Button */}
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
                    trade.hasil === 'MENANG' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
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