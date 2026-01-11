'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Brain, Trophy, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home', name: 'home' },
    { href: '/academy', icon: BookOpen, label: 'Learn', name: 'learn' },
    { href: '/ai-mentor', icon: Brain, label: 'AI', name: 'ai' },
    { href: '/leaderboard', icon: Trophy, label: 'Rank', name: 'rank' },
    { href: '/profile', icon: User, label: 'Profile', name: 'profile' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Spacer untuk content di atas nav */}
      <div className="h-20" />

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-20 transition-colors ${
                  active
                    ? 'text-blue-400 bg-slate-800'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
