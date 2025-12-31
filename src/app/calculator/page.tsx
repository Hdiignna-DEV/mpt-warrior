'use client';
import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, TrendingDown, Copy, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface CalculationHistory {
  id: string;
  balance: number;
  risk: number;
  stopLoss: number;
  lotSize: number;
  riskAmount: number;
  timestamp: Date;
}

export default function RiskCalculator() {
  const [balance, setBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [result, setResult] = useState<any>(null);
  const [warning, setWarning] = useState<string>('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [copied, setCopied] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
      setHistory(JSON.parse(saved).map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })));
    }
  }, []);

  const calculateLotSize = () => {
    setWarning('');
    const balanceNum = parseFloat(balance);
    const riskNum = parseFloat(riskPercent);
    const slPipsNum = parseFloat(stopLossPips);

    if (!balanceNum || !riskNum || !slPipsNum || slPipsNum === 0) {
      setWarning('Please fill in all fields with valid numbers');
      setResult(null);
      return;
    }

    if (slPipsNum <= 0) {
      setWarning('Stop Loss must be greater than 0');
      return;
    }

    // Risk Amount in USD
    const riskAmount = (balanceNum * riskNum) / 100;

    // Lot Size Calculation (Standard account: 1 lot = 100,000 units)
    // For most pairs, 1 pip = $10 per standard lot
    const pipValue = 10; // USD per pip per standard lot
    const lotSize = riskAmount / (slPipsNum * pipValue);

    const potentialProfit = riskAmount; // If TP is hit with 1:1 ratio
    const profitPercent = (potentialProfit / balanceNum) * 100;

    setResult({
      riskAmount: riskAmount.toFixed(2),
      lotSize: lotSize.toFixed(3),
      potentialProfit: potentialProfit.toFixed(2),
      profitPercent: profitPercent.toFixed(2),
      rewardRisk: '1:1',
    });

    // Add to history
    const newEntry: CalculationHistory = {
      id: Date.now().toString(),
      balance: balanceNum,
      risk: riskNum,
      stopLoss: slPipsNum,
      lotSize: parseFloat(lotSize.toFixed(3)),
      riskAmount: parseFloat(riskAmount.toFixed(2)),
      timestamp: new Date(),
    };

    const newHistory = [newEntry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));

    // Risk Warning
    if (riskNum > 2) {
      setWarning('⚠️ DANGER! Risk exceeds 2%. This violates MPT guidelines. Risk more carefully.');
    } else if (riskNum > 1.5) {
      setWarning('⚡ High risk detected. Recommended risk is 1%. Proceed with caution.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-500/20 via-slate-900 to-slate-950 rounded-2xl p-6 md:p-8 border border-yellow-500/30">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Risk Calculator</h1>
            <p className="text-slate-400">Calculate the perfect lot size to protect your capital. Never risk more than 1%.</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Calculate Your Position Size</h2>
            
            <div className="space-y-6">
              {/* Balance Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-2">
                    <DollarSign size={16} className="text-yellow-400" />
                    Account Balance
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="10000"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">USD</span>
                </div>
              </div>

              {/* Risk Percentage Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-2">
                    <Percent size={16} className="text-blue-400" />
                    Risk per Trade
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(e.target.value)}
                    placeholder="1"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">%</span>
                </div>
                <p className={`text-xs mt-2 ${parseFloat(riskPercent) > 2 ? 'text-red-400' : parseFloat(riskPercent) > 1.5 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {parseFloat(riskPercent) > 2
                    ? '🔴 Exceeds safe limit (1%)'
                    : parseFloat(riskPercent) > 1.5
                    ? '🟡 Higher than recommended'
                    : '🟢 Safe risk level'}
                </p>
              </div>

              {/* Stop Loss Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-2">
                    <TrendingDown size={16} className="text-red-400" />
                    Stop Loss Distance
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stopLossPips}
                    onChange={(e) => setStopLossPips(e.target.value)}
                    placeholder="50"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Pips</span>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateLotSize}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Calculator size={20} />
                <span>Calculate Lot Size</span>
                <span className="absolute right-4 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 flex gap-4">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200 font-semibold mb-1">💡 MPT Risk Management Rule</p>
              <p className="text-xs text-blue-300/80">Never risk more than 1% of your account balance per trade. This ensures you can survive 100 consecutive losses without account wipeout.</p>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          {warning && (
            <div className={`rounded-xl p-4 border ${
              warning.includes('DANGER')
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex gap-3">
                <AlertTriangle size={20} className={warning.includes('DANGER') ? 'text-red-400' : 'text-yellow-400'} />
                <p className={`text-sm font-semibold ${warning.includes('DANGER') ? 'text-red-300' : 'text-yellow-300'}`}>
                  {warning}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/40">
                <p className="text-slate-400 text-sm mb-2 font-semibold">RECOMMENDED LOT SIZE</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-4xl font-bold text-green-400">{result.lotSize}</p>
                  <p className="text-slate-400">Lot</p>
                </div>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-full" />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-xs font-semibold mb-1">Risk Amount</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-yellow-400">${result.riskAmount}</p>
                    <button
                      onClick={() => copyToClipboard(result.riskAmount)}
                      className="p-2 hover:bg-slate-700 rounded transition-all"
                    >
                      {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} className="text-slate-400" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-xs font-semibold mb-1">Potential Profit (1:1 RR)</p>
                  <p className="text-2xl font-bold text-green-400">${result.potentialProfit}</p>
                  <p className="text-xs text-slate-500 mt-2">+{result.profitPercent}% of account</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 font-semibold text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    Safe Position Size
                  </p>
                  <p className="text-xs text-green-300/80 mt-1">Your risk is within MPT guidelines ✓</p>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 border-dashed text-center">
              <p className="text-slate-400 text-sm">Fill in all fields and click "Calculate" to see your position size</p>
            </div>
          )}
        </div>
      </div>

      {/* Calculation History */}
      {history.length > 0 && (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Calculation History</h2>
            <button
              onClick={clearHistory}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Balance</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Risk</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">SL Pips</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Lot Size</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Risk Amount</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-all">
                    <td className="py-3 px-4 text-white font-medium">${entry.balance}</td>
                    <td className="py-3 px-4 text-yellow-400">{entry.risk}%</td>
                    <td className="py-3 px-4 text-slate-300">{entry.stopLoss}</td>
                    <td className="py-3 px-4 text-green-400 font-semibold">{entry.lotSize}</td>
                    <td className="py-3 px-4 text-slate-300">${entry.riskAmount}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {entry.timestamp.toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}