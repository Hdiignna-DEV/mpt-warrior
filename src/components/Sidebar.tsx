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
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Trading Journal', icon: BookOpen },
  { href: '/calculator', label: 'Risk Calculator', icon: Calculator },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768;
    setIsMobile(isMobileDevice);
    setIsOpen(!isMobileDevice);

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const handleMenuClick = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg md:hidden transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-r border-slate-800 transition-all duration-300 overflow-y-auto ${
          isOpen ? 'w-64' : 'w-0 md:w-20'
        } ${isMobile ? 'md:w-20' : ''}`}
      >
        {/* Logo Section */}
        <div className={`${isOpen ? 'p-6' : 'p-4'} border-b border-slate-800/50 sticky top-0 bg-slate-950/80 backdrop-blur-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center font-bold text-black shadow-lg shadow-yellow-500/30">
                M
              </div>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="font-bold text-white text-sm leading-tight">MPT</p>
                <p className="text-xs text-yellow-400">Warrior Hub</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className={`${isOpen ? 'p-4' : 'p-2'} space-y-2 mt-4`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative ${
                  active
                    ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 border border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon size={20} className={active ? 'text-yellow-400' : 'group-hover:text-yellow-400 transition-colors'} />
                {isOpen && (
                  <>
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    {active && <ChevronRight size={16} />}
                  </>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Menu */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-gradient-to-t from-slate-950 to-transparent space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-all group">
              <Settings size={18} />
              <span className="text-sm font-medium group-hover:text-yellow-400 transition-colors">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all">
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}