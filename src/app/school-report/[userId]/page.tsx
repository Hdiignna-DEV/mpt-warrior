'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RadarChart } from '@/components/RadarChart';
import { Trophy, TrendingUp, Target, Award, BookOpen, Brain } from 'lucide-react';

interface SchoolReport {
  userId: string;
  userName: string;
  email: string;
  badge: string;
  totalPoints: number;
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  winRate: number;
  rank: number;
  skills: {
    technicalAnalysis: number;
    riskManagement: number;
    tradingPsychology: number;
    discipline: number;
    knowledge: number;
  };
  mentorNotes: string;
  generatedAt: string;
}

export default function SchoolReportPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const userId = params?.userId as string;

  const [report, setReport] = useState<SchoolReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !userId) {
      setLoading(false);
      return;
    }

    fetchReport();
  }, [userId, authLoading]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch(`/api/school-report/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      } else if (response.status === 403) {
        setError('You do not have permission to view this report.');
      } else if (response.status === 404) {
        setError('User not found.');
      } else {
        setError('Failed to load report.');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('An error occurred while loading the report.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading school report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-8">
          <p className="text-center text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-8">
          <p className="text-center text-gray-600">No report available.</p>
        </Card>
      </div>
    );
  }

  const radarData = [
    { label: 'Technical Analysis', value: report.skills.technicalAnalysis, color: '#3b82f6' },
    { label: 'Risk Management', value: report.skills.riskManagement, color: '#ef4444' },
    { label: 'Trading Psychology', value: report.skills.tradingPsychology, color: '#8b5cf6' },
    { label: 'Discipline', value: report.skills.discipline, color: '#10b981' },
    { label: 'Knowledge', value: report.skills.knowledge, color: '#f59e0b' }
  ];

  const badgeColor = {
    'Legendary Mentor': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Commander': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Elite Warrior': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Recruit': 'bg-green-500/20 text-green-400 border-green-500/30'
  }[report.badge] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            📊 School Report
          </h1>
          <p className="text-gray-600">Performance Assessment for {report.userName}</p>
        </div>

        {/* User Info Card */}
        <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-2xl font-bold text-gray-900">{report.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Badge</p>
              <Badge className={badgeColor}>{report.badge}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Rank</p>
              <p className="text-2xl font-bold text-blue-600">#{report.rank}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-2xl font-bold text-purple-600">{report.totalPoints}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-green-600">{report.winRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-sm text-gray-500 truncate">{report.email}</p>
            </div>
          </div>
        </Card>

        {/* Points Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Quiz Points</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{report.quizPoints}</p>
            <p className="text-sm text-gray-600">From module assessments</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold text-gray-900">Consistency Points</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{report.consistencyPoints}</p>
            <p className="text-sm text-gray-600">Daily journal entries</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="font-semibold text-gray-900">Community Points</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600">{report.communityPoints}</p>
            <p className="text-sm text-gray-600">Discussions & engagement</p>
          </Card>
        </div>

        {/* Skill Assessment Radar Chart */}
        <Card className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">📈 Skill Assessment</h2>
          <p className="text-gray-600">Your proficiency across 5 key dimensions</p>
          
          <div className="flex justify-center">
            <RadarChart data={radarData} title="" size={400} />
          </div>

          {/* Skill Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900">Technical Analysis</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{report.skills.technicalAnalysis}%</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-900">Risk Management</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{report.skills.riskManagement}%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900">Trading Psychology</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{report.skills.tradingPsychology}%</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-semibold text-green-900">Discipline</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{report.skills.discipline}%</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="font-semibold text-amber-900">Knowledge</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">{report.skills.knowledge}%</p>
            </div>
          </div>
        </Card>

        {/* Mentor Notes */}
        <Card className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">💡 Mentor Notes</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {report.mentorNotes}
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Report generated: {new Date(report.generatedAt).toLocaleString()}
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            🖨️ Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
