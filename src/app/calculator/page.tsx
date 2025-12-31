'use client';
import { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingDown } from 'lucide-react';

export default function RiskCalculator() {
  const [balance, setBalance] = useState<string>('1000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('30');
  const [lotSize, setLotSize] = useState<number | null>(null);

  const calculateLotSize = () => {
    const balanceNum = parseFloat(balance);
    const riskNum = parseFloat(riskPercent);
    const slPipsNum = parseFloat(stopLossPips);

    if (!balanceNum || !riskNum || !slPipsNum || slPipsNum === 0) {
      alert('⚠️ Please fill all fields with valid numbers');
      return;
    }

    // Formula: Lot Size = (Balance × Risk%) / (SL Pips × Pip Value)
    // Pip Value untuk 1 lot standard = $10 (untuk pair dengan USD sebagai quote currency)
    const riskAmount = (balanceNum * riskNum) / 100;
    const pipValue = 10; // Standard lot pip value
    const calculatedLot = riskAmount / (slPipsNum * pipValue);

    setLotSize(parseFloat(calculatedLot.toFixed(2)));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-yellow-500 mb-2 flex items-center gap-3">
          <Calculator size={32} />
          Risk Calculator
        </h1>
        <p className="text-slate-400">
          Calculate optimal lot size based on your risk management rules.
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="space-y-6">
          {/* Balance Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <DollarSign size={16} className="text-green-500" />
              Account Balance (USD)
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="1000"
            />
          </div>

          {/* Risk Percent Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Percent size={16} className="text-yellow-500" />
              Risk Per Trade (%)
            </label>
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              step="0.1"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Recommended: 1-2% per trade
            </p>
          </div>

          {/* Stop Loss Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <TrendingDown size={16} className="text-red-500" />
              Stop Loss (Pips)
            </label>
            <input
              type="number"
              value={stopLossPips}
              onChange={(e) => setStopLossPips(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="30"
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateLotSize}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Calculate Lot Size
          </button>
        </div>

        {/* Result */}
        {lotSize !== null && (
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Recommended Lot Size:</p>
            <p className="text-4xl font-bold text-yellow-500">{lotSize} Lots</p>
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-1">
              <p className="text-sm text-slate-400">
                Risk Amount: <span className="text-white font-medium">${((parseFloat(balance) * parseFloat(riskPercent)) / 100).toFixed(2)}</span>
              </p>
              <p className="text-sm text-slate-400">
                Per Pip Value: <span className="text-white font-medium">${(lotSize * 10).toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-500 mb-3">
          ⚠️ Risk Management Rules
        </h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Never risk more than 1-2% of your account per trade</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Always set a stop loss before entering a trade</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>This calculator assumes standard lot pip value of $10 USD</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Adjust lot size based on your broker's requirements</span>
          </li>
        </ul>
      </div>
    </div>
  );
}