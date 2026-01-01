'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calculator, 
  Bot,
  Menu,
  X,
  BarChart3,
  Trophy,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const menuItems = [
  { href: '/', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/journal', label: 'Jurnal Trading', icon: BookOpen },
  { href: '/calculator', label: 'Kalkulasi Risk', icon: Calculator },
  { href: '/ai-mentor', label: 'Mentor AI', icon: Bot },
  { href: '/achievements', label: 'Pencapaian', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-60 p-2.5 bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-lg text-white transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/40 hover:scale-110 active:scale-95"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="sm:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-md"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed sm:static inset-y-0 left-0 z-60
          w-64 bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-slate-950/98 border-r border-slate-700/60
          flex flex-col transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full sm:translate-x-0'}
          h-screen overflow-y-auto
          dark:from-slate-900/98 dark:via-slate-900/95 dark:to-slate-950/98
        `}
      >
        {/* Logo/Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700/50 flex flex-col items-center flex-shrink-0 bg-gradient-to-b from-slate-900/90 via-slate-850/70 to-slate-900/50 dark:from-slate-900/90 dark:via-slate-850/70 dark:to-slate-900/50 backdrop-blur-xl hover:border-yellow-500/30 transition-all duration-300">
          <div className="w-24 sm:w-32 h-24 sm:h-32 mb-2 sm:mb-3 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <Image
              src="/mpt-logo.png"
              alt="MPT Logo"
              fill
              className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              priority
            />
          </div>
          <h1 className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center group-hover:scale-105 transition-transform duration-300">
            MINDSET PLAN TRADER
          </h1>
          <p className="text-xs text-slate-500 mt-2 text-center font-bold uppercase tracking-widest">Warrior Trading Hub</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  group relative flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl
                  transition-all duration-300 text-sm sm:text-base font-semibold
                  overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold shadow-xl shadow-yellow-500/40 scale-100' 
                    : 'text-slate-300 hover:text-yellow-300 border border-slate-700/40 hover:border-yellow-500/50'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background gradient overlay */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                
                <div className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-115' : 'group-hover:scale-125 group-hover:-rotate-12'}`}>
                  <Icon size={20} className={isActive ? 'text-yellow-100' : ''} />
                </div>
                <span className="truncate group-hover:font-bold transition-all duration-300">{item.label}</span>
                {isActive && (
                  <div className="ml-auto flex items-center gap-1 text-yellow-100">
                    <span className="text-xs font-bold">●</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-700/50 flex-shrink-0 space-y-3 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/20 dark:from-slate-950/95 dark:via-slate-900/60 dark:to-slate-900/20 backdrop-blur-xl">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <div className="text-center space-y-2 py-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              MPT Warrior
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Trading Excellence
            </p>
            <div className="flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-slate-500">Live Ready</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}