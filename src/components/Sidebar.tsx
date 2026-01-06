'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MptLogo from './MptLogo';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calculator, 
  Bot,
  Menu,
  X,
  BarChart3,
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
  Shield,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { href: '/dashboard', label: 'nav.dashboard', fallback: 'Dashboard', icon: LayoutDashboard, description: 'Overview' },
  { href: '/analytics', label: 'nav.analytics', fallback: 'Analytics', icon: BarChart3, description: 'Data Insights' },
  { href: '/journal', label: 'nav.journal', fallback: 'Journal', icon: BookOpen, description: 'History' },
  { href: '/academy', label: 'nav.academy', fallback: 'Academy', icon: Sparkles, description: 'Learn' },
  { href: '/calculator', label: 'nav.calculator', fallback: 'Calculator', icon: Calculator, description: 'Calculate' },
  { href: '/ai-mentor', label: 'nav.aiMentor', fallback: 'AI Mentor', icon: Bot, description: 'Coach' },
  { href: '/achievements', label: 'nav.achievements', fallback: 'Achievements', icon: Trophy, description: 'Progress' },
];

// Admin-only menu item
const adminMenuItem = { 
  href: '/admin-hq', 
  label: 'nav.adminHQ', 
  fallback: 'Admin HQ', 
  icon: Shield, 
  description: 'Commander' 
};

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('mpt_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Store desktop sidebar state in localStorage
  useEffect(() => {
    setMounted(true);
    console.log('Sidebar mounted, language:', localStorage.getItem('mpt-language'));
    const stored = localStorage.getItem('sidebar-desktop-open');
    if (stored !== null) {
      setIsDesktopOpen(stored === 'true');
    }
  }, []);

  // Listen to localStorage changes (from Header component)
  useEffect(() => {
    // Also listen to custom event from same window
    const handleToggle = () => {
      const stored = localStorage.getItem('sidebar-desktop-open');
      if (stored !== null) {
        const newState = stored === 'true';
        setIsDesktopOpen(newState);
      }
    };

    window.addEventListener('sidebar-toggle', handleToggle);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleToggle);
    };
  }, []);

  // Set initial body class on mount
  useEffect(() => {
    if (isDesktopOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.add('sidebar-closed');
    }
  }, [isDesktopOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isDesktopOpen && (
        <div
          onClick={() => {
            localStorage.setItem('sidebar-desktop-open', 'false');
            setIsDesktopOpen(false);
            document.body.classList.add('sidebar-closed');
            document.body.classList.remove('sidebar-open');
            window.dispatchEvent(new Event('sidebar-toggle'));
          }}
          className="sm:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 bg-white dark:bg-slate-900
          flex flex-col
          ${isDesktopOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          h-screen overflow-hidden
          border-r border-slate-200 dark:border-slate-800
        `}
        style={{
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, background-color 0.3s ease',
          willChange: 'transform'
        }}
      >
        {/* Premium Header Section */}
        <div className="relative p-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 transition-all duration-300">
          {/* Close Button - Mobile */}
          <button
            onClick={() => {
              localStorage.setItem('sidebar-desktop-open', 'false');
              setIsDesktopOpen(false);
              document.body.classList.add('sidebar-closed');
              document.body.classList.remove('sidebar-open');
              window.dispatchEvent(new Event('sidebar-toggle'));
            }}
            className="sm:hidden absolute top-4 right-4 z-10 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            aria-label="Close sidebar"
            type="button"
          >
            <X size={20} />
          </button>
          
          <div className="relative space-y-4">
            {/* Logo Container */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl border-4 border-amber-400 dark:border-amber-500 group-hover:scale-105 transition-all duration-300 overflow-hidden p-1.5">
                  <MptLogo size={96} className="brightness-110 contrast-125" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h1 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 uppercase tracking-tight">
                MPT Warrior
              </h1>
              <p className="text-xs text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-widest">Trading Hub</p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 font-semibold
                  ${isActive 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-[1.02]' 
                    : 'text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-900'
                  }
                `}
              >
                {/* Icon Container */}
                <div className={`
                  flex-shrink-0 p-2 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700'
                  }
                `}>
                  <Icon size={20} />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <p className="text-sm font-bold" suppressHydrationWarning>{t(item.label)}</p>
                  <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-zinc-500'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <ArrowRight className="w-5 h-5 text-white/80" />
                )}
              </Link>
            );
          })}

          {/* Admin HQ Menu - Only for ADMIN and SUPER_ADMIN roles */}
          {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
            <>
              {/* Divider */}
              <div className="py-2">
                <div className="border-t border-amber-200 dark:border-amber-800/30" />
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3 mb-1 px-2 uppercase tracking-wider">Admin Panel</p>
              </div>

              {/* Admin HQ Link */}
              <Link
                href={adminMenuItem.href}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 font-semibold
                  ${pathname === adminMenuItem.href
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 scale-[1.02]' 
                    : 'text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 border-red-200 dark:border-red-800/30'
                  }
                `}
              >
                {/* Icon Container */}
                <div className={`
                  flex-shrink-0 p-2 rounded-lg transition-all duration-300
                  ${pathname === adminMenuItem.href
                    ? 'bg-white/20' 
                    : 'bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/30'
                  }
                `}>
                  <Shield size={20} />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <p className="text-sm font-bold">{adminMenuItem.fallback}</p>
                  <p className={`text-xs ${pathname === adminMenuItem.href ? 'text-white/80' : 'text-red-600 dark:text-red-400'}`}>
                    {adminMenuItem.description}
                  </p>
                </div>

                {/* Active Indicator */}
                {pathname === adminMenuItem.href && (
                  <ArrowRight className="w-5 h-5 text-white/80" />
                )}
              </Link>
            </>
          )}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex-shrink-0 space-y-4 bg-gradient-to-t from-gray-50 to-transparent dark:from-zinc-950 dark:to-transparent">
          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem('mpt_user');
              localStorage.removeItem('mpt_token');
              window.location.href = '/login';
            }}
            className="w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-gray-700 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 border-gray-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-red-800/50"
          >
            {/* Icon Container */}
            <div className="flex-shrink-0 p-2 rounded-lg transition-all duration-300 bg-gray-100 dark:bg-zinc-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30">
              <LogOut size={20} />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">Logout</p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400">Exit System</p>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Premium Info Card */}
          <div className="relative p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-gradient-to-br from-sky-50 to-orange-50 dark:from-sky-950/20 dark:to-orange-950/20">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <p className="text-sm font-bold text-sky-600 dark:text-sky-400">Premium Edition</p>
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">Trading Excellence</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}