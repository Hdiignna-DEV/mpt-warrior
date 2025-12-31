'use client';
import { Bell, Search, Settings } from 'lucide-react';
import { useState } from 'react';

export default function TopBar() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Search Bar */}
      <div className={`hidden md:flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 transition-all duration-300 hover:border-yellow-500/50 flex-1 max-w-sm`}>
        <Search size={18} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search trades, pairs..."
          className="bg-transparent outline-none text-sm flex-1 text-white placeholder-slate-500"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Mobile Search */}
        <button
          onClick={() => setSearchActive(!searchActive)}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-white"
        >
          <Search size={20} />
        </button>

        {/* Notifications */}
        <div className="relative group">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-white relative">
            <Bell size={20} />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
            )}
          </button>

          {/* Notification Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-bold text-white text-sm">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {[
                { icon: '📊', title: 'Weekly Report Ready', time: '1 hour ago' },
                { icon: '⚠️', title: 'High Impact News Alert', time: '3 hours ago' },
                { icon: '✅', title: 'Trade Closed (WIN)', time: '5 hours ago' },
              ].map((notif, i) => (
                <div key={i} className="px-4 py-3 border-b border-slate-700 hover:bg-slate-700/30 transition-all cursor-pointer">
                  <div className="flex gap-3">
                    <span className="text-lg">{notif.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{notif.title}</p>
                      <p className="text-xs text-slate-500">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-700 text-center">
              <button className="text-xs text-yellow-400 hover:text-yellow-300 font-medium">View all</button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-white hidden md:block">
          <Settings size={20} />
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-black shadow-lg shadow-yellow-500/30 cursor-pointer hover:shadow-yellow-500/50 transition-all">
          W
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchActive && (
        <div className="absolute top-16 left-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-2 md:hidden z-50">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder-slate-500"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}