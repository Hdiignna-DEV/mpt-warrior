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
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Jurnal Trading', href: '/journal', icon: BookOpen },
  { name: 'Kalkulator Risiko', href: '/calculator', icon: Calculator },
  { name: 'AI Mentor', href: '/ai-mentor', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col p-6 z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="mb-8 md:mb-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <img
              src="/mpt-logo.png"
              alt="MPT Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <h2 className="text-sm font-black text-yellow-500 tracking-wider">
            MINDSET PLAN
          </h2>
          <h2 className="text-sm font-black text-yellow-500 tracking-wider mb-1">
            TRADER
          </h2>
          <p className="text-xs text-slate-400 italic">Warrior Trading Hub</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow-lg shadow-yellow-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-yellow-500'}
                />
                <span className="text-sm font-semibold">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Motivational Section */}
        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <div className="bg-slate-800/40 rounded-xl p-4 text-center">
            <p className="text-xs font-bold text-yellow-400 mb-2">
              ⚡ TIPS PRO
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Disiplin adalah keunggulan kompetitif Anda. Ikuti aturan, selalu.
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Versi 1.0 • Komunitas MPT
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Add padding for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}