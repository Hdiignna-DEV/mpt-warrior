/**
 * Module Detail Page
 * Shows all lessons in a module
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Quiz from '@/components/Quiz';

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

interface LessonProgress {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number;
  lastAccessedAt: string;
}

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get('level');

  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [canAccess, setCanAccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Fallback: jika token tidak ada di localStorage, coba ambil dari cookie
    let token: string | undefined = localStorage.getItem('token') || undefined;
    if (!token) {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      if (match && match[1]) {
        token = match[1];
        localStorage.setItem('token', token);
        console.log('[Academy Module] Token diambil dari cookie:', token);
      } else {
        console.log('[Academy Module] Token tidak ditemukan di cookie.');
      }
    } else {
      console.log('[Academy Module] Token ditemukan di localStorage:', token);
    }
    if (!level) {
      setError('Missing level parameter');
      setLoading(false);
      return;
    }
    fetchModuleData(token);
  }, [resolvedParams.id, level]);

  const fetchModuleData = async (tokenParam?: string) => {
    try {
      const token = tokenParam || localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch module details
      const moduleRes = await fetch(
        `/api/academy/modules/${resolvedParams.id}?level=${level}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!moduleRes.ok) throw new Error('Failed to fetch module');
      
      const moduleData = await moduleRes.json();
      setModule(moduleData.module);
      setCanAccess(moduleData.canAccess);

      // Fetch user progress
      const progressRes = await fetch('/api/academy/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(
          progressData.progress.filter((p: LessonProgress) => p.moduleId === resolvedParams.id)
        );
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white">Loading module...</div>
        </div>
      </div>
    );
  }

  if (!module || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-400">
            {error || 'Module not found'}
          </div>
          <div className="text-center mt-4">
            <Button onClick={() => router.push('/academy')}>
              Back to Academy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = module.lessons.filter(l => isLessonCompleted(l.id)).length;
  const progressPercent = Math.round((completedLessons / module.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/academy')}
          className="mb-6 bg-white/10 hover:bg-white/20"
        >
          ← Back to Academy
        </Button>

        {/* Module Header */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <div className="p-6">
            <Badge className={`${getLevelColor(module.level)} border mb-4`}>
              {getLevelIcon(module.level)} {module.level}
            </Badge>

            <h1 className="text-3xl font-bold text-white mb-3">
              {module.title}
            </h1>
            
            <p className="text-gray-300 mb-4">
              {module.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-gray-400 text-sm">Lessons</div>
                <div className="text-white font-bold text-xl">
                  {module.lessons.length}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Completed</div>
                <div className="text-white font-bold text-xl">
                  {completedLessons}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Progress</div>
                <div className="text-white font-bold text-xl">
                  {progressPercent}%
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Total Time</div>
                <div className="text-white font-bold text-xl">
                  {module.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0)} min
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Access Warning */}
            {!canAccess && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400">
                ⚠️ You need to complete prerequisite modules before accessing this content
              </div>
            )}
          </div>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          {module.lessons
            .sort((a, b) => a.order - b.order)
            .map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const locked = !canAccess;

              return (
                <Card
                  key={lesson.id}
                  className={`bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all ${
                    locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() =>
                    !locked &&
                    router.push(`/academy/${module.id}/${lesson.id}?level=${module.level}`)
                  }
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Lesson Number Circle */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          completed
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {completed ? '✓' : index + 1}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {lesson.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>⏱️ {lesson.estimatedMinutes} min</span>
                          {lesson.videoUrl && <span>🎥 Video</span>}
                          {lesson.imageUrl && <span>🖼️ Image</span>}
                          {completed && (
                            <span className="text-green-400 font-medium">
                              ✅ Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lock Icon */}
                      {locked && (
                        <div className="flex-shrink-0 text-2xl">
                          🔒
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>

        {/* Quiz Section */}
        {completedLessons === module.lessons.length && !canAccess === false && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  📝 Module Quiz
                </h3>
                <p className="text-gray-400 text-sm">
                  Complete the quiz to test your knowledge (Passing score: 70%)
                </p>
              </div>
              {!showQuiz && (
                <Button
                  onClick={() => setShowQuiz(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Quiz
                </Button>
              )}
            </div>

            {showQuiz && (
              <Quiz 
                moduleId={resolvedParams.id} 
                onComplete={() => {
                  // Refresh progress
                  fetchModuleData();
                }}
              />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
