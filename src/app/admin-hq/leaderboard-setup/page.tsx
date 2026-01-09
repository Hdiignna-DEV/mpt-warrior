'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, AlertCircle, Loader, ChevronRight } from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  action: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function LeaderboardSetupPage() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'containers',
      title: '1️⃣ Create Leaderboard Containers',
      description: 'Setup user-leaderboard and leaderboard-history containers in Cosmos DB',
      action: 'setupContainers',
      status: 'pending'
    },
    {
      id: 'rankings',
      title: '2️⃣ Initialize Rankings',
      description: 'Calculate scores for all users and populate leaderboard',
      action: 'initializeRankings',
      status: 'pending'
    },
    {
      id: 'scheduler',
      title: '3️⃣ Start Auto-Scheduler',
      description: 'Enable hourly automatic leaderboard updates',
      action: 'startScheduler',
      status: 'pending'
    }
  ]);

  const handleAction = async (stepId: string, action: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'loading' } : s));

    try {
      let url = '';
      let method = 'POST';
      let body = {};

      if (action === 'setupContainers') {
        url = '/api/admin/setup-leaderboard';
      } else if (action === 'initializeRankings') {
        url = '/api/admin/initialize-leaderboard';
      } else if (action === 'startScheduler') {
        url = '/api/admin/schedule-leaderboard';
        body = { action: 'start', intervalMinutes: 60 };
      }

      const token = localStorage.getItem('mpt_token');
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setSteps(prev => prev.map(s => 
          s.id === stepId 
            ? { ...s, status: 'success', message: data.message || 'Completed successfully' }
            : s
        ));
      } else {
        setSteps(prev => prev.map(s => 
          s.id === stepId 
            ? { ...s, status: 'error', message: data.error || 'Request failed' }
            : s
        ));
      }
    } catch (error: any) {
      setSteps(prev => prev.map(s => 
        s.id === stepId 
          ? { ...s, status: 'error', message: error.message || 'An error occurred' }
          : s
      ));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <ChevronRight className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            🚀 Leaderboard Setup
          </h1>
          <p className="text-gray-600">
            Initialize the Warrior Leaderboard System in 3 simple steps
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step.status === 'success' ? 'bg-green-500 text-white' : 
                  step.status === 'error' ? 'bg-red-500 text-white' :
                  step.status === 'loading' ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-white'}`}>
                {step.status === 'success' ? '✓' : idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded
                  ${step.status === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={step.id} className={`p-6 border-2 transition ${getStatusColor(step.status)}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(step.status)}
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  {step.message && (
                    <div className={`text-sm p-3 rounded-lg mt-3
                      ${step.status === 'success' ? 'bg-green-100 text-green-800' :
                        step.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {step.status === 'loading' && '⏳ Processing...'}
                      {step.status === 'success' && '✅ ' + step.message}
                      {step.status === 'error' && '❌ ' + step.message}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleAction(step.id, step.action)}
                  disabled={step.status === 'loading' || step.status === 'success'}
                  className={`flex-shrink-0 whitespace-nowrap
                    ${step.status === 'success' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : step.status === 'error'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {step.status === 'loading' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : step.status === 'success' ? (
                    'Done ✓'
                  ) : step.status === 'error' ? (
                    'Retry'
                  ) : (
                    'Run'
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="p-6 bg-blue-50 border-blue-200 space-y-3">
          <h4 className="font-bold text-blue-900">ℹ️ What happens in each step:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ <strong>Step 1:</strong> Creates 2 containers in Cosmos DB (user-leaderboard, leaderboard-history)</li>
            <li>✓ <strong>Step 2:</strong> Calculates scores for all warriors and generates rankings</li>
            <li>✓ <strong>Step 3:</strong> Enables automatic hourly updates of the leaderboard</li>
          </ul>
        </Card>

        {/* After Setup */}
        <Card className="p-6 bg-green-50 border-green-200 space-y-3">
          <h4 className="font-bold text-green-900">✅ After Setup Complete:</h4>
          <p className="text-sm text-green-800">
            All users can now access:
          </p>
          <ul className="space-y-2 text-sm text-green-800 ml-4">
            <li>📊 <strong>/leaderboard</strong> - View top 100 warriors and your rank</li>
            <li>📈 <strong>/school-report/[userId]</strong> - Detailed skill assessment</li>
            <li>🎯 <strong>Arka Feedback</strong> - Mascot motivation popup on leaderboard</li>
          </ul>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>Only Super Admin can access this page. Proceed with caution! 🛡️</p>
        </div>
      </div>
    </div>
  );
}
