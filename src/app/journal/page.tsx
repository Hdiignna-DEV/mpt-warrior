'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  position: 'BUY' | 'SELL';
  result: 'WIN' | 'LOSS';
  pips: number;
  date: string;
  notes: string;
}

export default function TradingJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pair, setPair] = useState('XAUUSD');
  const [position, setPosition] = useState<'BUY' | 'SELL'>('BUY');
  const [result, setResult] = useState<'WIN' | 'LOSS'>('WIN');
  const [pips, setPips] = useState('');
  const [notes, setNotes] = useState('');

  // Load trades from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mpt-trades');
    if (saved) {
      setTrades(JSON.parse(saved));
    }
  }, []);

  // Save trades to localStorage whenever trades change
  useEffect(() => {
    if (trades.length > 0) {
      localStorage.setItem('mpt-trades', JSON.stringify(trades));
    }
  }, [trades]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pips || parseFloat(pips) === 0) {
      alert('⚠️ Please enter pips value');
      return;
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      pair,
      position,
      result,
      pips: parseFloat(pips),
      date: new Date().toISOString().split('T')[0],
      notes,
    };

    setTrades([newTrade, ...trades]);
    
    // Reset form
    setPair('XAUUSD');
    setPosition('BUY');
    setResult('WIN');
    setPips('');
    setNotes('');
  };

  const deleteTrade = (id: string) => {
    if (confirm('Delete this trade?')) {
      const updated = trades.filter(t => t.id !== id);
      setTrades(updated);
      localStorage.setItem('mpt-trades', JSON.stringify(updated));
    }
  };

  const stats = {
    total: trades.length,
    wins: trades.filter(t => t.result === 'WIN').length,
    losses: trades.filter(t => t.result === 'LOSS').length,
    winRate: trades.length > 0 
      ? ((trades.filter(t => t.result === 'WIN').length / trades.length) * 100).toFixed(1)
      : '0',
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-yellow-500 mb-2 flex items-center gap-3">
          <BookOpen size={32} />
          Trading Journal
        </h1>
        <p className="text-slate-400">
          Log every trade. Learn from your wins and losses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total Trades</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-green-500">{stats.winRate}%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Wins</p>
          <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Losses</p>
          <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
        </div>
      </div>

      {/* Add Trade Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
          <Plus size={20} />
          Log New Trade
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pair */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Currency Pair
              </label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
              >
                <option>XAUUSD</option>
                <option>EURUSD</option>
                <option>GBPUSD</option>
                <option>USDJPY</option>
                <option>AUDUSD</option>
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosition('BUY')}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    position === 'BUY'
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-400'
                  }`}
                >
                  <TrendingUp className="inline mr-1" size={16} />
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('SELL')}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    position === 'SELL'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-400'
                  }`}
                >
                  <TrendingDown className="inline mr-1" size={16} />
                  SELL
                </button>
              </div>
            </div>

            {/* Result */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Result
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResult('WIN')}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    result === 'WIN'
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-400'
                  }`}
                >
                  ✅ WIN
                </button>
                <button
                  type="button"
                  onClick={() => setResult('LOSS')}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    result === 'LOSS'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-400'
                  }`}
                >
                  ❌ LOSS
                </button>
              </div>
            </div>

            {/* Pips */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pips (+ or -)
              </label>
              <input
                type="number"
                value={pips}
                onChange={(e) => setPips(e.target.value)}
                step="0.1"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
                placeholder="35.5"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Why did you take this trade? What did you learn?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 rounded-lg transition-colors"
          >
            Log Trade
          </button>
        </form>
      </div>

      {/* Trades History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-yellow-500 mb-6">
          📊 Trade History
        </h2>
        
        {trades.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No trades logged yet. Start logging your trades above!
          </p>
        ) : (
          <div className="space-y-3">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg">{trade.pair}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.position === 'BUY'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {trade.position}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.result === 'WIN'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {trade.result}
                      </span>
                      <span className={`font-bold ${
                        trade.pips > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {trade.pips > 0 ? '+' : ''}{trade.pips} pips
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{trade.date}</p>
                    {trade.notes && (
                      <p className="text-slate-300 text-sm mt-2">{trade.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTrade(trade.id)}
                    className="text-red-500 hover:text-red-400 p-2"
                    title="Delete trade"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}