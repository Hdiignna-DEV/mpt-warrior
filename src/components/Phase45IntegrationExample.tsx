/**
 * Phase 4 & 5 Integration Example
 * Demonstrates leaderboard auto-update with email notifications
 * Shows complete flow: score → leaderboard → notifications
 */

'use client';

import { useState } from 'react';
import { useLeaderboardAutoUpdate, useLeaderboardStats } from '@/hooks/useLeaderboardAutoUpdate';
import { useNotificationTriggers, useCoordinatedNotifications } from '@/hooks/useNotificationTriggers';
import { LeaderboardWithAutoUpdate } from '@/components/LeaderboardWithAutoUpdate';
import { Trophy, Mail, TrendingUp, Zap } from 'lucide-react';

interface IntegrationExampleProps {
  userId?: string;
}

/**
 * Phase 4 & 5 Integration Example
 */
export function Phase45IntegrationExample({ userId = 'user-123' }: IntegrationExampleProps) {
  const [simulationMode, setSimulationMode] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [stats, setStats] = useState({
    quizPercentage: 85,
    messagesThisWeek: 15,
    currentStreak: 7,
    achievements: ['first_quiz', 'week_warrior'],
  });

  // Hooks
  const { updateOnEvent } = useLeaderboardAutoUpdate();
  const { getUserStats } = useLeaderboardStats();
  const { notifyQuizCompletion, notifyTopThreeEntry, notifyRankChange } = useNotificationTriggers();
  const { handleQuizCompletion, handleLeaderboardUpdate } = useCoordinatedNotifications();

  /**
   * Log event
   */
  const logEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  /**
   * Simulate quiz completion
   */
  const simulateQuizCompletion = async () => {
    logEvent('📝 Quiz completion triggered...');

    // Step 1: Update quiz score
    const newQuizPercentage = Math.min(100, stats.quizPercentage + 10);
    const newStats = {
      ...stats,
      quizPercentage: newQuizPercentage,
    };
    setStats(newStats);
    logEvent(`✅ Quiz score updated: ${stats.quizPercentage}% → ${newQuizPercentage}%`);

    // Step 2: Update leaderboard
    logEvent('📊 Updating leaderboard score...');
    try {
      await updateOnEvent({
        eventType: 'quiz_complete',
        quizPercentage: newQuizPercentage,
        quizTitle: 'Advanced Algorithms Quiz',
      }, userId);
      logEvent('🎯 Leaderboard updated successfully');
    } catch (error) {
      logEvent('❌ Leaderboard update failed');
    }

    // Step 3: Send notification
    logEvent('📧 Sending quiz completion email...');
    const recipient = {
      userId,
      email: 'user@example.com',
      userName: 'Champion',
    };

    const success = await handleQuizCompletion(recipient, {
      title: 'Advanced Algorithms Quiz',
      score: newQuizPercentage,
      percentage: newQuizPercentage,
      passed: newQuizPercentage >= 70,
    });

    if (success) {
      logEvent('✉️ Quiz completion email sent');
    } else {
      logEvent('⚠️ Email notification skipped (already sent or low score)');
    }

    // Step 4: Fetch updated stats
    logEvent('📈 Fetching updated leaderboard position...');
    const userStats = await getUserStats(userId);
    if (userStats) {
      logEvent(`🏆 Your new rank: #${userStats.rank} (${userStats.totalScore} points)`);
    }
  };

  /**
   * Simulate chat activity
   */
  const simulateChatActivity = async () => {
    logEvent('💬 Chat activity increase...');

    const newMessages = Math.min(30, stats.messagesThisWeek + 3);
    const newStats = {
      ...stats,
      messagesThisWeek: newMessages,
    };
    setStats(newStats);
    logEvent(`✅ Messages this week: ${stats.messagesThisWeek} → ${newMessages}`);

    logEvent('📊 Updating leaderboard score...');
    try {
      await updateOnEvent({
        eventType: 'streak_milestone',
        streakDays: newMessages,
      }, userId);
      logEvent('🎯 Leaderboard updated');
    } catch (error) {
      logEvent('❌ Update failed');
    }
  };

  /**
   * Simulate achievement unlock
   */
  const simulateAchievementUnlock = async () => {
    logEvent('🏆 Achievement unlock triggered...');

    const achievements = [
      'perfect_score',
      'chat_master',
      'consistency_champion',
      'speed_racer',
    ];
    const newAchievement = achievements[Math.floor(Math.random() * achievements.length)];

    const newStats = {
      ...stats,
      achievements: [...new Set([...stats.achievements, newAchievement])],
    };
    setStats(newStats);
    logEvent(`✅ New achievement unlocked: ${newAchievement}`);

    logEvent('📊 Updating leaderboard score...');
    try {
      await updateOnEvent({
        eventType: 'achievement',
        achievement: newAchievement,
      }, userId);
      logEvent('🎯 Leaderboard updated');
    } catch (error) {
      logEvent('❌ Update failed');
    }
  };

  /**
   * Simulate streak milestone
   */
  const simulateStreakMilestone = async () => {
    logEvent('🔥 Streak milestone...');

    const newStreak = Math.min(365, stats.currentStreak + 1);
    const newStats = {
      ...stats,
      currentStreak: newStreak,
    };
    setStats(newStats);
    logEvent(`✅ Streak extended: ${stats.currentStreak} → ${newStreak} days`);

    logEvent('📊 Updating leaderboard score...');
    try {
      await updateOnEvent({
        eventType: 'streak_milestone',
        streakDays: newStreak,
      }, userId);
      logEvent('🎯 Leaderboard updated');
    } catch (error) {
      logEvent('❌ Update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Zap size={32} />
          Phase 4 & 5 Integration Demo
        </h2>
        <p className="text-purple-100">
          Leaderboard Auto-Update + Email Notifications in Real-Time
        </p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Quiz Score"
          value={`${stats.quizPercentage}%`}
          color="bg-blue-500/20 border-blue-500"
        />
        <StatCard
          label="Chat Messages"
          value={`${stats.messagesThisWeek}/30`}
          color="bg-green-500/20 border-green-500"
        />
        <StatCard
          label="Current Streak"
          value={`${stats.currentStreak}d`}
          color="bg-orange-500/20 border-orange-500"
        />
        <StatCard
          label="Achievements"
          value={stats.achievements.length}
          color="bg-purple-500/20 border-purple-500"
        />
      </div>

      {/* Simulation Controls */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Event Simulation</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <button
            onClick={simulateQuizCompletion}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trophy size={20} />
            Complete Quiz
          </button>
          <button
            onClick={simulateChatActivity}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            Chat Activity
          </button>
          <button
            onClick={simulateAchievementUnlock}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trophy size={20} />
            Unlock Achievement
          </button>
          <button
            onClick={simulateStreakMilestone}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            +1 Streak Day
          </button>
        </div>

        {/* Mode toggle */}
        <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={simulationMode}
            onChange={(e) => setSimulationMode(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Enable Demo Mode (Auto-refresh leaderboard)</span>
        </label>
      </div>

      {/* Event Log */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Mail size={24} />
          Event Log
        </h3>
        <div className="space-y-2 font-mono text-sm max-h-64 overflow-y-auto">
          {eventLog.length === 0 ? (
            <div className="text-slate-500">
              Trigger events above to see real-time updates...
            </div>
          ) : (
            eventLog.map((event, index) => (
              <div key={index} className="text-slate-300 border-b border-slate-700 pb-2">
                {event}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <LeaderboardWithAutoUpdate
          userId={userId}
          refreshInterval={simulationMode ? 5000 : 30000}
          limit={10}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="Phase 4: Leaderboard Auto-Update"
          items={[
            'Score calculation (Quiz + Chat + Streak + Achievements)',
            'Weekly ISO week-based rankings',
            'Rank change tracking',
            'Top 3 entry detection',
          ]}
        />
        <InfoCard
          title="Phase 5: Email Notifications"
          items={[
            'Quiz completion emails',
            'Top 3 entry celebrations',
            'Rank change alerts',
            'Weekly ranking summaries',
            'Achievement unlock emails',
          ]}
        />
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`${color} border rounded-lg p-4 text-center`}>
      <p className="text-sm text-slate-400 mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

/**
 * Info Card Component
 */
function InfoCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h4 className="font-bold text-white mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-green-400 mt-1">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
