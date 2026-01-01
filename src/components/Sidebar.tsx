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
  X
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Trading Journal', icon: BookOpen },
  { href: '/calculator', label: 'Risk Calculator', icon: Calculator },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
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
          w-64 bg-slate-900 border-r border-slate-700
          flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          h-screen sm:h-auto overflow-y-auto
        `}
      >
        {/* Logo/Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700 flex flex-col items-center flex-shrink-0">
          <div className="w-24 sm:w-32 h-24 sm:h-32 mb-2 sm:mb-3 relative">
            <Image
              src="/mpt-logo.png"
              alt="MPT Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-base sm:text-xl font-bold text-yellow-500 text-center">
            MINDSET PLAN TRADER
          </h1>
          <p className="text-xs text-slate-400 mt-1 text-center">Warrior Trading Hub</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
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
                  transition-colors duration-200 text-sm sm:text-base
                  ${isActive 
                    ? 'bg-yellow-500 text-slate-900 font-bold' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-yellow-500'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-700 flex-shrink-0">
          <p className="text-xs text-slate-500 text-center">
            v4.0 (Tactical)
          </p>
        </div>
      </aside>
    </>
  );
}