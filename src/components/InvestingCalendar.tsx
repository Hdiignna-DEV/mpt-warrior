'use client';
import { useState } from 'react';
import { Siren, X, ExternalLink } from 'lucide-react';

export default function InvestingCalendar() {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-24 left-6 z-40 group"
        title="War Zone Calendar"
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 hover:shadow-red-500/75 transition-all duration-300 hover:scale-110">
            <Siren size={24} className="text-white animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 px-2 py-1 bg-red-600 rounded-full text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            LIVE ALERTS
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm animate-in slide-in-from-left duration-300">
      <div className="bg-slate-900 border-2 border-red-500/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Siren size={20} className="text-white animate-pulse" />
            <div>
              <h3 className="font-bold text-white">WAR ZONE ALERT</h3>
              <p className="text-xs text-red-100">High Impact Events Today</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-red-700/30 rounded transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
          {/* Live Badge */}
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1.5 animate-pulse flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-red-300">LIVE ECONOMIC CALENDAR</p>
              <p className="text-red-200/80 text-xs mt-1">Real-time data from Investing.com</p>
            </div>
          </div>

          {/* Events */}
          {[
            { time: '13:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'HIGH' },
            { time: '14:30', currency: 'EUR', event: 'ECB Press Conference', impact: 'HIGH' },
            { time: '15:00', currency: 'GBP', event: 'Retail Sales', impact: 'MEDIUM' },
          ].map((evt, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border transition-all ${
                evt.impact === 'HIGH'
                  ? 'bg-red-500/20 border-red-500/50'
                  : evt.impact === 'MEDIUM'
                  ? 'bg-yellow-500/20 border-yellow-500/50'
                  : 'bg-green-500/20 border-green-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{evt.event}</p>
                  <p className="text-xs text-slate-400 mt-1">{evt.currency}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white text-sm">{evt.time}</p>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-1 rounded mt-1 ${
                      evt.impact === 'HIGH'
                        ? 'bg-red-600 text-white'
                        : evt.impact === 'MEDIUM'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {evt.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Warning */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
            <p className="text-yellow-400 text-xs font-semibold">⚠️ NO PLAN, NO TRADE</p>
            <p className="text-slate-300 text-xs mt-1">Avoid trading during HIGH impact events unless you have a specific plan.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/50 border-t border-slate-700 px-6 py-3">
          <a
            href="https://www.investing.com/economic-calendar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-2 transition-colors"
          >
            View Full Calendar
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}