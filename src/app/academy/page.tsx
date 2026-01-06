/**
 * MPT Academy - The Plan Warrior Blueprint
 * Main educational hub with structured learning path
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  BookOpen, 
  Shield, 
  Map, 
  Sword, 
  ScrollText, 
  HeartPulse,
  Lock,
  CheckCircle2,
  Clock,
  Trophy,
  Target,
  Brain
} from 'lucide-react';

interface ModuleConfig {
  id: string;
  moduleNumber: number;
  level: 'RECRUIT' | 'WARRIOR' | 'VETERAN';
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  isAvailable: boolean;
  totalPoints: number;
  estimatedHours: number;
  color: string;
  gradient: string;
}

// Static module configuration based on PDF structure
const MODULE_CONFIGS: ModuleConfig[] = [
  {
    id: 'module-1',
    moduleNumber: 1,
    level: 'RECRUIT',
    icon: Brain,
    title: 'THE WARRIOR MINDSET',
    subtitle: 'Psychology & Mental Framework',
    description: 'Master the psychological foundation of trading. Transform from speculator to professional investor with disciplined mindset.',
    topics: [
      '1.1 Paradigm Shift: Dari Spekulan ke Pebisnis',
      '1.2 Anatomi Emosi: Greed, Fear & Hope',
      '1.3 Hukum Probabilitas Trading',
      '1.4 Disiplin Sebagai Mata Uang'
    ],
    isAvailable: true,
    totalPoints: 150,
    estimatedHours: 3,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'module-2',
    moduleNumber: 2,
    level: 'RECRUIT',
    icon: Shield,
    title: 'THE SHIELD',
    subtitle: 'Risk Management & Protection',
    description: 'Learn critical risk management techniques. Protect your capital with 1% RPT rule, position sizing, and drawdown management.',
    topics: [
      '2.1 Aturan Emas RPT 1%',
      '2.2 Manajemen Margin & Leverage',
      '2.3 Kalkulasi Lot Presisi',
      '2.4 Risk to Reward Ratio (RRR)',
      '2.5 Drawdown Management'
    ],
    isAvailable: true,
    totalPoints: 175,
    estimatedHours: 4,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'module-3',
    moduleNumber: 3,
    level: 'RECRUIT',
    icon: Map,
    title: 'THE MAP',
    subtitle: 'Technical Analysis Fundamentals',
    description: 'Navigate markets with technical analysis. Master market structure, support/resistance, and multi-timeframe analysis.',
    topics: [
      '3.1 Market Structure & Trend',
      '3.2 Level Psikologis: Pivot Point',
      '3.3 Support & Resistance Zones',
      '3.4 Teknik Kunci Atas & Bawah',
      '3.5 Multi-Timeframe Analysis'
    ],
    isAvailable: true,
    totalPoints: 215,
    estimatedHours: 5,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'module-4',
    moduleNumber: 4,
    level: 'WARRIOR',
    icon: Sword,
    title: 'THE SWORD',
    subtitle: 'Execution Strategy',
    description: 'Execute trades with precision. Master entry setups, price action patterns, and trade management techniques.',
    topics: [
      '4.1 SOP Pre-Market Ritual',
      '4.2 Setup A - Rejection Strategy',
      '4.3 Setup B - Breakout Strategy',
      '4.4 Trigger Konfirmasi Price Action',
      '4.5 Trade Management & Partial TP'
    ],
    isAvailable: false,
    totalPoints: 200,
    estimatedHours: 4,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'module-5',
    moduleNumber: 5,
    level: 'WARRIOR',
    icon: ScrollText,
    title: 'THE CHRONICLE',
    subtitle: 'Evaluation & Journaling',
    description: 'Track and improve your trading. Professional journaling, weekly audits, and safe scaling strategies.',
    topics: [
      '5.1 Jurnaling Profesional',
      '5.2 Audit Jurnal Mingguan',
      '5.3 Scaling Up Plan'
    ],
    isAvailable: false,
    totalPoints: 150,
    estimatedHours: 3,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    id: 'module-6',
    moduleNumber: 6,
    level: 'VETERAN',
    icon: HeartPulse,
    title: 'THE MED-KIT',
    subtitle: 'Recovery & Resilience',
    description: 'Recover from setbacks stronger. Learn post-margin call protocols, trauma recovery, and comeback strategies.',
    topics: [
      '6.1 Protokol Pasca-Margin Call',
      '6.2 Mengatasi Trauma Loss',
      '6.3 Recovery Roadmap'
    ],
    isAvailable: false,
    totalPoints: 100,
    estimatedHours: 2,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500'
  }
];

export default function AcademyPage() {
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserProgress(token);
  }, [router]);

  const fetchUserProgress = async (token: string) => {
    try {
      // Fetch module summary
      const summaryRes = await fetch('/api/academy/progress?summary=true', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (summaryRes.ok) {
        const { summary } = await summaryRes.json();
        const progressMap: Record<string, number> = {};
        const completed = new Set<string>();

        summary.forEach((item: any) => {
          progressMap[item.moduleId] = item.progress;
          // Module completed if 100% progress
          if (item.progress === 100) {
            completed.add(item.moduleId);
          }
        });

        setUserProgress(progressMap);
        setCompletedModules(completed);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setLoading(false);
    }
  };

  const isModuleUnlocked = (module: ModuleConfig): boolean => {
    // Module 1 always unlocked
    if (module.moduleNumber === 1) {
      return true;
    }

    // Check if previous module is completed
    const previousModuleId = `module-${module.moduleNumber - 1}`;
    return completedModules.has(previousModuleId);
  };

  const getColorClasses = (color: string, isAvailable: boolean) => {
    if (!isAvailable) {
      return {
        badge: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        border: 'border-gray-700/50',
        hover: '',
        icon: 'bg-gray-800 text-gray-500'
      };
    }

    const colors: Record<string, any> = {
      purple: {
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        border: 'border-purple-500/30',
        hover: 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20',
        icon: 'bg-purple-900/30 text-purple-400'
      },
      blue: {
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        border: 'border-blue-500/30',
        hover: 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20',
        icon: 'bg-blue-900/30 text-blue-400'
      },
      emerald: {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        border: 'border-emerald-500/30',
        hover: 'hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20',
        icon: 'bg-emerald-900/30 text-emerald-400'
      },
      amber: {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        border: 'border-amber-500/30',
        hover: 'hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20',
        icon: 'bg-amber-900/30 text-amber-400'
      },
      violet: {
        badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
        border: 'border-violet-500/30',
        hover: 'hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20',
        icon: 'bg-violet-900/30 text-violet-400'
      },
      rose: {
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        border: 'border-rose-500/30',
        hover: 'hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/20',
        icon: 'bg-rose-900/30 text-rose-400'
      }
    };

    return colors[color] || colors.purple;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white py-20">
            <div className="animate-pulse">Loading The Plan Warrior Blueprint...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                The Plan Warrior Blueprint
              </h1>
              <p className="text-gray-400 mt-1">
                Modul Resmi Edukasi Trading - Komunitas Mindset Plan Trader
              </p>
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4">
            <p className="text-amber-400 text-sm font-medium">
              📖 "Focus on the Plan, Not the Panic." - Edisi 1.0 | Desember 2025
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-sm text-gray-400">Total Modules</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-gray-400">Available Now</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">990</p>
                <p className="text-sm text-gray-400">Total Points</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">21</p>
                <p className="text-sm text-gray-400">Total Hours</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MODULE_CONFIGS.map((module) => {
            const ModuleIcon = module.icon;
            const isUnlocked = isModuleUnlocked(module);
            const isCurrentlyAvailable = module.isAvailable && isUnlocked;
            const colors = getColorClasses(module.color, isCurrentlyAvailable);
            const progress = userProgress[module.id] || 0;

            return (
              <Card
                key={module.id}
                className={`bg-white/5 backdrop-blur-sm border transition-all ${
                  colors.border
                } ${isCurrentlyAvailable ? `${colors.hover} cursor-pointer` : 'cursor-not-allowed opacity-70'}`}
                onClick={() => {
                  if (isCurrentlyAvailable) {
                    router.push(`/academy/${module.id}?level=${module.level}`);
                  }
                }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${colors.icon}`}>
                        <ModuleIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <Badge className={`${colors.badge} border mb-2`}>
                          MODULE {module.moduleNumber}
                        </Badge>
                        <h3 className="text-xl font-bold text-white">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {module.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    {!isCurrentlyAvailable && (
                      <div className="flex items-center gap-2">
                        <Lock className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Topics List */}
                  <div className="space-y-2 mb-4">
                    {module.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-400">{topic}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm mb-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="text-gray-300">{module.totalPoints} pts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">~{module.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-300">{module.topics.length} topics</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isCurrentlyAvailable && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Your Progress:</span>
                        <span className="text-white font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${module.gradient} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Locked Message */}
                  {!isCurrentlyAvailable && module.isAvailable && (
                    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <p className="text-amber-400 text-sm font-medium">
                          Complete Module {module.moduleNumber - 1} to unlock
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Coming Soon Badge */}
                  {!module.isAvailable && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-sm font-medium">
                        🚀 Coming Soon
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-2">📚 Learning Path</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Complete modules 1-3 to unlock advanced trading strategies. Each module includes interactive quizzes 
                with automatic grading for multiple choice questions and manual review by instructors for essay questions.
                Earn points and track your progress as you transform into a disciplined Plan Warrior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
