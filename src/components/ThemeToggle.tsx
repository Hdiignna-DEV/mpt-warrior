'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg transition-colors transform hover:scale-105 border bg-slate-800 text-yellow-400 border-slate-700"
        aria-label="Toggle theme"
        disabled
      >
        <Sun size={18} />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all transform hover:scale-105 border font-medium flex items-center justify-center ${
        isDark 
          ? 'bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700 hover:shadow-lg hover:shadow-yellow-500/20' 
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:shadow-lg hover:shadow-blue-500/20'
      }`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
