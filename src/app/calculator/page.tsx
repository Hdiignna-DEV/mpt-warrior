'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Calculator, DollarSign, Percent, TrendingDown, AlertTriangle, Info, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface HasilKalkulator {
  risikoRp: number;
  lotSize: number;
  marginRequired: number;
  profitTarget: number;
  riskRewardRatio: number;
}

export default function KalkulatorRisiko() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header - Soft Glass Premium */}
        <div className="glass-premium rounded-3xl p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 bg-amber-500/20 rounded-xl">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <div className="flex-1">
              <h1 className="h1 text-amber-400">
                Kalkulator Risiko
              </h1>
              <p className="subtitle text-base mt-2 text-slate-300">Auto-Adjust Nilai Per Pip sesuai saldo Anda</p>
            </div>
          </div>
        </div>

        {/* Quick Tips - Soft Glass */}
        <div className={`rounded-2xl p-4 sm:p-5 border flex gap-3 sm:gap-4 text-sm sm:text-base animate-slideDown glass-container ${
          isOptimal 
            ? 'border-green-500/30' 
            : isDangerZone 
            ? 'border-red-500/30'
            : 'border-accent-500/30'
        }`}>
          <AlertTriangle className={`flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6 ${
            isOptimal ? 'text-green-400' : isDangerZone ? 'text-red-400' : 'text-accent-400'
          }`} />
          <div>
            <p className={`font-bold text-sm sm:text-base ${
              isOptimal ? 'text-green-300' : isDangerZone ? 'text-red-300' : 'text-accent-300'
            }`}>
              {isOptimal ? '✅ OPTIMAL' : isDangerZone ? '⚠️ DANGER' : '⚡ STANDARD'}
            </p>
            <p className={`text-xs sm:text-sm mt-1 ${
              isOptimal ? 'text-green-400/80' : isDangerZone ? 'text-red-400/80' : 'text-accent-400/80'
            }`}>
              {isOptimal 
                ? '1% adalah risiko ideal untuk trading!' 
                : isDangerZone 
                ? `${risikoValue}% terlalu tinggi!`
                : `${risikoValue}% aman untuk trading Anda!`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Main Input Card */}
            <Card 
              variant="elevated"
              className="glass-premium space-y-5 sm:space-y-6"
            >
              <h2 className="h2 text-white flex items-center gap-3">
                <span>📊</span> Konfigurasi Trade
              </h2>

              <div className="space-y-4 sm:space-y-5">
                {/* Saldo */}
                <div>
                  <label className="block caption font-semibold text-slate-300 mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <DollarSign size={16} /> Saldo Akun
                  </label>
                  <input
                    type="number"
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    placeholder="10000"
                    className="w-full bg-slate-700/40 border border-slate-600/50 rounded-lg px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 text-sm sm:text-base"
                  />
                  {saldo && (
                    <div className="mt-3 p-3 sm:p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 text-xs sm:text-sm space-y-2">
                      <p className="text-slate-400">📈 Kategori:</p>
                      <p className="font-bold text-white text-sm">
                        {kategoriSaldo.icon} {kategoriSaldo.name}
                      </p>
                      <p className="text-slate-400 text-xs">
                        💡 Nilai Per Pip: <span className="font-bold text-accent-400">${nilaiPipAuto}</span> USD
                      </p>
                    </div>
                  )}
                </div>

                {/* Risk Percent dengan Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                      <Percent size={16} /> Risiko Per Trade (%)
                    </label>
                    <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                      isOptimal ? 'bg-green-500/30 text-green-400' : isDangerZone ? 'bg-red-500/30 text-red-400' : 'bg-accent-500/30 text-accent-400'
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
                    className="w-full h-2 bg-slate-600/50 rounded-lg appearance-none cursor-pointer accent-accent-500"
                  />
                  <input
                    type="number"
                    value={risikoPersen}
                    onChange={(e) => setRisikoPersen(e.target.value)}
                    step="0.1"
                    min="0.1"
                    max="5"
                    className="w-full bg-slate-700/40 border border-slate-600/50 rounded-lg px-4 py-2.5 mt-3 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 text-center text-sm sm:text-base"
                  />
                  <p className="text-xs text-slate-400 mt-2">💡 Rekomendasi: 1% per trade (ideal)</p>
                </div>

                {/* Stop Loss & Take Profit Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stop Loss */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-wide">
                      <TrendingDown size={16} /> Stop Loss (Pips)
                    </label>
                    <input
                      type="number"
                      value={stopLossPips}
                      onChange={(e) => setStopLossPips(e.target.value)}
                      placeholder="50"
                      min="1"
                      className="w-full bg-slate-700/40 border border-slate-600/50 rounded-lg px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>

                  {/* Take Profit */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-wide">
                      📈 Take Profit (Pips)
                    </label>
                    <input
                      type="number"
                      value={takeProfitPips}
                      onChange={(e) => setTakeProfitPips(e.target.value)}
                      placeholder="100"
                      min="0"
                      className="w-full bg-slate-700/40 border border-slate-600/50 rounded-lg px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Auto Nilai Per Pip Info */}
                <Card 
                  variant="elevated"
                  className="bg-gradient-to-r from-accent-500/15 to-primary-500/15 border-accent-500/30 hover:border-accent-500/50"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Zap className="text-accent-400 flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6" />
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-accent-300 mb-1">⚡ Auto-Adjust Aktif</p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Nilai Per Pip otomatis menyesuaikan dengan saldo Anda. Tidak perlu diatur manual!
                      </p>
                      <p className="text-xs text-accent-300 mt-2 font-mono break-all">
                        Saldo: <span className="text-yellow-400">${parseFloat(saldo).toLocaleString()}</span> → 
                        Nilai Per Pip: <span className="text-yellow-400">${nilaiPipAuto}</span>
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-red-400 text-xs sm:text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Calculate Button */}
                <Button
                  onClick={hitungDanSimpan}
                  variant="accent"
                  size="lg"
                  className="w-full hover:shadow-xl hover:shadow-accent-500/40"
                >
                  🔢 Hitung & Simpan Kalkulasi
                </Button>
              </div>
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card 
                variant="elevated"
                className="bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/40 border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    ⏱️ Riwayat Kalkulasi
                  </h2>
                  <Button
                    onClick={() => setHistory([])}
                    variant="danger"
                    size="sm"
                    className="text-xs"
                  >
                    Hapus
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.map((h, idx) => (
                    <div key={idx} className="text-xs bg-slate-700/30 p-2.5 sm:p-3 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all">
                      <p className="text-slate-300 text-xs sm:text-sm">
                        <span className="text-green-400">💰 ${h.risikoRp}</span> | 
                        <span className="text-blue-400"> 📦 {h.lotSize} lot</span> | 
                        <span className="text-accent-400"> 🎯 1:{h.riskRewardRatio}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Result Section */}
          <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
            {hasil ? (
              <div className="space-y-4 sticky top-8">
                {/* Results */}
                <Card 
                  variant="elevated"
                  className="bg-gradient-to-br from-accent-500/15 to-primary-500/15 border-accent-500/30 hover:border-accent-500/50 space-y-4"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-white">✅ Analisis Realtime</h2>

                  {/* Risiko */}
                  <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                    <p className="text-slate-400 text-xs sm:text-sm mb-2 font-semibold">💸 Risiko Max Loss</p>
                    <p className="text-2xl sm:text-3xl font-black text-yellow-400">
                      ${hasil.risikoRp.toFixed(2)}
                    </p>
                  </div>

                  {/* Lot Size */}
                  <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                    <p className="text-slate-400 text-xs sm:text-sm mb-2 font-semibold">📦 Lot Size Ideal</p>
                    <p className="text-2xl sm:text-3xl font-black text-green-400">
                      {hasil.lotSize.toFixed(4)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      @ ${nilaiPipAuto}/pip
                    </p>
                  </div>

                  {/* Profit Target */}
                  {hasil.profitTarget > 0 && (
                    <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2 font-semibold">🎯 Profit Target</p>
                      <p className="text-2xl sm:text-3xl font-black text-green-400">
                        ${hasil.profitTarget.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Risk Reward Ratio */}
                  {hasil.riskRewardRatio > 0 && (
                    <div className={`rounded-lg p-3 sm:p-4 border transition-all ${
                      hasil.riskRewardRatio >= 1.5 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : hasil.riskRewardRatio >= 1 
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <p className="text-slate-400 text-xs sm:text-sm mb-2 font-semibold">⚖️ Risk/Reward</p>
                      <p className={`text-2xl sm:text-3xl font-black ${
                        hasil.riskRewardRatio >= 1.5 
                          ? 'text-green-400' 
                          : hasil.riskRewardRatio >= 1 
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        1:{hasil.riskRewardRatio}
                      </p>
                      <p className={`text-xs mt-2 font-semibold ${
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
                  <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                    <p className="text-slate-400 text-xs sm:text-sm mb-2 font-semibold">🏦 Margin Estimate</p>
                    <p className="text-2xl sm:text-3xl font-black text-blue-400">
                      ${hasil.marginRequired.toFixed(2)}
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 mt-4">
                    <p className="text-green-400 font-bold text-xs sm:text-sm mb-2 flex items-center gap-2">
                      <Info size={16} /> Pro Tips
                    </p>
                    <ul className="text-xs text-green-300 space-y-1">
                      <li>✓ Lot size sesuai risk management Anda</li>
                      <li>✓ Nilai Per Pip otomatis adjust</li>
                      <li>✓ Jangan pernah overlot!</li>
                      <li>✓ Disiplin = Profit jangka panjang</li>
                    </ul>
                  </div>
                </Card>
              </div>
            ) : (
              <Card 
                variant="elevated"
                className="bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/40 border-slate-700/50 text-center py-8 sm:py-12 sticky top-8"
              >
                <Calculator size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400 text-sm">Isi data di sebelah untuk melihat analisis realtime</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}