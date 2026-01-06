/**
 * MPT Academy - Main Page
 * Educational hub with learning modules
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Lesson {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  order: number;
  estimatedMinutes: number;
}

interface Module {
  id: string;
  level: 'RECRUIT' | 'WARRIOR' | 'VETERAN';
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
}

interface ModuleSummary {
  moduleId: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lastAccessedAt: string;
}

export default function AcademyPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [summary, setSummary] = useState<ModuleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'RECRUIT' | 'WARRIOR' | 'VETERAN'>('ALL');

  useEffect(() => {
    // Fallback: jika token tidak ada di localStorage, coba ambil dari cookie
    let token: string | undefined = localStorage.getItem('token') || undefined;
    if (!token) {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      if (match && match[1]) {
        token = match[1];
        localStorage.setItem('token', token);
      }
    }
    fetchData(token);
  }, [selectedLevel]);

  const fetchData = async (tokenParam?: string) => {
    try {
      setLoading(true);
      const token = tokenParam || localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch modules
      const modulesUrl = selectedLevel === 'ALL'
        ? '/api/academy/modules'
        : `/api/academy/modules?level=${selectedLevel}`;
        
      const modulesRes = await fetch(modulesUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!modulesRes.ok) throw new Error('Failed to fetch modules');
      
      const modulesData = await modulesRes.json();
      setModules(modulesData.modules);

      // Fetch progress summary
      const progressRes = await fetch('/api/academy/progress?summary=true', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setSummary(progressData.summary);
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getModuleProgress = (moduleId: string): ModuleSummary | undefined => {
    return summary.find(s => s.moduleId === moduleId);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'RECRUIT':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'WARRIOR':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'VETERAN':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'RECRUIT':
        return '🎖️';
      case 'WARRIOR':
        return '⚔️';
      case 'VETERAN':
        return '🏆';
      default:
        return '📚';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">Loading MPT Academy...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎓 MPT Academy
          </h1>
          <p className="text-gray-300">
            Structured learning path to transform from RECRUIT to VETERAN warrior
          </p>
        </div>

        {/* Level Filter */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {['ALL', 'RECRUIT', 'WARRIOR', 'VETERAN'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {level === 'ALL' ? '📚 All Levels' : `${getLevelIcon(level)} ${level}`}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(module => {
            const progress = getModuleProgress(module.id);
            const isLocked = module.prerequisites.length > 0 && (!progress || progress.progress < 100);

            return (
              <Card
                key={module.id}
                className={`bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all cursor-pointer ${
                  isLocked ? 'opacity-60' : ''
                }`}
                onClick={() => !isLocked && router.push(`/academy/${module.id}?level=${module.level}`)}
              >
                <div className="p-6">
                  {/* Level Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${getLevelColor(module.level)} border`}>
                      {getLevelIcon(module.level)} {module.level}
                    </Badge>
                    {isLocked && (
                      <span className="text-2xl">🔒</span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Lessons:</span>
                      <span className="text-white font-medium">
                        {module.lessons.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white font-medium">
                        ~{module.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0)} min
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {progress && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress:</span>
                          <span className="text-white font-medium">
                            {progress.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prerequisites Warning */}
                  {isLocked && module.prerequisites.length > 0 && (
                    <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
                      Complete prerequisites to unlock
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {modules.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No modules available for this level
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
