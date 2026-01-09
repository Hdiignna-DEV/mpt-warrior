/**
 * Education Service - MPT Academy
 * Handles educational modules and user progress
 */

import { Container } from '@azure/cosmos';
import { getCosmosClient } from './cosmos-client';

// Types
export type Level = 'RECRUIT' | 'WARRIOR' | 'VETERAN';

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown format
  imageUrl: string | null;
  videoUrl: string | null;
  order: number;
  estimatedMinutes: number;
}

export interface EducationalModule {
  id: string;
  level: Level;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  prerequisites: string[]; // Module IDs
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number; // minutes
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserModuleProgress {
  moduleId: string;
  totalLessons: number;
  completedLessons: number;
  progress: number; // percentage
  lastAccessedAt: string;
}

// Quiz Types
export type QuizQuestionType = 'multiple-choice' | 'essay' | 'true-false';

export interface QuizQuestion {
  id: string;
  moduleId: string;
  type: QuizQuestionType;
  question: string;
  options?: string[]; // For multiple-choice and true-false
  correctAnswer?: number | null; // Index for MC/TF, null for essay
  points: number;
  order: number;
}

export interface UserQuizAnswer {
  id: string;
  userId: string;
  moduleId: string;
  questionId: string;
  answer: string; // User's answer (text or option index as string)
  score: number | null; // null = not graded yet
  feedback: string | null; // Admin feedback
  gradedBy: string | null; // Admin userId
  gradedAt: string | null;
  submittedAt: string;
}

export interface QuizScore {
  moduleId: string;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  gradedQuestions: number;
  totalQuestions: number;
  isPassed: boolean; // >= 70%
}

// Get containers
function getModulesContainer(): Container {
  const client = getCosmosClient();
  return client.database('mpt-warrior').container('educational-modules');
}

function getProgressContainer(): Container {
  const client = getCosmosClient();
  return client.database('mpt-warrior').container('user-progress');
}

function getQuizQuestionsContainer(): Container {
  const client = getCosmosClient();
  return client.database('mpt-warrior').container('quiz-questions');
}

function getQuizAnswersContainer(): Container {
  const client = getCosmosClient();
  return client.database('mpt-warrior').container('quiz-answers');
}

// ============================================
// EDUCATIONAL MODULES OPERATIONS
// ============================================

/**
 * Get all modules for a specific level
 */
export async function getModulesByLevel(level: Level): Promise<EducationalModule[]> {
  const container = getModulesContainer();
  
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.level = @level ORDER BY c["order"] ASC',
      parameters: [{ name: '@level', value: level }],
    })
    .fetchAll();

  return resources;
}

/**
 * Get all modules (all levels)
 */
export async function getAllModules(): Promise<EducationalModule[]> {
  const container = getModulesContainer();
  
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c ORDER BY c.level ASC, c["order"] ASC',
    })
    .fetchAll();

  return resources;
}

/**
 * Get single module by ID
 */
export async function getModuleById(moduleId: string, level: Level): Promise<EducationalModule | null> {
  const container = getModulesContainer();
  
  try {
    const { resource } = await container.item(moduleId, level).read<EducationalModule>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) return null;
    throw error;
  }
}

/**
 * Create new educational module (Admin only)
 */
export async function createModule(moduleData: Omit<EducationalModule, 'createdAt' | 'updatedAt'>): Promise<EducationalModule> {
  const container = getModulesContainer();
  
  const newModule: EducationalModule = {
    ...moduleData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(newModule);
  return resource!;
}

/**
 * Update existing module (Admin only)
 */
export async function updateModule(
  moduleId: string,
  level: Level,
  updates: Partial<Omit<EducationalModule, 'id' | 'level' | 'createdAt'>>
): Promise<EducationalModule> {
  const container = getModulesContainer();
  
  const existing = await getModuleById(moduleId, level);
  if (!existing) {
    throw new Error('Module not found');
  }

  const updated: EducationalModule = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(moduleId, level).replace(updated);
  return resource!;
}

/**
 * Delete module (Admin only)
 */
export async function deleteModule(moduleId: string, level: Level): Promise<void> {
  const container = getModulesContainer();
  await container.item(moduleId, level).delete();
}

// ============================================
// USER PROGRESS OPERATIONS
// ============================================

/**
 * Get user's progress for all modules
 */
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const container = getProgressContainer();
  
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c["lastAccessedAt"] DESC',
      parameters: [{ name: '@userId', value: userId }],
    })
    .fetchAll();

  return resources;
}

/**
 * Get user's progress for specific module
 */
export async function getModuleProgress(userId: string, moduleId: string): Promise<UserProgress[]> {
  const container = getProgressContainer();
  
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.moduleId = @moduleId',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@moduleId', value: moduleId },
      ],
    })
    .fetchAll();

  return resources;
}

/**
 * Mark lesson as completed
 */
export async function markLessonComplete(
  userId: string,
  moduleId: string,
  lessonId: string,
  timeSpent: number = 0
): Promise<UserProgress> {
  const container = getProgressContainer();
  
  const progressId = `${userId}-${moduleId}-${lessonId}`;
  
  // Check if progress already exists
  try {
    const { resource: existing } = await container.item(progressId, userId).read<UserProgress>();
    
    if (existing && existing.completed) {
      // Already completed, just update timeSpent
      const updated: UserProgress = {
        ...existing,
        timeSpent: existing.timeSpent + timeSpent,
        lastAccessedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const { resource } = await container.item(progressId, userId).replace(updated);
      return resource!;
    }
  } catch (error: any) {
    // Progress doesn't exist, create new
  }

  const newProgress: UserProgress = {
    id: progressId,
    userId,
    moduleId,
    lessonId,
    completed: true,
    completedAt: new Date().toISOString(),
    timeSpent,
    lastAccessedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(newProgress);
  return resource!;
}

/**
 * Update last accessed time for lesson
 */
export async function updateLessonAccess(
  userId: string,
  moduleId: string,
  lessonId: string
): Promise<UserProgress> {
  const container = getProgressContainer();
  
  const progressId = `${userId}-${moduleId}-${lessonId}`;
  
  try {
    const { resource: existing } = await container.item(progressId, userId).read<UserProgress>();
    
    if (existing) {
      const updated: UserProgress = {
        ...existing,
        lastAccessedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const { resource } = await container.item(progressId, userId).replace(updated);
      return resource!;
    }
  } catch (error: any) {
    // Progress doesn't exist, create new
  }

  const newProgress: UserProgress = {
    id: progressId,
    userId,
    moduleId,
    lessonId,
    completed: false,
    completedAt: null,
    timeSpent: 0,
    lastAccessedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(newProgress);
  return resource!;
}

/**
 * Get user's module completion summary
 */
export async function getUserModuleSummary(userId: string): Promise<UserModuleProgress[]> {
  const allModules = await getAllModules();
  const userProgress = await getUserProgress(userId);
  
  const summary: UserModuleProgress[] = allModules.map(module => {
    const moduleProgressItems = userProgress.filter(p => p.moduleId === module.id);
    const completedLessons = moduleProgressItems.filter(p => p.completed).length;
    const totalLessons = module.lessons.length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    const lastAccessed = moduleProgressItems.length > 0
      ? moduleProgressItems.sort((a, b) => 
          new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
        )[0].lastAccessedAt
      : new Date().toISOString();
    
    return {
      moduleId: module.id,
      totalLessons,
      completedLessons,
      progress,
      lastAccessedAt: lastAccessed,
    };
  });

  return summary;
}

// ============================================
// QUIZ OPERATIONS
// ============================================

/**
 * Get all questions for a module
 */
export async function getQuizQuestions(moduleId: string): Promise<QuizQuestion[]> {
  const container = getQuizQuestionsContainer();
  
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.moduleId = @moduleId ORDER BY c["order"] ASC',
      parameters: [{ name: '@moduleId', value: moduleId }],
    })
    .fetchAll();

  return resources;
}

/**
 * Submit quiz answer (auto-grade for MC/TF, manual for essay)
 */
export async function submitQuizAnswer(
  userId: string,
  moduleId: string,
  questionId: string,
  answer: string
): Promise<UserQuizAnswer> {
  const container = getQuizAnswersContainer();
  const questionsContainer = getQuizQuestionsContainer();
  
  // Get question details
  const { resource: question } = await questionsContainer.item(questionId, moduleId).read<QuizQuestion>();
  if (!question) throw new Error('Question not found');
  
  // Auto-grade for multiple-choice and true-false
  let score: number | null = null;
  if (question.type !== 'essay' && question.correctAnswer !== null && question.correctAnswer !== undefined) {
    const userAnswerIndex = parseInt(answer);
    score = userAnswerIndex === question.correctAnswer ? question.points : 0;
  }
  
  const answerId = `${userId}-${questionId}`;
  const userAnswer: UserQuizAnswer = {
    id: answerId,
    userId,
    moduleId,
    questionId,
    answer,
    score,
    feedback: null,
    gradedBy: score !== null ? 'auto' : null,
    gradedAt: score !== null ? new Date().toISOString() : null,
    submittedAt: new Date().toISOString(),
  };

  await container.items.upsert(userAnswer);
  return userAnswer;
}

/**
 * Grade essay question (SUPER ADMIN ONLY)
 * Only users with SUPER_ADMIN role can grade quiz answers
 */
export async function gradeEssayAnswer(
  userId: string,
  questionId: string,
  score: number,
  feedback: string,
  gradedBy: string,
  graderRole: string
): Promise<UserQuizAnswer> {
  // Permission check: Only SUPER_ADMIN can grade
  if (graderRole !== 'SUPER_ADMIN') {
    throw new Error('Only SUPER_ADMIN can grade quiz answers');
  }

  const container = getQuizAnswersContainer();
  const answerId = `${userId}-${questionId}`;
  
  // Find existing answer
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.id = @id AND c.userId = @userId',
      parameters: [
        { name: '@id', value: answerId },
        { name: '@userId', value: userId },
      ],
    })
    .fetchAll();

  if (resources.length === 0) throw new Error('Answer not found');
  
  const existingAnswer = resources[0];
  const updatedAnswer: UserQuizAnswer = {
    ...existingAnswer,
    score,
    feedback,
    gradedBy,
    gradedAt: new Date().toISOString(),
  };

  await container.item(answerId, userId).replace(updatedAnswer);
  return updatedAnswer;
}

/**
 * Get user's quiz score for a module
 */
export async function getUserQuizScore(userId: string, moduleId: string): Promise<QuizScore> {
  const container = getQuizAnswersContainer();
  const questions = await getQuizQuestions(moduleId);
  
  const { resources: answers } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.moduleId = @moduleId',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@moduleId', value: moduleId },
      ],
    })
    .fetchAll();

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const gradedAnswers = answers.filter(a => a.score !== null);
  const earnedPoints = gradedAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  
  return {
    moduleId,
    totalPoints,
    earnedPoints,
    percentage,
    gradedQuestions: gradedAnswers.length,
    totalQuestions: questions.length,
    isPassed: percentage >= 70,
  };
}

/**
 * Get user's answers for a module (with questions)
 */
export async function getUserQuizAnswers(userId: string, moduleId: string) {
  const container = getQuizAnswersContainer();
  const questions = await getQuizQuestions(moduleId);
  
  const { resources: answers } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.moduleId = @moduleId',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@moduleId', value: moduleId },
      ],
    })
    .fetchAll();

  return questions.map(question => {
    const answer = answers.find(a => a.questionId === question.id);
    return {
      question,
      answer: answer || null,
    };
  });
}

/**
 * Get all ungraded essay answers (Admin)
 */
export async function getUngradedEssays(): Promise<Array<{ question: QuizQuestion; answer: UserQuizAnswer }>> {
  const container = getQuizAnswersContainer();
  
  const { resources: ungradedAnswers } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.score = null',
    })
    .fetchAll();

  const result = await Promise.all(
    ungradedAnswers.map(async (answer) => {
      const questionsContainer = getQuizQuestionsContainer();
      const { resource: question } = await questionsContainer
        .item(answer.questionId, answer.moduleId)
        .read<QuizQuestion>();
      
      return {
        question: question!,
        answer,
      };
    })
  );

  return result;
}

/**
 * Check if user can access module (prerequisites check)
 */
export async function canAccessModule(userId: string, moduleId: string, level: Level): Promise<boolean> {
  const module = await getModuleById(moduleId, level);
  if (!module) return false;
  
  // No prerequisites = always accessible
  if (module.prerequisites.length === 0) return true;
  
  // Check if all prerequisites are completed
  const userProgress = await getUserProgress(userId);
  
  for (const prereqId of module.prerequisites) {
    // Use getModuleById to ensure we get complete module with lessons
    const prereqModule = await getModuleById(prereqId, level);
    
    if (!prereqModule) continue;
    
    // Check if all lessons are completed
    const prereqProgress = userProgress.filter(p => p.moduleId === prereqId && p.completed);
    const totalLessons = prereqModule.lessons?.length || 0;
    
    if (totalLessons === 0) {
      // If module has no lessons, skip to quiz check
      console.warn(`Module ${prereqId} has no lessons`);
    } else if (prereqProgress.length < totalLessons) {
      console.log(`User ${userId} missing lessons for module ${prereqId}: ${prereqProgress.length}/${totalLessons}`);
      return false; // Prerequisite lessons not fully completed
    }
    
    // Check if quiz is passed (>= 70%)
    const quizScore = await getUserQuizScore(userId, prereqId);
    if (!quizScore.isPassed) {
      console.log(`User ${userId} quiz not passed for module ${prereqId}: ${quizScore.percentage}%`);
      return false; // Quiz not passed
    }
  }
  
  return true;
}
// ==================== LEADERBOARD SYSTEM ====================

export interface LeaderboardEntry {
  id: string;
  userId: string;
  email: string;
  userName: string;
  totalPoints: number;
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  badge: 'Recruit' | 'Elite Warrior' | 'Commander' | 'Legendary Mentor';
  winRate: number;
  rank: number;
  previousRank: number | null;
  rankTrend: 'UP' | 'DOWN' | 'STABLE';
  lastUpdated: string;
  updatedAt: string;
}

export interface UserRankingData {
  userId: string;
  userName: string;
  email: string;
  totalPoints: number;
  rank: number;
  badge: string;
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  winRate: number;
  radarChartData: {
    technicalAnalysis: number;
    riskManagement: number;
    psychology: number;
    discipline: number;
    knowledge: number;
  };
  mentorNotes: string | null;
}

function getLeaderboardContainer(): Container {
  const database = getCosmosClient().database('mpt-db');
  return database.container('user-leaderboard');
}

function getLeaderboardHistoryContainer(): Container {
  const database = getCosmosClient().database('mpt-db');
  return database.container('leaderboard-history');
}

/**
 * Calculate leaderboard score for a user
 * Score = Quiz Points + Consistency Points + Community Points
 */
export async function calculateUserLeaderboardScore(userId: string): Promise<{
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  totalPoints: number;
  winRate: number;
}> {
  try {
    // 1. Quiz Points: Average dari semua modul quiz scores
    const allModules = await getAllModules();
    let totalQuizScore = 0;
    let quizCount = 0;

    for (const module of allModules) {
      const score = await getUserQuizScore(userId, module.id);
      if (score.percentage > 0) {
        totalQuizScore += score.percentage;
        quizCount++;
      }
    }

    const quizPoints = quizCount > 0 ? Math.round((totalQuizScore / quizCount) * 1) : 0;

    // 2. Consistency Points: 5 poin per hari menulis jurnal (max 35/minggu)
    const database = getCosmosClient().database('mpt-db');
    const tradesContainer = database.container('trades');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { resources: trades } = await tradesContainer.items
      .query({
        query: `SELECT DISTINCT DATE(c.createdAt) as tradeDate FROM c WHERE c.userId = @userId AND c.createdAt > @date`,
        parameters: [
          { name: '@userId', value: userId },
          { name: '@date', value: sevenDaysAgo.toISOString() }
        ]
      })
      .fetchAll();

    const consistencyPoints = Math.min(trades.length * 5, 35); // Max 35/minggu

    // 3. Community Points: Akan di-integrate dengan forum/discussion feature
    // For now, default 0 (dapat di-expand kemudian)
    const communityPoints = 0;

    const totalPoints = quizPoints + consistencyPoints + communityPoints;
    const winRate = quizPoints; // Simplified: using quiz score as win rate

    return {
      quizPoints,
      consistencyPoints,
      communityPoints,
      totalPoints,
      winRate
    };
  } catch (error) {
    console.error('Error calculating leaderboard score:', error);
    return {
      quizPoints: 0,
      consistencyPoints: 0,
      communityPoints: 0,
      totalPoints: 0,
      winRate: 0
    };
  }
}

/**
 * Get badge based on total points
 */
function getBadgeFromPoints(points: number): 'Recruit' | 'Elite Warrior' | 'Commander' | 'Legendary Mentor' {
  if (points >= 3001) return 'Legendary Mentor';
  if (points >= 1501) return 'Commander';
  if (points >= 501) return 'Elite Warrior';
  return 'Recruit';
}

/**
 * Update leaderboard rankings for all users
 * Should be called periodically (e.g., every hour)
 */
export async function updateLeaderboardRanking(): Promise<void> {
  try {
    const database = getCosmosClient().database('mpt-db');
    const usersContainer = database.container('users');
    const leaderboardContainer = getLeaderboardContainer();

    // Get all active users
    const { resources: users } = await usersContainer.items
      .query({
        query: `SELECT c.id, c.email, c.name FROM c WHERE c.status = 'active'`
      })
      .fetchAll();

    // Calculate scores for each user
    const leaderboardEntries: LeaderboardEntry[] = [];

    for (const user of users) {
      const scores = await calculateUserLeaderboardScore(user.id);
      const badge = getBadgeFromPoints(scores.totalPoints);

      // Get previous rank
      let previousRank = null;
      try {
        const { resource: existing } = await leaderboardContainer.item(user.id, user.id).read<LeaderboardEntry>();
        previousRank = existing?.rank || null;
      } catch {
        // User not in leaderboard yet
      }

      leaderboardEntries.push({
        id: user.id,
        userId: user.id,
        email: user.email,
        userName: user.name,
        totalPoints: scores.totalPoints,
        quizPoints: scores.quizPoints,
        consistencyPoints: scores.consistencyPoints,
        communityPoints: scores.communityPoints,
        badge,
        winRate: scores.winRate,
        rank: 0, // Will be set after sorting
        previousRank,
        rankTrend: 'STABLE',
        lastUpdated: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Sort by total points (descending)
    leaderboardEntries.sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign ranks and determine trend
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
      if (entry.previousRank === null) {
        entry.rankTrend = 'STABLE';
      } else if (entry.rank < entry.previousRank) {
        entry.rankTrend = 'UP';
      } else if (entry.rank > entry.previousRank) {
        entry.rankTrend = 'DOWN';
      } else {
        entry.rankTrend = 'STABLE';
      }
    });

    // Save/update leaderboard entries
    for (const entry of leaderboardEntries) {
      try {
        await leaderboardContainer.item(entry.id, entry.userId).replace(entry);
      } catch (error: any) {
        if (error.code === 404) {
          // Create new entry
          await leaderboardContainer.items.create(entry);
        } else {
          console.error(`Error updating leaderboard for user ${entry.userId}:`, error);
        }
      }
    }

    console.log(`✅ Leaderboard updated for ${leaderboardEntries.length} users`);
  } catch (error) {
    console.error('Error updating leaderboard ranking:', error);
  }
}

/**
 * Get top N users from leaderboard
 */
export async function getLeaderboardTop(limit: number = 100, offset: number = 0): Promise<LeaderboardEntry[]> {
  const container = getLeaderboardContainer();

  const { resources } = await container.items
    .query({
      query: `SELECT * FROM c ORDER BY c.rank ASC OFFSET @offset LIMIT @limit`,
      parameters: [
        { name: '@offset', value: offset },
        { name: '@limit', value: limit }
      ]
    })
    .fetchAll();

  return resources;
}

/**
 * Get user ranking data with radar chart information
 */
export async function getUserLeaderboardData(userId: string): Promise<UserRankingData | null> {
  try {
    const leaderboardContainer = getLeaderboardContainer();
    
    let leaderboardEntry: LeaderboardEntry | null = null;
    try {
      const { resource } = await leaderboardContainer.item(userId, userId).read<LeaderboardEntry>();
      leaderboardEntry = resource || null;
    } catch (error: any) {
      if (error.code !== 404) throw error;
    }

    if (!leaderboardEntry) {
      // User not in leaderboard yet, calculate now
      const scores = await calculateUserLeaderboardScore(userId);
      const database = getCosmosClient().database('mpt-db');
      const usersContainer = database.container('users');
      const { resource: user } = await usersContainer.item(userId, userId).read<any>();

      return {
        userId,
        userName: user?.name || 'Unknown',
        email: user?.email || '',
        totalPoints: scores.totalPoints,
        rank: 99999, // Not yet ranked
        badge: getBadgeFromPoints(scores.totalPoints),
        quizPoints: scores.quizPoints,
        consistencyPoints: scores.consistencyPoints,
        communityPoints: scores.communityPoints,
        winRate: scores.winRate,
        radarChartData: {
          technicalAnalysis: Math.min(100, (scores.quizPoints / 100) * 80),
          riskManagement: Math.min(100, (scores.consistencyPoints / 35) * 100),
          psychology: Math.min(100, Math.random() * 100), // TODO: Get from assessments
          discipline: Math.min(100, (scores.consistencyPoints / 35) * 100),
          knowledge: Math.min(100, (scores.quizPoints / 100) * 100)
        },
        mentorNotes: null
      };
    }

    // Return full data
    return {
      userId: leaderboardEntry.userId,
      userName: leaderboardEntry.userName,
      email: leaderboardEntry.email,
      totalPoints: leaderboardEntry.totalPoints,
      rank: leaderboardEntry.rank,
      badge: leaderboardEntry.badge,
      quizPoints: leaderboardEntry.quizPoints,
      consistencyPoints: leaderboardEntry.consistencyPoints,
      communityPoints: leaderboardEntry.communityPoints,
      winRate: leaderboardEntry.winRate,
      radarChartData: {
        technicalAnalysis: Math.min(100, (leaderboardEntry.quizPoints / 100) * 80),
        riskManagement: Math.min(100, (leaderboardEntry.consistencyPoints / 35) * 100),
        psychology: Math.min(100, 60 + Math.random() * 40), // TODO
        discipline: Math.min(100, (leaderboardEntry.consistencyPoints / 35) * 100),
        knowledge: Math.min(100, (leaderboardEntry.quizPoints / 100) * 100)
      },
      mentorNotes: null
    };
  } catch (error) {
    console.error('Error getting user leaderboard data:', error);
    return null;
  }
}

/**
 * Save weekly leaderboard snapshot
 */
export async function saveLeaderboardSnapshot(): Promise<void> {
  try {
    const leaderboardEntries = await getLeaderboardTop(1000, 0);
    
    const now = new Date();
    const weekNumber = Math.ceil((now.getDate()) / 7);
    const year = now.getFullYear();

    const snapshot = {
      id: `${year}-w${weekNumber}`,
      week: weekNumber,
      year,
      rankings: leaderboardEntries.map(entry => ({
        userId: entry.userId,
        userName: entry.userName,
        rank: entry.rank,
        totalPoints: entry.totalPoints,
        badge: entry.badge
      })),
      timestamp: now.toISOString()
    };

    const historyContainer = getLeaderboardHistoryContainer();
    try {
      await historyContainer.item(snapshot.id, snapshot.id).replace(snapshot);
    } catch (error: any) {
      if (error.code === 404) {
        await historyContainer.items.create(snapshot);
      }
    }

    console.log(`📊 Leaderboard snapshot saved for week ${weekNumber}`);
  } catch (error) {
    console.error('Error saving leaderboard snapshot:', error);
  }
}

/**
 * Get leaderboard history for specific week
 */
export async function getLeaderboardHistory(week: number, year: number = new Date().getFullYear()) {
  try {
    const historyContainer = getLeaderboardHistoryContainer();
    const { resource } = await historyContainer.item(`${year}-w${week}`, `${year}-w${week}`).read<any>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) return null;
    throw error;
  }
}