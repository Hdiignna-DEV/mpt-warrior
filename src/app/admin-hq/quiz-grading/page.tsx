/**
 * Admin HQ - Quiz Grading Dashboard
 * SUPER_ADMIN only page for grading essay answers
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCardSkeleton, EssayCardSkeleton } from '@/components/ui/Skeleton';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  FileText,
  Send,
  AlertCircle,
  BookOpen,
  Trophy
} from 'lucide-react';

interface UngradedEssay {
  id: string;
  userId: string;
  userName: string;
  questionId: string;
  moduleId: string;
  questionText: string;
  userAnswer: string;
  submittedAt: string;
  questionPoints: number;
}

interface UserEssayGroup {
  userName: string;
  userId: string;
  essays: UngradedEssay[];
  totalEssays: number;
  totalPoints: number;
}

interface GradingFormData {
  score: number | '';
  feedback: string;
}

export default function QuizGradingPage() {
  const router = useRouter();
  const [essays, setEssays] = useState<UngradedEssay[]>([]);
  const [groupedEssays, setGroupedEssays] = useState<UserEssayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradingEssayId, setGradingEssayId] = useState<string | null>(null);
  const [gradingData, setGradingData] = useState<Record<string, GradingFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('mpt_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'SUPER_ADMIN') {
        router.push('/access-denied');
        return;
      }
      
      // User is SUPER_ADMIN, proceed to fetch data
      fetchUngradedEssays();
    } catch (err) {
      console.error('Error parsing user data:', err);
      router.push('/login');
      return;
    }
  }, [router]);

  const fetchUngradedEssays = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('mpt_token');
      
      const response = await fetch('/api/admin/quiz/ungraded', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ungraded essays');
      }

      const data = await response.json();
      setEssays(data.essays || []);
      
      // Group essays by userName
      const groups = groupEssaysByUser(data.essays || []);
      setGroupedEssays(groups);
      
      // Initialize grading data
      const initialGradingData: Record<string, GradingFormData> = {};
      data.essays.forEach((essay: UngradedEssay) => {
        initialGradingData[essay.id] = {
          score: '',
          feedback: ''
        };
      });
      setGradingData(initialGradingData);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Group essays by userName
  const groupEssaysByUser = (essays: UngradedEssay[]): UserEssayGroup[] => {
    const grouped = new Map<string, UngradedEssay[]>();
    
    essays.forEach(essay => {
      const key = essay.userId; // Group by userId to get unique users
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(essay);
    });

    // Convert to array and sort by user name
    return Array.from(grouped.entries())
      .map(([userId, userEssays]) => ({
        userName: userEssays[0].userName, // All essays in group have same userName
        userId: userId,
        essays: userEssays.sort((a, b) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ), // Sort by submission date (newest first)
        totalEssays: userEssays.length,
        totalPoints: userEssays.reduce((sum, e) => sum + (e.questionPoints || 0), 0),
      }))
      .sort((a, b) => a.userName.localeCompare(b.userName)); // Sort groups alphabetically by name
  };

  const handleGradeSubmit = async (essay: UngradedEssay) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('mpt_token');
      const grading = gradingData[essay.id];

      if (!grading || grading.score === '' || grading.score === undefined) {
        alert('Please enter a score');
        setSubmitting(false);
        return;
      }

      if (grading.score < 0 || grading.score > (essay.questionPoints || 0)) {
        alert(`Score must be between 0 and ${essay.questionPoints || 0}`);
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/admin/quiz/grade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: essay.userId,
          questionId: essay.questionId,
          score: grading.score,
          feedback: grading.feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to grade essay');
      }

      // Remove graded essay from list
      const updatedEssays = essays.filter(e => e.id !== essay.id);
      setEssays(updatedEssays);
      
      // Regroup remaining essays
      const groups = groupEssaysByUser(updatedEssays);
      setGroupedEssays(groups);
      
      setGradingEssayId(null);
      
      alert('Essay graded successfully!');
      setSubmitting(false);
    } catch (err: any) {
      alert('Error grading essay: ' + err.message);
      setSubmitting(false);
    }
  };

  const updateGradingData = (essayId: string, field: keyof GradingFormData, value: string | number) => {
    setGradingData(prev => ({
      ...prev,
      [essayId]: {
        ...prev[essayId],
        [field]: value
      }
    }));
  };

  const getModuleBadgeColor = (moduleId: string) => {
    if (!moduleId) return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    if (moduleId.includes('module-1')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (moduleId.includes('module-2')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (moduleId.includes('module-3')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-slate-700 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-10 bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Essays Skeleton */}
          <div className="space-y-6">
            <EssayCardSkeleton />
            <EssayCardSkeleton />
            <EssayCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Quiz Grading Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Review and grade student essay answers
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">{essays.length}</p>
                <p className="text-sm text-gray-400">Pending Essays</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {groupedEssays.length}
                </p>
                <p className="text-sm text-gray-400">Students with Pending</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {essays.reduce((sum, e) => sum + (e.questionPoints || 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Total Points</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Essays List - Grouped by User */}
        {groupedEssays.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400">No pending essay answers to grade at the moment.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Summary by User Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedEssays.map((group) => (
                <Card 
                  key={group.userId}
                  className="bg-white/5 border-white/10 p-4 cursor-pointer hover:bg-white/10 transition-all"
                  onClick={() => setExpandedUser(expandedUser === group.userId ? null : group.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{group.userName}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {group.totalEssays} essay{group.totalEssays !== 1 ? 's' : ''} pending
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-400">
                        {group.totalPoints}
                      </div>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Detailed Essays by User */}
            {groupedEssays.map((group) => (
              <div 
                key={group.userId}
                className={`overflow-hidden transition-all ${
                  expandedUser === group.userId ? 'block' : 'hidden'
                }`}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-amber-400" />
                    {group.userName}
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-2">
                      {group.totalEssays} pending
                    </Badge>
                  </h2>

                  <div className="space-y-4">
                    {group.essays.map((essay) => (
                      <Card
                        key={essay.id}
                        className="bg-white/5 backdrop-blur-sm border-white/10 p-6"
                      >
                        {/* Essay Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getModuleBadgeColor(essay.moduleId)} border`}>
                                {essay.moduleId ? essay.moduleId.toUpperCase() : 'UNKNOWN'}
                              </Badge>
                              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                {essay.questionPoints || 0} points
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Submitted: {essay.submittedAt ? formatDate(essay.submittedAt) : 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Question */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Question:</h4>
                          <p className="text-white leading-relaxed">{essay.questionText || 'No question text'}</p>
                        </div>

                        {/* Student Answer */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Student Answer:</h4>
                          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {essay.userAnswer || 'No answer provided'}
                            </p>
                          </div>
                        </div>

                        {/* Grading Form */}
                        {gradingEssayId === essay.id ? (
                          <div className="space-y-4 bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                            {/* Score Input */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-400 mb-2">
                                Score (0 - {essay.questionPoints} points):
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={essay.questionPoints}
                                value={gradingData[essay.id]?.score ?? ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? '' : parseInt(e.target.value);
                                  updateGradingData(essay.id, 'score', value);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                                placeholder="Enter score"
                              />
                            </div>

                            {/* Feedback Input */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-400 mb-2">
                                Feedback (optional):
                              </label>
                              <textarea
                                rows={4}
                                value={gradingData[essay.id]?.feedback || ''}
                                onChange={(e) => updateGradingData(essay.id, 'feedback', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                                placeholder="Provide constructive feedback to the student..."
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleGradeSubmit(essay)}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                <Send className="w-4 h-4" />
                                {submitting ? 'Submitting...' : 'Submit Grade'}
                              </button>
                              
                              <button
                                onClick={() => setGradingEssayId(null)}
                                disabled={submitting}
                                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setGradingEssayId(essay.id)}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                          >
                            <FileText className="w-4 h-4" />
                            Grade This Essay
                          </button>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
