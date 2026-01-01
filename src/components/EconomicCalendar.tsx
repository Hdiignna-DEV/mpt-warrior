'use client';

import { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Clock, Globe, TrendingUp } from 'lucide-react';

interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
  currency: string;
}

interface EconomicCalendarProps {
  onEventClick?: (event: EconomicEvent) => void;
}

export default function EconomicCalendar({ onEventClick }: EconomicCalendarProps) {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterCurrency, setFilterCurrency] = useState('all');

  useEffect(() => {
    fetchCalendarEvents();
    const interval = setInterval(fetchCalendarEvents, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const impactColors: Record<string, string> = {
    high: 'bg-red-500/20 border-red-500 text-red-400',
    medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    low: 'bg-green-500/20 border-green-500 text-green-400',
  };

  const impactEmoji: Record<string, string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const currencies = [...new Set(events.map((e) => e.currency))];

  const filteredEvents = events.filter((event) => {
    const matchesImpact = filterImpact === 'all' || event.impact === filterImpact;
    const matchesCurrency = filterCurrency === 'all' || event.currency === filterCurrency;
    return matchesImpact && matchesCurrency;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin">⏳</div>
        <p className="ml-2 text-slate-400">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold text-blue-400">Economic Calendar</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value as any)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Impact</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <select
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Currencies</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>

        <button
          onClick={fetchCalendarEvents}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No events match your filters</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick?.(event)}
              className={`bg-slate-800/50 border-2 ${impactColors[event.impact]} rounded-xl p-4 cursor-pointer transition-all hover:scale-102 hover:shadow-lg`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{impactEmoji[event.impact]}</span>
                    <h3 className="text-lg font-bold">{event.event}</h3>
                    <span className="text-sm px-2 py-1 bg-slate-700 rounded text-slate-300">
                      {event.currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-slate-400">Date & Time</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(event.date).toLocaleDateString('id-ID')} {event.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Forecast</p>
                      <p className="font-semibold">{event.forecast}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">Previous</p>
                      <p className="font-semibold">{event.previous}</p>
                    </div>

                    {event.actual && (
                      <div>
                        <p className="text-slate-400">Actual</p>
                        <p className="font-semibold text-green-400">{event.actual}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Impact</p>
                  <p className="text-lg font-bold capitalize">{event.impact}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border-2 border-blue-500 rounded-xl p-4 mt-6">
        <div className="flex gap-2 mb-2">
          <AlertCircle size={20} className="text-blue-400" />
          <h4 className="font-bold text-blue-400">💡 Trading Tips</h4>
        </div>
        <ul className="text-sm text-slate-300 space-y-1 ml-6">
          <li>• Avoid trading during high-impact economic events</li>
          <li>• High volatility may occur around event times</li>
          <li>• Monitor event forecasts vs. actual results</li>
          <li>• Major events can cause 50-100+ pip moves</li>
        </ul>
      </div>
    </div>
  );
}
