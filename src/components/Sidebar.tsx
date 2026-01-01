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
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/journal', label: 'Trading Journal', icon: BookOpen },
  { href: '/calculator', label: 'Risk Calculator', icon: Calculator },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-3 left-3 z-50 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-yellow-500 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="sm:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed sm:static inset-y-0 left-0 z-40
          w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-700/50
          flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          h-screen sm:h-auto overflow-y-auto
        `}
      >
        {/* Logo/Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700/50 flex flex-col items-center flex-shrink-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
          <div className="w-24 sm:w-32 h-24 sm:h-32 mb-2 sm:mb-3 relative">
            <Image
              src="/mpt-logo.png"
              alt="MPT Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center">
            MINDSET PLAN TRADER
          </h1>
          <p className="text-xs text-slate-400 mt-1 text-center font-semibold">Warrior Trading Hub</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto\">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg
                  transition-all duration-200 text-sm sm:text-base font-medium
                  ${isActive 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-slate-950 font-bold shadow-lg shadow-yellow-500/30' 
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-yellow-400 border border-transparent hover:border-yellow-500/30'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-700/50 flex-shrink-0 space-y-3 bg-gradient-to-t from-slate-950 to-slate-900/50 backdrop-blur-sm">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <p className="text-xs text-slate-500 text-center font-medium\">
            v5.0 (Enhanced)
          </p>
        </div>
      </aside>
    </>
  );
}