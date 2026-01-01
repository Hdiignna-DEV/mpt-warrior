'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const current = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className={`p-2 rounded-lg transition-colors transform hover:scale-105 border ${current === 'dark' ? 'bg-slate-800 text-yellow-400 border-slate-700' : 'bg-white text-slate-700 border-slate-200'}`}
      aria-label="Toggle theme"
      aria-pressed={current === 'dark'}
      title={current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {current === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
