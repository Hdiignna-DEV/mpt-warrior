'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, TrendingUp, TrendingDown, Calendar, DollarSign, Target, MessageSquare } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  position: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  result: 'WIN' | 'LOSS';
  pips: number;
  risk: number;
  reward: number;
  date: string;
  notes: string;
  screenshot?: string;
}

export default function TradingJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'WIN' | 'LOSS'>('all');
  const [formData, setFormData] = useState<Partial<Trade>>({
    position: 'BUY',
    result: 'WIN',
  });

  // Load trades from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tradingJournal');
    if (saved) {
      setTrades(JSON.parse(saved));
    }
  }, []);

  // Save trades to localStorage
  useEffect(() => {
    localStorage.setItem('tradingJournal', JSON.stringify(trades));
  }, [trades]);

  const addTrade = () => {
    if (!formData.pair || !formData.entryPrice || !formData.exitPrice) {
      alert('Please fill in all required fields');
      return;
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      pair: formData.pair || '',
      position: formData.position || 'BUY',
      entryPrice: formData.entryPrice || 0,
      exitPrice: formData.exitPrice || 0,
      stopLoss: formData.stopLoss || 0,
      takeProfit: formData.takeProfit || 0,
      result: formData.result || 'WIN',
      pips: formData.pips || 0,
      risk: formData.risk || 0,
      reward: formData.reward || 0,
      date: formData.date || new Date().toISOString().split('T')[0],
      notes: formData.notes || '',
    };

    setTrades([newTrade, ...trades]);
    setFormData({ position: 'BUY', result: 'WIN' });
    setShowForm(false);
  };

  const deleteTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const filteredTrades = filter === 'all' ? trades : trades.filter(t => t.result === filter);

  const stats = {
    totalTrades: trades.length,
    wins: trades.filter(t => t.result === 'WIN').length,
    losses: trades.filter(t => t.result === 'LOSS').length,
    winRate: trades.length > 0 ? ((trades.filter(t => t.result === 'WIN').length / trades.length) * 100).toFixed(1) : 0,
    totalProfit: trades.reduce((sum, t) => sum + (t.result === 'WIN' ? t.pips : -Math.abs(t.pips)), 0),
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-500/20 via-slate-900 to-slate-950 rounded-2xl p-6 md:p-8 border border-purple-500/30">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
            <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trading Journal</h1>
            <p className="text-slate-400">Track every trade, learn from each one. Your journal is your teacher.</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Trades', value: stats.totalTrades, color: 'from-blue-500/20 to-cyan-500/20', icon: Target },
          { label: 'Wins', value: stats.wins, color: 'from-green-500/20 to-emerald-500/20', icon: TrendingUp },
          { label: 'Losses', value: stats.losses, color: 'from-red-500/20 to-orange-500/20', icon: TrendingDown },
          { label: 'Win Rate', value: `${stats.winRate}%`, color: 'from-yellow-500/20 to-orange-500/20', icon: Target },
          { label: 'Total Pips', value: stats.totalProfit, color: 'from-purple-500/20 to-pink-500/20', icon: DollarSign },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 border border-slate-700 hover:border-yellow-500/30 transition-all`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-yellow-400" />
                <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Log New Trade
        </button>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Log a New Trade</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pair */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Pair</label>
              <input
                type="text"
                placeholder="e.g., XAUUSD"
                value={formData.pair || ''}
                onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Position</label>
              <select
                value={formData.position || 'BUY'}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as 'BUY' | 'SELL' })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              >
                <option>BUY</option>
                <option>SELL</option>
              </select>
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Entry Price</label>
              <input
                type="number"
                step="0.00001"
                placeholder="0.00000"
                value={formData.entryPrice || ''}
                onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Exit Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Exit Price</label>
              <input
                type="number"
                step="0.00001"
                placeholder="0.00000"
                value={formData.exitPrice || ''}
                onChange={(e) => setFormData({ ...formData, exitPrice: parseFloat(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Stop Loss</label>
              <input
                type="number"
                step="0.00001"
                value={formData.stopLoss || ''}
                onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Take Profit */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Take Profit</label>
              <input
                type="number"
                step="0.00001"
                value={formData.takeProfit || ''}
                onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Result */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Result</label>
              <select
                value={formData.result || 'WIN'}
                onChange={(e) => setFormData({ ...formData, result: e.target.value as 'WIN' | 'LOSS' })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              >
                <option value="WIN">WIN</option>
                <option value="LOSS">LOSS</option>
              </select>
            </div>

            {/* Pips */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Pips</label>
              <input
                type="number"
                placeholder="0"
                value={formData.pips || ''}
                onChange={(e) => setFormData({ ...formData, pips: parseFloat(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
              <input
                type="date"
                value={formData.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Notes</label>
            <textarea
              placeholder="What did you learn? What was your mindset?"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={addTrade}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Save Trade
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      {trades.length > 0 && (
        <div className="flex gap-2">
          {(['all', 'WIN', 'LOSS'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? f === 'WIN'
                    ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                    : f === 'LOSS'
                    ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                    : 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? '📊 All Trades' : f === 'WIN' ? '✅ Wins' : '❌ Losses'} ({filter === f ? filteredTrades.length : f === 'WIN' ? stats.wins : f === 'LOSS' ? stats.losses : stats.totalTrades})
            </button>
          ))}
        </div>
      )}

      {/* Trades List */}
      {filteredTrades.length > 0 ? (
        <div className="space-y-3">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className={`p-5 rounded-xl border transition-all ${
                trade.result === 'WIN'
                  ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                  : 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-white">{trade.pair}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${trade.position === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'}`}>
                      {trade.position}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${trade.result === 'WIN' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'}`}>
                      {trade.result}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-slate-300 mb-2">
                    <div>Entry: {trade.entryPrice.toFixed(5)}</div>
                    <div>Exit: {trade.exitPrice.toFixed(5)}</div>
                    <div>Pips: {trade.pips}</div>
                  </div>
                  {trade.notes && (
                    <div className="flex items-start gap-2 text-sm text-slate-400">
                      <MessageSquare size={16} className="flex-shrink-0 mt-0.5" />
                      <p>{trade.notes}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">{trade.date}</p>
                </div>
                <button
                  onClick={() => deleteTrade(trade.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-12 text-center">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No trades logged yet. {showForm ? 'Fill the form above.' : 'Click "Log New Trade" to start tracking.'}</p>
        </div>
      )}
    </div>
  );
}