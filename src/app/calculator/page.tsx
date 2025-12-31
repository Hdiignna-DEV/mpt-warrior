'use client';
import { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingDown, AlertTriangle } from 'lucide-react';

interface HasilKalkulator {
  risikoRp: number;
  lotSize: number;
  marginRequired: number;
}

export default function KalkulatorRisiko() {
  const [saldo, setSaldo] = useState<string>('10000');
  const [risikoPersen, setRisikoPersen] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [nilaiPip, setNilaiPip] = useState<string>('10');
  const [hasil, setHasil] = useState<HasilKalkulator | null>(null);
  const [error, setError] = useState<string>('');

  const hitungLotSize = () => {
    setError('');
    
    const saldoNum = parseFloat(saldo);
    const risikoNum = parseFloat(risikoPersen);
    const slPipsNum = parseFloat(stopLossPips);
    const nilaiPipNum = parseFloat(nilaiPip);

    // Validasi input
    if (!saldo || !risikoPersen || !stopLossPips || !nilaiPip) {
      setError('Mohon isi semua field dengan benar!');
      setHasil(null);
      return;
    }

    if (isNaN(saldoNum) || isNaN(risikoNum) || isNaN(slPipsNum) || isNaN(nilaiPipNum)) {
      setError('Masukkan angka yang valid!');
      setHasil(null);
      return;
    }

    if (saldoNum <= 0) {
      setError('Saldo harus lebih dari 0!');
      setHasil(null);
      return;
    }

    if (risikoNum <= 0 || risikoNum > 5) {
      setError('Risiko harus antara 0-5%!');
      setHasil(null);
      return;
    }

    if (slPipsNum <= 0) {
      setError('Stop Loss harus lebih dari 0 pips!');
      setHasil(null);
      return;
    }

    if (nilaiPipNum <= 0) {
      setError('Nilai per pip harus lebih dari 0!');
      setHasil(null);
      return;
    }

    // Kalkulasi
    const risikoRp = (saldoNum * risikoNum) / 100;
    const lotSize = risikoRp / (slPipsNum * nilaiPipNum);
    const marginRequired = saldoNum * 0.02;

    setHasil({
      risikoRp: Math.round(risikoRp * 100) / 100,
      lotSize: Math.round(lotSize * 10000) / 10000,
      marginRequired: Math.round(marginRequired * 100) / 100,
    });
  };

  const risikoValue = parseFloat(risikoPersen) || 0;
  const isDangerZone = risikoValue > 2;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pt-24 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <Calculator className="text-purple-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white">Kalkulator Risiko</h1>
            <p className="text-slate-400 text-sm md:text-base">Hitung lot size dengan aman sesuai aturan 1% risiko MPT.</p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-purple-500 via-slate-700 to-transparent rounded-full"></div>
      </div>

      {/* Warning MPT Rule */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 flex gap-3">
        <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-yellow-400 text-sm md:text-base">⚠️ Aturan MPT 1% Risk</p>
          <p className="text-yellow-100 text-xs md:text-sm mt-1">Maksimal risiko per trade adalah 1% dari saldo Anda. Jangan pernah melanggar aturan ini!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-bold text-white mb-6">📊 Input Data</h2>

            <div className="space-y-5">
              {/* Saldo */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Saldo Akun (USD)
                </label>
                <input
                  type="number"
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value)}
                  placeholder="10000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">Saldo akun trading Anda saat ini</p>
              </div>

              {/* Risk Percent */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Percent size={16} /> Risiko (%)
                </label>
                <input
                  type="number"
                  value={risikoPersen}
                  onChange={(e) => setRisikoPersen(e.target.value)}
                  placeholder="1"
                  step="0.1"
                  min="0.1"
                  max="5"
                  className={`w-full bg-slate-800/50 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none ${
                    isDangerZone 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-slate-700 focus:border-purple-500'
                  }`}
                />
                {isDangerZone && (
                  <p className="text-xs text-red-400 mt-1 font-bold">
                    ⚠️ DANGER ZONE! Risiko lebih dari 2%. Kurangi sekarang!
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">Rekomendasi: 1% per trade (maksimal 2%)</p>
              </div>

              {/* Stop Loss Pips */}
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
                <p className="text-xs text-slate-400 mt-1">Jumlah pips untuk stop loss Anda</p>
              </div>

              {/* Nilai Per Pip */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Nilai Per Pip (USD)</label>
                <input
                  type="number"
                  value={nilaiPip}
                  onChange={(e) => setNilaiPip(e.target.value)}
                  placeholder="10"
                  step="0.1"
                  min="0.1"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Standar: 10 (1 lot), 1 (0.1 lot), 0.1 (0.01 lot)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={hitungLotSize}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 md:py-4 rounded-lg transition-all text-base md:text-lg active:scale-95"
              >
                🔢 Hitung Lot Size
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div>
          {hasil ? (
            <div className="bg-slate-900/60 rounded-2xl border border-purple-500/30 p-6 backdrop-blur-sm sticky top-8">
              <h2 className="text-lg font-bold text-white mb-6">✅ Hasil Kalkulasi</h2>

              <div className="space-y-4">
                {/* Risiko */}
                <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">Risiko Nominal</p>
                  <p className="text-2xl md:text-3xl font-black text-yellow-400">
                    ${hasil.risikoRp.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Uang yang akan hilang jika SL</p>
                </div>

                {/* Lot Size */}
                <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">Lot Size Rekomendasi</p>
                  <p className="text-2xl md:text-3xl font-black text-green-400">
                    {hasil.lotSize.toFixed(4)} lot
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Ukuran posisi yang aman</p>
                </div>

                {/* Margin */}
                <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">Margin Diperlukan (Est.)</p>
                  <p className="text-2xl md:text-3xl font-black text-blue-400">
                    ${hasil.marginRequired.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Margin untuk 1 lot standard</p>
                </div>

                {/* Tips */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
                  <p className="text-green-400 font-bold text-sm mb-2">💡 Tips:</p>
                  <ul className="text-xs text-green-300 space-y-1">
                    <li>✓ Selalu gunakan lot size ini</li>
                    <li>✓ Jangan pernah overlot</li>
                    <li>✓ Terapkan aturan 1% MPT</li>
                    <li>✓ Disiplin = Profit Jangka Panjang</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-6 backdrop-blur-sm text-center">
              <Calculator size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Isi data di sebelah, lalu klik tombol Hitung</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-slate-900/40 rounded-2xl border border-purple-500/20 p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">📚 Cara Menggunakan Kalkulator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-yellow-400 font-bold mb-2">1. Masukkan Saldo</p>
            <p className="text-slate-300 text-sm">Jumlah uang yang ada di akun trading Anda saat ini.</p>
          </div>
          <div>
            <p className="text-yellow-400 font-bold mb-2">2. Tentukan Risiko</p>
            <p className="text-slate-300 text-sm">Gunakan 1% risiko per trade (standar MPT). Maksimal 2%.</p>
          </div>
          <div>
            <p className="text-yellow-400 font-bold mb-2">3. Input Stop Loss</p>
            <p className="text-slate-300 text-sm">Berapa pips yang akan Anda toleransi jika trade salah.</p>
          </div>
        </div>
      </div>
    </div>
  );
}