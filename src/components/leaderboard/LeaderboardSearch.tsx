'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

type Period = 'all' | 'weekly' | 'monthly';

interface LeaderboardSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (period: Period) => void;
  defaultPeriod?: Period;
}

export function LeaderboardSearch({ onSearch, onFilterChange, defaultPeriod = 'all' }: LeaderboardSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState<Period>(defaultPeriod);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    onFilterChange(newPeriod);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search warrior name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Period:</span>
        </div>
        
        {[
          { label: 'All Time', value: 'all' as Period },
          { label: 'Monthly', value: 'monthly' as Period },
          { label: 'Weekly', value: 'weekly' as Period }
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${period === value
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {(searchQuery || period !== 'all') && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchQuery('');
              onSearch('');
            }}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            ✕ Clear search
          </button>
          {period !== 'all' && (
            <button
              onClick={() => {
                setPeriod('all');
                onFilterChange('all');
              }}
              className="text-xs text-gray-400 hover:text-gray-300"
            >
              ✕ Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
