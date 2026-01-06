/**
 * Lesson Viewer Page
 * academy/[moduleId]/[lessonId]/page.tsx
 * - Render lesson content (Markdown, image, video)
 * - Mark as complete
 * - Next/Previous navigation
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import ReactMarkdown from 'react-markdown';

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
  lessons: Lesson[];
}

export default function LessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get('level');

  const [module, setModule] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fallback: jika token tidak ada di localStorage, coba ambil dari cookie
    let token = localStorage.getItem('token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      if (match) {
        token = match[1];
        localStorage.setItem('token', token);
      }
    }
    if (!level) {
      setError('Missing level parameter');
      setLoading(false);
      return;
    }
    fetchLessonData(token);
  }, [resolvedParams.id, resolvedParams.lessonId, level]);

  const fetchLessonData = async (tokenParam?: string) => {
    try {
      const token = tokenParam || localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      // Fetch module
      const moduleRes = await fetch(`/api/academy/modules/${resolvedParams.id}?level=${level}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!moduleRes.ok) throw new Error('Failed to fetch module');
      const moduleData = await moduleRes.json();
      setModule(moduleData.module);
      // Find lesson
      const found = moduleData.module.lessons.find((l: Lesson) => l.id === resolvedParams.lessonId);
      setLesson(found || null);
      // Fetch progress
      const progressRes = await fetch('/api/academy/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        const lessonProgress = progressData.progress.find(
          (p: any) => p.moduleId === resolvedParams.id && p.lessonId === resolvedParams.lessonId && p.completed
        );
        setCompleted(!!lessonProgress);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/academy/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          moduleId: resolvedParams.id,
          lessonId: resolvedParams.lessonId,
          action: 'complete',
        }),
      });
      if (res.ok) setCompleted(true);
    } catch {}
  };

  const goToLesson = (lessonId: string) => {
    router.push(`/academy/${resolvedParams.id}/${lessonId}?level=${level}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto text-center text-white">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson || !module || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto text-center text-red-400">
          {error || 'Lesson not found'}
        </div>
        <div className="text-center mt-4">
          <Button onClick={() => router.push(`/academy/${resolvedParams.id}?level=${level}`)}>
            Back to Module
          </Button>
        </div>
      </div>
    );
  }

  // Find next/prev lesson
  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);
  const idx = sortedLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = idx > 0 ? sortedLessons[idx - 1] : null;
  const nextLesson = idx < sortedLessons.length - 1 ? sortedLessons[idx + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => router.push(`/academy/${resolvedParams.id}?level=${level}`)} className="mb-6 bg-white/10 hover:bg-white/20">
          ← Back to Module
        </Button>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <div className="p-6">
            <Badge className="mb-2 border bg-purple-500/10 text-purple-400 border-purple-500/30">
              Lesson {lesson.order} / {module.lessons.length}
            </Badge>
            <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-400 text-sm">Estimated: {lesson.estimatedMinutes} min</span>
              {completed && <span className="text-green-400 text-sm font-medium">✅ Completed</span>}
            </div>
            {/* Image */}
            {lesson.imageUrl && (
              <div className="mb-4">
                <img src={lesson.imageUrl} alt="Lesson visual" className="rounded-lg max-h-72 mx-auto" />
              </div>
            )}
            {/* Video */}
            {lesson.videoUrl && (
              <div className="mb-4">
                <iframe
                  src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                  title="Lesson Video"
                  className="w-full aspect-video rounded-lg"
                  allowFullScreen
                />
              </div>
            )}
            {/* Markdown Content */}
            <div className="prose prose-invert max-w-none mb-6">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
            {/* Mark as Complete */}
            {!completed && (
              <Button onClick={markAsComplete} className="bg-green-600 hover:bg-green-700">
                Mark as Complete
              </Button>
            )}
          </div>
        </Card>
        {/* Navigation */}
        <div className="flex justify-between">
          {prevLesson ? (
            <Button onClick={() => goToLesson(prevLesson.id)} className="bg-white/10 hover:bg-white/20">
              ← Previous
            </Button>
          ) : <div />}
          {nextLesson ? (
            <Button onClick={() => goToLesson(nextLesson.id)} className="bg-white/10 hover:bg-white/20">
              Next →
            </Button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
