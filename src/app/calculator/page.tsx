'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Calculator, DollarSign, Percent, TrendingDown, AlertTriangle, Info, Zap } from 'lucide-react';

interface HasilKalkulator {
  risikoRp: number;
  lotSize: number;
  marginRequired: number;
  profitTarget: number;
  riskRewardRatio: number;
}

export default function KalkulatorRisiko() {
  const [saldo, setSaldo] = useState<string>('10000');
  const [risikoPersen, setRisikoPersen] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [takeProfitPips, setTakeProfitPips] = useState<string>('100');
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<HasilKalkulator[]>([]);

  // Auto-calculate Nilai Per Pip based on saldo
  const nilaiPipAuto = useMemo(() => {
    const saldoNum = parseFloat(saldo) || 0;
    
    if (saldoNum < 1000) {
      return 0.1; // Micro lot untuk saldo < $1000
    } else if (saldoNum < 10000) {
      return 1; // Mini lot untuk saldo $1000-$10000
    } else if (saldoNum < 100000) {
      return 10; // Standard lot untuk saldo $10000-$100000
    } else {
      return 100; // Multi lot untuk saldo > $100000
    }
  }, [saldo]);

  // Kategori rekomendasi
  const kategoriSaldo = useMemo(() => {
    const saldoNum = parseFloat(saldo) || 0;
    
    if (saldoNum < 1000) {
      return { name: 'Micro (Demo/Testing)', icon: '🟢', color: 'green' };
    } else if (saldoNum < 10000) {
      return { name: 'Mini (Pemula)', icon: '🟡', color: 'yellow' };
    } else if (saldoNum < 100000) {
      return { name: 'Standard (Menengah)', icon: '🟠', color: 'orange' };
    } else {
      return { name: 'Professional (Advanced)', icon: '🔴', color: 'red' };
    }
  }, [saldo]);

  const getCalculationError = useCallback((): string => {
    const saldoNum = parseFloat(saldo);
    const risikoNum = parseFloat(risikoPersen);
    const slPipsNum = parseFloat(stopLossPips);
    const nilaiPipNum = nilaiPipAuto;

    if (!saldo || !risikoPersen || !stopLossPips) {
      return '';
    }

    if (isNaN(saldoNum) || isNaN(risikoNum) || isNaN(slPipsNum) || isNaN(nilaiPipNum)) {
      return 'Masukkan angka yang valid!';
    }

    if (saldoNum <= 0) {
      return 'Saldo harus lebih dari 0!';
    }

    if (risikoNum <= 0 || risikoNum > 5) {
      return 'Risiko harus antara 0-5%!';
    }

    if (slPipsNum <= 0) {
      return 'Stop Loss harus lebih dari 0 pips!';
    }

    return '';
  }, [saldo, risikoPersen, stopLossPips, nilaiPipAuto]);

  useEffect(() => {
    setError(getCalculationError());
  }, [getCalculationError]);

  const hasil = useMemo(() => {
    const errorMsg = getCalculationError();
    if (errorMsg) return null;

    const saldoNum = parseFloat(saldo);
    const risikoNum = parseFloat(risikoPersen);
    const slPipsNum = parseFloat(stopLossPips);
    const tpPipsNum = parseFloat(takeProfitPips);
    const nilaiPipNum = nilaiPipAuto;

    if (!saldo || !risikoPersen || !stopLossPips) {
      return null;
    }

    // Kalkulasi
    const risikoRp = (saldoNum * risikoNum) / 100;
    const lotSize = risikoRp / (slPipsNum * nilaiPipNum);
    const marginRequired = saldoNum * 0.02;
    const profitTarget = tpPipsNum > 0 ? (tpPipsNum * nilaiPipNum * lotSize) : 0;
    const riskRewardRatio = tpPipsNum > 0 ? (tpPipsNum / slPipsNum) : 0;

    return {
      risikoRp: Math.round(risikoRp * 100) / 100,
      lotSize: Math.round(lotSize * 10000) / 10000,
      marginRequired: Math.round(marginRequired * 100) / 100,
      profitTarget: Math.round(profitTarget * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    };
  }, [getCalculationError, saldo, risikoPersen, stopLossPips, takeProfitPips, nilaiPipAuto]);

  const hitungDanSimpan = () => {
    if (hasil) {
      setHistory([hasil, ...history.slice(0, 9)]);
    }
  };

  const risikoValue = parseFloat(risikoPersen) || 0;
  const isDangerZone = risikoValue > 2;
  const isOptimal = risikoValue === 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-4 md:p-8 pt-20 sm:pt-24 md:pt-8">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-lg border border-purple-500/30 flex-shrink-0">
            <Calculator className="text-purple-400 w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-4xl font-black text-white truncate">Kalkulator Risiko</h1>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base truncate">Auto-Adjust Nilai Per Pip</p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-slate-700 rounded-full"></div>
      </div>

      {/* Quick Tips */}
      <div className={`bg-gradient-to-r p-3 sm:p-4 mb-6 md:mb-8 rounded-lg border flex gap-2 sm:gap-3 text-sm sm:text-base ${
        isOptimal 
          ? 'from-green-500/10 to-emerald-500/10 border-green-500/30' 
          : isDangerZone 
          ? 'from-red-500/10 to-orange-500/10 border-red-500/30'
          : 'from-yellow-500/10 to-amber-500/10 border-yellow-500/30'
      }`}>
        <AlertTriangle className={`flex-shrink-0 mt-0.5 ${
          isOptimal ? 'text-green-500' : isDangerZone ? 'text-red-500' : 'text-yellow-500'
        }`} size={18} />
        <div className="min-w-0">
          <p className={`font-bold ${
            isOptimal ? 'text-green-400' : isDangerZone ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {isOptimal ? '✅ OPTIMAL' : isDangerZone ? '⚠️ DANGER' : '⚡ STANDARD'}
          </p>
          <p className={`text-xs sm:text-sm mt-1 ${
            isOptimal ? 'text-green-200' : isDangerZone ? 'text-red-100' : 'text-yellow-100'
          }`}>
            {isOptimal 
              ? '1% adalah risiko ideal MPT!' 
              : isDangerZone 
              ? `${risikoValue}% terlalu tinggi!`
              : `${risikoValue}% aman!`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Main Input */}
          <div className="bg-slate-900/60 rounded-xl sm:rounded-2xl border border-slate-800/50 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 md:mb-6">📊 Konfigurasi Trade</h2>

            <div className="space-y-4 md:space-y-5">
              {/* Saldo */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Saldo Akun
                </label>
                <input
                  type="number"
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value)}
                  placeholder="10000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                />
                {saldo && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 text-xs sm:text-sm">
                    <p className="text-slate-400 mb-1">📈 Kategori:</p>
                    <p className="font-bold text-white">
                      {kategoriSaldo.icon} {kategoriSaldo.name}
                    </p>
                    <p className="text-slate-400 mt-1">
                      💡 Nilai Per Pip: <span className="font-bold text-yellow-400">{nilaiPipAuto}</span> USD
                    </p>
                  </div>
                )}
              </div>

              {/* Risk Percent dengan Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Percent size={16} /> Risiko Per Trade (%)
                  </label>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    isOptimal ? 'bg-green-500/30 text-green-400' : isDangerZone ? 'bg-red-500/30 text-red-400' : 'bg-yellow-500/30 text-yellow-400'
                  }`}>
                    {risikoValue}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={risikoPersen}
                  onChange={(e) => setRisikoPersen(e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <input
                  type="number"
                  value={risikoPersen}
                  onChange={(e) => setRisikoPersen(e.target.value)}
                  step="0.1"
                  min="0.1"
                  max="5"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 mt-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none text-center"
                />
                <p className="text-xs text-slate-400 mt-2">Rekomendasi: 1% per trade (ideal MPT)</p>
              </div>

              {/* Stop Loss & Take Profit Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stop Loss */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <TrendingDown size={16} /> Stop Loss (Pips)
                  </label>
                  <input
                    type="number"
                    value={stopLossPips}
                    onChange={(e) => setStopLossPips(e.target.value)}
                    placeholder="50"
                    min="1"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Take Profit */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    📈 Take Profit (Pips)
                  </label>
                  <input
                    type="number"
                    value={takeProfitPips}
                    onChange={(e) => setTakeProfitPips(e.target.value)}
                    placeholder="100"
                    min="0"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Auto Nilai Per Pip Info */}
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-start gap-3">
                  <Zap className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-purple-300 mb-1">⚡ Auto-Adjust Aktif</p>
                    <p className="text-xs text-purple-200">
                      Nilai Per Pip otomatis menyesuaikan dengan saldo Anda. Tidak perlu diatur manual!
                    </p>
                    <p className="text-xs text-purple-300 mt-2 font-mono">
                      Saldo: <span className="text-yellow-400">${parseFloat(saldo).toLocaleString()}</span> → 
                      Nilai Per Pip: <span className="text-yellow-400">${nilaiPipAuto}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={hitungDanSimpan}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 md:py-4 rounded-lg transition-all text-base md:text-lg active:scale-95 shadow-lg shadow-purple-500/30"
              >
                🔢 Hitung & Simpan Kalkulasi
              </button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  ⏱️ Riwayat Kalkulasi
                </h2>
                <button
                  onClick={() => setHistory([])}
                  className="text-xs px-3 py-1 bg-red-500/30 text-red-400 rounded hover:bg-red-500/50 transition"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.map((h, idx) => (
                  <div key={idx} className="text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    <p className="text-slate-300">
                      <span className="text-green-400">💰 ${h.risikoRp}</span> | 
                      <span className="text-blue-400"> 📦 {h.lotSize} lot</span> | 
                      <span className="text-yellow-400"> 🎯 {h.riskRewardRatio}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div>
          {hasil ? (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 rounded-2xl border border-purple-500/30 p-6 backdrop-blur-sm sticky top-8">
                <h2 className="text-lg font-bold text-white mb-6">✅ Analisis Realtime</h2>

                <div className="space-y-4">
                  {/* Risiko */}
                  <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all">
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <span>💸</span> Risiko Nominal (Max Loss)
                    </p>
                    <p className="text-2xl md:text-3xl font-black text-yellow-400">
                      ${hasil.risikoRp.toFixed(2)}
                    </p>
                  </div>

                  {/* Lot Size */}
                  <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all">
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <span>📦</span> Lot Size Ideal
                    </p>
                    <p className="text-2xl md:text-3xl font-black text-green-400">
                      {hasil.lotSize.toFixed(4)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      @ {nilaiPipAuto} USD/pip
                    </p>
                  </div>

                  {/* Profit Target */}
                  {hasil.profitTarget > 0 && (
                    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all">
                      <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                        <span>🎯</span> Profit Target (Best Case)
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-green-400">
                        ${hasil.profitTarget.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Risk Reward Ratio */}
                  {hasil.riskRewardRatio > 0 && (
                    <div className={`rounded-lg p-4 border transition-all ${
                      hasil.riskRewardRatio >= 1.5 
                        ? 'bg-green-900/30 border-green-500/30' 
                        : hasil.riskRewardRatio >= 1 
                        ? 'bg-yellow-900/30 border-yellow-500/30'
                        : 'bg-red-900/30 border-red-500/30'
                    }`}>
                      <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                        <span>⚖️</span> Risk/Reward Ratio
                      </p>
                      <p className={`text-2xl md:text-3xl font-black ${
                        hasil.riskRewardRatio >= 1.5 
                          ? 'text-green-400' 
                          : hasil.riskRewardRatio >= 1 
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        1:{hasil.riskRewardRatio}
                      </p>
                      <p className={`text-xs mt-2 ${
                        hasil.riskRewardRatio >= 1.5 
                          ? 'text-green-300' 
                          : hasil.riskRewardRatio >= 1 
                          ? 'text-yellow-300'
                          : 'text-red-300'
                      }`}>
                        {hasil.riskRewardRatio >= 1.5 
                          ? '✅ Sangat bagus!' 
                          : hasil.riskRewardRatio >= 1 
                          ? '⚡ Cukup baik'
                          : '❌ Perlu diperbaiki'}
                      </p>
                    </div>
                  )}

                  {/* Margin */}
                  <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all">
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <span>🏦</span> Margin (Estimate)
                    </p>
                    <p className="text-2xl md:text-3xl font-black text-blue-400">
                      ${hasil.marginRequired.toFixed(2)}
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
                    <p className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
                      <Info size={16} /> Pro Tips
                    </p>
                    <ul className="text-xs text-green-300 space-y-1">
                      <li>✓ Lot size sudah sesuai saldo Anda</li>
                      <li>✓ Nilai Per Pip auto-adjust</li>
                      <li>✓ Jangan pernah overlot</li>
                      <li>✓ Disiplin = Profit Jangka Panjang</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-6 backdrop-blur-sm text-center sticky top-8">
              <Calculator size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Isi data di sebelah, lalu klik tombol Hitung</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}