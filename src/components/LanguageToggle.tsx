'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Get saved language from localStorage or browser default
    const savedLang = localStorage.getItem('mpt-language') || 'en';
    setCurrentLang(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en';
    const regionName = newLang === 'en' ? 'EN-UNITED_STATES' : 'ID-INDONESIA';
    
    // Terminal-style War Room logging
    console.log('%c>> [SYS_LOG]: INITIATING LINGUISTICS MODULE...', 'color: #f59e0b; font-family: monospace; font-weight: bold;');
    console.log('%c>> [SYS_LOG]: DECRYPTING REGION DATA...', 'color: #10b981; font-family: monospace;');
    
    // Glitch effect
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      console.log(`%c>> [SYS_LOG]: REGION SYNCED TO [${regionName}]. WELCOME, WARRIOR. 🎯`, 'color: #10b981; font-weight: bold; font-family: monospace; font-size: 12px;');
    }, 300);
    
    // Change language
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('mpt-language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-slate-800/50 border border-amber-400/30 hover:border-amber-400 transition-all duration-300 hover:scale-105 group"
      aria-label="Language Toggle"
      title={`Current: ${currentLang === 'en' ? 'English' : 'Bahasa Indonesia'}`}
    >
      {/* Glitch overlay effect */}
      {isGlitching && (
        <div className="absolute inset-0 bg-amber-500/20 animate-pulse rounded-lg" />
      )}
      
      {/* Globe icon with rotation */}
      <Globe 
        className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${
          isGlitching ? 'rotate-180' : ''
        } group-hover:rotate-12`}
      />
      
      {/* Language code with glitch effect */}
      <span 
        className={`text-sm font-bold tracking-widest text-amber-400 transition-all duration-200 ${
          isGlitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {currentLang.toUpperCase()}
      </span>
      
      {/* Indicator dot */}
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    </button>
  );
}
