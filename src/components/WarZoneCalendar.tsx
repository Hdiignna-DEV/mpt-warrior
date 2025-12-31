'use client';
import { useState, useEffect } from 'react';
import { Siren, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface NewsEvent {
  time: string;
  currency: string;
  event: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function WarZoneCalendar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data - Nanti bisa integrate dengan API real calendar (ForexFactory, Investing.com)
  const todayEvents: NewsEvent[] = [
    { time: '08:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'HIGH' },
    { time: '14:00', currency: 'EUR', event: 'ECB Interest Rate Decision', impact: 'HIGH' },
    { time: '15:30', currency: 'USD', event: 'Fed Chair Powell Speech', impact: 'HIGH' },
    { time: '20:00', currency: 'GBP', event: 'BOE Governor Speech', impact: 'MEDIUM' },
  ];

  const highImpactEvents = todayEvents.filter(e => e.impact === 'HIGH');
  const nextEvent = todayEvents.find(e => {
    const eventTime = new Date();
    const [hours, minutes] = e.time.split(':');
    eventTime.setHours(parseInt(hours), parseInt(minutes), 0);
    return eventTime > currentTime;
  });

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 hover:border-yellow-500 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-3">
            <Siren size={20} className="text-red-500 animate-pulse" />
            <div className="text-left">
              <p className="text-xs text-slate-400">WAR ZONE ALERT</p>
              <p className="text-sm font-bold text-yellow-500">
                {highImpactEvents.length} High Impact News Today
              </p>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Siren size={20} className="text-red-500 animate-pulse" />
            <h3 className="font-bold text-red-500">ZONA PERANG</h3>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Economic Events - High Volatility Expected
        </p>
      </div>

      {/* Current Time */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400">Server Time:</span>
        </div>
        <span className="font-mono text-lg font-bold text-yellow-500">
          {formatCurrentTime()}
        </span>
      </div>

      {/* Next Event Alert */}
      {nextEvent && (
        <div className="bg-red-500/10 border-b border-red-500/30 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-red-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 mb-1">NEXT HIGH IMPACT:</p>
              <p className="text-sm font-bold text-white">
                {nextEvent.time} - {nextEvent.currency} - {nextEvent.event}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {todayEvents.map((event, idx) => {
          const isPast = () => {
            const eventTime = new Date();
            const [hours, minutes] = event.time.split(':');
            eventTime.setHours(parseInt(hours), parseInt(minutes), 0);
            return eventTime < currentTime;
          };

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isPast()
                  ? 'bg-slate-800/50 border-slate-800 opacity-50'
                  : event.impact === 'HIGH'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  event.impact === 'HIGH'
                    ? 'bg-red-500 animate-pulse'
                    : event.impact === 'MEDIUM'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-yellow-500">
                    {event.time}
                  </span>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
                    {event.currency}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      event.impact === 'HIGH'
                        ? 'bg-red-500/20 text-red-500'
                        : event.impact === 'MEDIUM'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-green-500/20 text-green-500'
                    }`}
                  >
                    {event.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{event.event}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Footer */}
      <div className="bg-slate-950 border-t border-slate-800 p-3">
        <p className="text-xs text-slate-400 text-center">
          ⚠️ <strong className="text-yellow-500">NO PLAN, NO TRADE</strong> - Stay away during high impact news
        </p>
      </div>
    </div>
  );
}