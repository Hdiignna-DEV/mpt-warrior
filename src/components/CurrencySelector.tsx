/**
 * Currency Selector Component
 * Toggle between USD and IDR
 */

'use client';

import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

export type Currency = 'USD' | 'IDR';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  className?: string;
}

export function CurrencySelector({ value, onChange, className = '' }: CurrencySelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DollarSign size={16} className="text-slate-400" />
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
        <button
          onClick={() => onChange('USD')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            value === 'USD'
              ? 'bg-green-500 text-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          USD
        </button>
        <button
          onClick={() => onChange('IDR')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            value === 'IDR'
              ? 'bg-green-500 text-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          IDR
        </button>
      </div>
    </div>
  );
}

/**
 * Hook to manage currency preference
 */
export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('IDR'); // Default to IDR for local users
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('mpt_currency');
    if (saved === 'USD' || saved === 'IDR') {
      setCurrency(saved);
    }
    setIsLoading(false);
  }, []);

  const updateCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('mpt_currency', newCurrency);
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: newCurrency }));
  };

  return { currency, setCurrency: updateCurrency, isLoading };
}
