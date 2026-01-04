'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme dari localStorage
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || savedTheme === null;
    setIsDark(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    const body = document.body;
    
    if (dark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      // Force background change
      body.style.background = 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)';
      body.style.color = '#F8FAFC';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      // Force background change
      body.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 50%, #E2E8F0 100%)';
      body.style.color = '#1E293B';
    }
    
    console.log('✅ Theme applied:', dark ? 'DARK' : 'LIGHT');
    console.log('📋 HTML classes:', html.className);
    console.log('🎨 Body background:', body.style.background);
    
    // Trigger re-render of all components
    window.dispatchEvent(new Event('themechange'));
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    applyTheme(newIsDark);
    console.log('Toggled to:', newIsDark ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-12 h-12 rounded-xl transition-all duration-500 transform hover:scale-105 
        border backdrop-blur-lg group overflow-hidden shadow-lg
        ${
          isDark
            ? 'bg-slate-800/90 text-amber-400 border-slate-700/80 hover:border-amber-500/50 shadow-amber-500/20'
            : 'bg-white/90 text-amber-600 border-slate-200/80 hover:border-amber-400/50 shadow-amber-600/20'
        }
      `}
      aria-label={isDark ? 'Switch to Day Mission (Light Mode)' : 'Switch to Night Mission (Dark Mode)'}
      title={isDark ? '☀️ Day Mission' : '🌙 Night Mission'}
    >
      {/* Warrior Glow Effect */}
      <div
        className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-br ${
          isDark ? 'from-amber-500/20 to-orange-500/10' : 'from-amber-400/20 to-orange-400/10'
        }
      `}
      />

      {/* Sun Icon - Day Mission */}
      <div
        className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
      `}
      >
        <Sun className="w-5 h-5 drop-shadow-lg" strokeWidth={2.5} />
      </div>

      {/* Moon Icon - Night Mission */}
      <div
        className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
      `}
      >
        <Moon className="w-5 h-5 drop-shadow-lg" strokeWidth={2.5} />
      </div>
    </button>
  );
}
