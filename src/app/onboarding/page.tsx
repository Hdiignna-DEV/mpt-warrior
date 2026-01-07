/**
 * Onboarding Flow
 * Multi-step wizard for new users after registration
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Upload,
  Target,
  TrendingUp,
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { showToast } from '@/utils/toast';

type Step = 'avatar' | 'goal' | 'strategy' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('avatar');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [avatar, setAvatar] = useState('');
  const [personalGoal, setPersonalGoal] = useState('');
  const [tradingStrategy, setTradingStrategy] = useState<'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'POSITION_TRADING'>('DAY_TRADING');
  const [preferredTimeframe, setPreferredTimeframe] = useState('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const completeOnboarding = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('mpt_token');

      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar,
          personalGoal,
          tradingStrategy,
          preferredTimeframe
        })
      });

      if (response.ok) {
        setCurrentStep('complete');
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        showToast('Failed to complete onboarding', 'error');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      showToast('Error completing onboarding', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'avatar':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-500/20 mb-4">
                <UserIcon className="w-8 h-8 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, Warrior! 🎯
              </h2>
              <p className="text-gray-400">
                Let's set up your profile. First, choose your avatar.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Avatar Preview */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <label className="w-full cursor-pointer">
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-sky-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">
                    {avatar ? 'Change photo' : 'Upload your photo'}
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF (max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setCurrentStep('goal')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-semibold"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentStep('goal')}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What's Your Trading Goal? 🎯
              </h2>
              <p className="text-gray-400">
                Set your personal trading goal to stay motivated.
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={personalGoal}
                onChange={(e) => setPersonalGoal(e.target.value)}
                placeholder="Example: Make $10,000 profit this year while maintaining 65% win rate..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('avatar')}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('strategy')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setCurrentStep('strategy')}
                className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Choose Your Trading Style 📊
              </h2>
              <p className="text-gray-400">
                Select your preferred trading strategy and timeframe.
              </p>
            </div>

            <div className="space-y-4">
              {/* Trading Strategy */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trading Strategy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'SCALPING', label: 'Scalping', emoji: '⚡' },
                    { value: 'DAY_TRADING', label: 'Day Trading', emoji: '📈' },
                    { value: 'SWING_TRADING', label: 'Swing Trading', emoji: '🌊' },
                    { value: 'POSITION_TRADING', label: 'Position Trading', emoji: '🎯' }
                  ].map((strategy) => (
                    <button
                      key={strategy.value}
                      onClick={() => setTradingStrategy(strategy.value as any)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tradingStrategy === strategy.value
                          ? 'border-sky-500 bg-sky-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{strategy.emoji}</div>
                      <div className="text-sm font-medium text-white">
                        {strategy.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Timeframe */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Preferred Timeframe
                </label>
                <input
                  type="text"
                  value={preferredTimeframe}
                  onChange={(e) => setPreferredTimeframe(e.target.value)}
                  placeholder="e.g., 1H, 4H, 1D"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCurrentStep('goal')}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={completeOnboarding}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                >
                  <Check className="w-5 h-5" />
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-4">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              All Set, Warrior! 🎉
            </h2>
            <p className="text-gray-400 text-lg">
              Your profile has been created successfully.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ Badge level assigned: <span className="text-emerald-400 font-semibold">Recruit</span></p>
              <p>✓ Warrior ID generated</p>
              <p>✓ Discipline score initialized</p>
            </div>
            <div className="pt-6">
              <p className="text-gray-400">Redirecting to dashboard...</p>
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        {/* Progress Indicator */}
        {currentStep !== 'complete' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">
                Step {currentStep === 'avatar' ? 1 : currentStep === 'goal' ? 2 : 3} of 3
              </span>
              <span className="text-sm font-medium text-gray-400">
                {currentStep === 'avatar' ? '33%' : currentStep === 'goal' ? '66%' : '100%'}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-purple-500 transition-all duration-500"
                style={{
                  width: currentStep === 'avatar' ? '33%' : currentStep === 'goal' ? '66%' : '100%'
                }}
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-8">
          {renderStep()}
        </Card>

      </div>
    </div>
  );
}
