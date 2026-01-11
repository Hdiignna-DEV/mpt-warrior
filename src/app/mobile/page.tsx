'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Target,
  Trophy,
  Zap,
  Home,
  BookOpen,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

export default function MobileApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState<{ name: string; image: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({
        name: 'Trader',
        image: '/mpt-logo.png',
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Image src="/mpt-logo.png" alt="MPT" width={80} height={80} className="mx-auto mb-4 animate-bounce" />
          <h1 className="text-2xl font-black text-amber-400">MPT COMMAND CENTER</h1>
          <p className="text-slate-400 text-sm mt-2">Mempersiapkan aplikasi...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeTab user={user} />;
      case 'journal':
        return <JournalTab />;
      case 'chat':
        return <ChatTab />;
      case 'calculator':
        return <CalculatorTab />;
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'achievements':
        return <AchievementsTab />;
      default:
        return <HomeTab user={user} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-amber-500/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/mpt-logo.png" alt="MPT" width={36} height={36} />
          <div>
            <h1 className="text-lg font-black text-amber-400">MPT HUB</h1>
            <p className="text-xs text-amber-500/70">Trading</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-amber-400 transition">
          <Settings size={20} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-amber-500/20 flex justify-around h-20">
        <NavButton
          icon={<Home size={24} />}
          label="Home"
          active={currentTab === 'home'}
          onClick={() => setCurrentTab('home')}
        />
        <NavButton
          icon={<BookOpen size={24} />}
          label="Journal"
          active={currentTab === 'journal'}
          onClick={() => setCurrentTab('journal')}
        />
        <NavButton
          icon={<MessageSquare size={24} />}
          label="Chat"
          active={currentTab === 'chat'}
          onClick={() => setCurrentTab('chat')}
        />
        <NavButton
          icon={<Target size={24} />}
          label="Calc"
          active={currentTab === 'calculator'}
          onClick={() => setCurrentTab('calculator')}
        />
        <NavButton
          icon={<Trophy size={24} />}
          label="Rank"
          active={currentTab === 'leaderboard'}
          onClick={() => setCurrentTab('leaderboard')}
        />
        <NavButton
          icon={<Zap size={24} />}
          label="Badge"
          active={currentTab === 'achievements'}
          onClick={() => setCurrentTab('achievements')}
        />
      </nav>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 flex-1 transition ${
        active ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-amber-400'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

interface HomeTabProps {
  user: { name: string; image: string } | null;
}

function HomeTab({ user }: HomeTabProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 rounded-lg p-4 border border-amber-500/30">
        <h2 className="text-xl font-black text-amber-400">Welcome! 👋</h2>
        <p className="text-slate-400 text-sm mt-1">Ready to trade smarter today?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="📊" title="Balance" value="$5,000" />
        <StatCard icon="📈" title="P&L" value="+$500" color="green" />
        <StatCard icon="🎯" title="Win Rate" value="65%" />
        <StatCard icon="⏱️" title="Trades" value="23" />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-amber-400 px-2">Features</h3>
        <FeatureCard icon="📔" title="Trading Journal" desc="Catat & analisis trades" />
        <FeatureCard icon="🤖" title="AI Mentor" desc="Dapatkan saran trading" />
        <FeatureCard icon="🧮" title="Risk Calculator" desc="Hitung risk & posisi" />
      </div>
    </div>
  );
}

function JournalTab() {
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold text-amber-400">Trading Journal</h2>
      <div className="space-y-2">
        <JournalEntry date="Jan 11" pair="EURUSD" result="+$125" status="win" />
        <JournalEntry date="Jan 10" pair="GBPUSD" result="-$50" status="loss" />
        <JournalEntry date="Jan 9" pair="USDJPY" result="+$200" status="win" />
      </div>
      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition mt-4">
        Add New Entry
      </button>
    </div>
  );
}

function ChatTab() {
  return (
    <div className="p-4 space-y-3 flex flex-col h-full">
      <h2 className="text-lg font-bold text-amber-400">AI Mentor Chat</h2>
      <div className="flex-1 space-y-3 overflow-y-auto">
        <ChatMessage type="bot" text="Halo! Saya AI mentor Anda. Tanya apa saja tentang trading!" />
        <ChatMessage type="user" text="Bagaimana cara menghitung risk management yang baik?" />
        <ChatMessage type="bot" text="Risk management penting! Gunakan rule 1-2% per trade. Mari hitung bersama di calculator..." />
      </div>
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Tanya AI mentor..."
          className="flex-1 bg-slate-800 border border-amber-500/20 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
        />
        <button className="bg-amber-600 hover:bg-amber-700 p-2 rounded transition">
          <MessageSquare size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function CalculatorTab() {
  const [riskAmount, setRiskAmount] = useState(100);
  const [accountSize, setAccountSize] = useState(10000);

  const positionSize = (riskAmount / accountSize) * 100;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-amber-400">Risk Calculator</h2>

      <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm text-amber-400 mb-2">Account Size</label>
          <input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(Number(e.target.value))}
            className="w-full bg-slate-700 border border-amber-500/20 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-amber-400 mb-2">Risk Amount ($)</label>
          <input
            type="number"
            value={riskAmount}
            onChange={(e) => setRiskAmount(Number(e.target.value))}
            className="w-full bg-slate-700 border border-amber-500/20 rounded px-3 py-2 text-white"
          />
        </div>

        <div className="bg-amber-500/20 border border-amber-500/50 rounded p-4">
          <p className="text-slate-400 text-sm mb-1">Position Size</p>
          <p className="text-2xl font-bold text-amber-400">{positionSize.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}

function LeaderboardTab() {
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold text-amber-400">Leaderboard</h2>
      <LeaderboardEntry rank={1} name="Pro Trader" profit="+$5,250" medal="🥇" />
      <LeaderboardEntry rank={2} name="Smart Investor" profit="+$4,100" medal="🥈" />
      <LeaderboardEntry rank={3} name="Risk Manager" profit="+$3,850" medal="🥉" />
      <LeaderboardEntry rank={4} name="You" profit="+$500" medal="⭐" highlight />
    </div>
  );
}

function AchievementsTab() {
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold text-amber-400">Achievements</h2>
      <div className="grid grid-cols-3 gap-3">
        <Achievement icon="🎖️" title="First Trade" unlocked={true} />
        <Achievement icon="🏆" title="Win 5x" unlocked={true} />
        <Achievement icon="💰" title="$1K Profit" unlocked={false} />
        <Achievement icon="🔥" title="Streak 10" unlocked={false} />
        <Achievement icon="🚀" title="Expert" unlocked={false} />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color?: string;
}

function StatCard({ icon, title, value, color = 'amber' }: StatCardProps) {
  return (
    <div className={`bg-slate-800/50 border border-${color}-500/20 rounded-lg p-3`}>
      <p className="text-2xl">{icon}</p>
      <p className="text-xs text-slate-400 mt-1">{title}</p>
      <p className="text-lg font-bold text-{color}-400">{value}</p>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-3 hover:border-amber-500/50 transition">
      <div className="flex items-start gap-3">
        <p className="text-2xl">{icon}</p>
        <div>
          <p className="font-bold text-amber-400 text-sm">{title}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
    </div>
  );
}

interface JournalEntryProps {
  date: string;
  pair: string;
  result: string;
  status: 'win' | 'loss';
}

function JournalEntry({ date, pair, result, status }: JournalEntryProps) {
  const isWin = status === 'win';
  return (
    <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold text-white">{pair}</p>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
        <p className={`font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>{result}</p>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  type: 'bot' | 'user';
  text: string;
}

function ChatMessage({ type, text }: ChatMessageProps) {
  const isBot = type === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs rounded-lg p-3 text-sm ${
          isBot
            ? 'bg-slate-800/50 border border-amber-500/20 text-slate-300'
            : 'bg-amber-600/30 border border-amber-500/50 text-amber-100'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  profit: string;
  medal: string;
  highlight?: boolean;
}

function LeaderboardEntry({ rank, name, profit, medal, highlight }: LeaderboardEntryProps) {
  return (
    <div
      className={`rounded-lg p-3 flex items-center justify-between ${
        highlight ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-slate-800/50 border border-amber-500/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{medal}</span>
        <div>
          <p className="font-bold text-white text-sm">#{rank}</p>
          <p className="text-xs text-slate-400">{name}</p>
        </div>
      </div>
      <p className="font-bold text-green-400">{profit}</p>
    </div>
  );
}

interface AchievementProps {
  icon: string;
  title: string;
  unlocked: boolean;
}

function Achievement({ icon, title, unlocked }: AchievementProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-lg ${unlocked ? 'bg-amber-500/20' : 'bg-slate-800/30'} border ${unlocked ? 'border-amber-500/50' : 'border-slate-700/50'}`}>
      <p className="text-3xl" style={{ opacity: unlocked ? 1 : 0.5 }}>
        {icon}
      </p>
      <p className={`text-xs text-center font-bold ${unlocked ? 'text-amber-400' : 'text-slate-500'}`}>{title}</p>
    </div>
  );
}
