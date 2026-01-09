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
  const database = getCosmosClient().database('mpt-warrior');
  return database.container('user-leaderboard');
}

function getLeaderboardHistoryContainer(): Container {
  const database = getCosmosClient().database('mpt-warrior');
  return database.container('leaderboard-history');
}

/**
 * Calculate leaderboard score for a user
 * Score = Quiz Points + Consistency Points + Community Points
 */
/**
 * Calculate leaderboard score for a user using weighted formula
 * 
 * Formula: Total Points = (Quiz Score × 0.40) + (Consistency Score × 0.35) + (Community Score × 0.25)
 * 
 * Weights:
 * - Quiz Points (40%): Average of all module quiz scores (max 100)
 * - Consistency Points (35%): 5 points per day journaling (max 35/week)
 * - Community Points (25%): 2 points per meaningful comment (max 20/week)
 */
export async function calculateUserLeaderboardScore(userId: string): Promise<{
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  totalPoints: number;
  winRate: number;
}> {
  try {
    // 1. Quiz Points: Average dari semua modul quiz scores (0-100 range)
    const quizPoints = await calculateQuizPoints(userId);

    // 2. Consistency Points: 5 poin per hari menulis jurnal (max 35/minggu)
    const consistencyPoints = await calculateConsistencyPoints(userId);

    // 3. Community Points: 2 poin per meaningful comment (max 20/minggu)
    const communityPoints = await calculateCommunityPoints(userId);

    // 4. Calculate Total Points using weighted formula
    // Total = (Quiz × 0.40) + (Consistency × 0.35) + (Community × 0.25)
    const totalPoints = Math.round(
      (quizPoints * 0.40) + (consistencyPoints * 0.35) + (communityPoints * 0.25)
    );

    // 5. Calculate Win Rate from trades
    const winRate = await calculateWinRate(userId);

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
 * Calculate Quiz Points: Average of all module quiz scores
 * Range: 0-100 points
 */
async function calculateQuizPoints(userId: string): Promise<number> {
  try {
    const allModules = await getAllModules();
    if (!allModules || allModules.length === 0) {
      return 0;
    }

    let totalQuizScore = 0;
    let completedModules = 0;

    for (const module of allModules) {
      const score = await getUserQuizScore(userId, module.id);
      if (score && score.percentage > 0) {
        totalQuizScore += score.percentage;
        completedModules++;
      }
    }

    // Return average score (0-100 range)
    const avgScore = completedModules > 0 
      ? Math.round((totalQuizScore / completedModules) * 100) / 100 
      : 0;

    // Normalize to 0-100 range
    return Math.min(100, Math.max(0, avgScore));
  } catch (error) {
    console.error(`Error calculating quiz points for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Calculate Consistency Points: Days with journal entries in last 7 days
 * Formula: 5 points per day × min(days, 7) = max 35 points/week
 * Range: 0-35 points
 */
async function calculateConsistencyPoints(userId: string): Promise<number> {
  try {
    const database = getCosmosClient().database('mpt-warrior');
    const tradesContainer = database.container('trades');
    
    // Get last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Query distinct dates with journal entries
    const { resources: journalEntries } = await tradesContainer.items
      .query({
        query: `
          SELECT DISTINCT 
            DATE(c.createdAt) as journalDate 
          FROM c 
          WHERE c.userId = @userId 
            AND c.createdAt > @date
            AND c.notes != null
            AND LENGTH(c.notes) > 0
        `,
        parameters: [
          { name: '@userId', value: userId },
          { name: '@date', value: sevenDaysAgo.toISOString() }
        ]
      })
      .fetchAll();

    // Count unique days (each day = 5 points, max 7 days = 35 points)
    const uniqueDays = journalEntries.length || 0;
    const consistencyPoints = Math.min(uniqueDays * 5, 35);

    return Math.max(0, consistencyPoints);
  } catch (error) {
    console.error(`Error calculating consistency points for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Calculate Community Points: Meaningful comments/discussions
 * Formula: 2 points per comment × min(comments, 10) = max 20 points/week
 * Range: 0-20 points
 * 
 * Note: Requires community_comments table/container
 * Current implementation returns 0 (placeholder)
 */
async function calculateCommunityPoints(userId: string): Promise<number> {
  try {
    // TODO: Implement when forum/community feature is ready
    // For now, return 0 to represent no community points
    
    // Placeholder implementation:
    // const database = getCosmosClient().database('mpt-db');
    // const commentsContainer = database.container('community_comments');
    // 
    // const sevenDaysAgo = new Date();
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // 
    // const { resources: comments } = await commentsContainer.items
    //   .query({
    //     query: `
    //       SELECT * FROM c 
    //       WHERE c.userId = @userId 
    //         AND c.createdAt > @date
    //         AND LENGTH(c.text) >= 10
    //     `,
    //     parameters: [
    //       { name: '@userId', value: userId },
    //       { name: '@date', value: sevenDaysAgo.toISOString() }
    //     ]
    //   })
    //   .fetchAll();
    // 
    // const meaningfulComments = comments.length || 0;
    // const communityPoints = Math.min(meaningfulComments * 2, 20);
    
    return 0; // Placeholder
  } catch (error) {
    console.error(`Error calculating community points for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Calculate Win Rate: Percentage of winning trades
 * Range: 0-100 (percentage)
 */
async function calculateWinRate(userId: string): Promise<number> {
  try {
    const database = getCosmosClient().database('mpt-warrior');
    const tradesContainer = database.container('trades');

    const { resources: trades } = await tradesContainer.items
      .query({
        query: `
          SELECT c.result 
          FROM c 
          WHERE c.userId = @userId 
            AND c.status = 'CLOSED'
            AND c.result != null
        `,
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();

    if (!trades || trades.length === 0) {
      return 0; // No closed trades yet
    }

    const winCount = trades.filter(t => t.result === 'WIN').length;
    const winRate = Math.round((winCount / trades.length) * 100);

    return Math.max(0, Math.min(100, winRate));
  } catch (error) {
    console.error(`Error calculating win rate for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Get badge based on total points (cumulative lifetime points)
 * 
 * Tier Thresholds:
 * - Recruit: 0-500 points
 * - Elite Warrior: 501-1500 points
 * - Commander: 1501-3000 points
 * - Legendary Mentor: 3001+ points
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
    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');
    
    // Ensure leaderboard containers exist before using them
    console.log('📦 Ensuring leaderboard containers exist...');
    try {
      await database.containers.createIfNotExists({
        id: 'user-leaderboard',
        partitionKey: '/userId',
        throughput: 100
      });
      console.log('✅ user-leaderboard container ready');
    } catch (error: any) {
      if (error.code !== 409) {
        console.warn('⚠️ Could not create user-leaderboard container:', error.message);
      }
    }

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
      const database = getCosmosClient().database('mpt-warrior');
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

/**
 * Calculate Radar Chart Data for user profile visualization
 * 
 * Dimensions (normalized 0-100):
 * 1. Technical Analysis = (Quiz Score × 0.8) + (Win Rate × 0.2)
 * 2. Risk Management = (Consistency Score × 0.9) + (Win Rate × 0.1)
 * 3. Psychology = (Consistency × 0.5) + Base 50 + Random factor (TODO: parse from journal)
 * 4. Discipline = Consistency Score directly (normalized 0-100)
 * 5. Knowledge = Quiz Score directly (0-100)
 */
export async function calculateRadarChartData(userId: string): Promise<{
  technicalAnalysis: number;
  riskManagement: number;
  psychology: number;
  discipline: number;
  knowledge: number;
}> {
  try {
    const scores = await calculateUserLeaderboardScore(userId);
    
    // Normalize scores to 0-100 range for radar chart
    const normalizedConsistency = Math.min(100, (scores.consistencyPoints / 35) * 100);
    const normalizedQuiz = scores.quizPoints; // Already 0-100
    const normalizedWinRate = scores.winRate; // Already 0-100

    return {
      // Technical Analysis: Balanced between knowledge and trading success
      technicalAnalysis: Math.round((normalizedQuiz * 0.8) + (normalizedWinRate * 0.2)),

      // Risk Management: Based on consistency + win rate discipline
      riskManagement: Math.round((normalizedConsistency * 0.9) + (normalizedWinRate * 0.1)),

      // Psychology: Consistency + base + potential boost from journal analysis
      // TODO: Parse emotion/sentiment from trading journal entries for better accuracy
      psychology: Math.round((normalizedConsistency * 0.5) + 40),

      // Discipline: Direct measure of consistency in journaling
      discipline: Math.round(normalizedConsistency),

      // Knowledge: Direct measure of quiz performance
      knowledge: Math.round(normalizedQuiz)
    };
  } catch (error) {
    console.error(`Error calculating radar chart data for user ${userId}:`, error);
    return {
      technicalAnalysis: 0,
      riskManagement: 0,
      psychology: 0,
      discipline: 0,
      knowledge: 0
    };
  }
}

/**
 * Get or generate Mentor Notes for a user
 * 
 * Sources (in priority order):
 * 1. Manual notes from admin/mentor in dashboard
 * 2. Auto-generated assessment based on radar scores
 * 3. Default encouraging message
 */
export async function getMentorNotes(userId: string): Promise<string | null> {
  try {
    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');

    // Try to get user document with manual mentor notes
    try {
      const { resource: user } = await usersContainer.item(userId, userId).read<any>();
      if (user && user.mentorNotes) {
        return user.mentorNotes;
      }
    } catch (error) {
      // User not found, continue
    }

    // Generate automatic assessment based on performance
    const radarData = await calculateRadarChartData(userId);
    const scores = await calculateUserLeaderboardScore(userId);
    const badge = getBadgeFromPoints(scores.totalPoints);

    // Identify strengths and areas to improve
    const scores_array = [
      { name: 'Technical Analysis', value: radarData.technicalAnalysis },
      { name: 'Risk Management', value: radarData.riskManagement },
      { name: 'Psychology', value: radarData.psychology },
      { name: 'Discipline', value: radarData.discipline },
      { name: 'Knowledge', value: radarData.knowledge }
    ];

    const strengths = scores_array
      .filter(s => s.value >= 75)
      .map(s => s.name);

    const improvements = scores_array
      .filter(s => s.value < 60)
      .map(s => s.name);

    // Generate message based on badge and performance
    let message = '';

    switch (badge) {
      case 'Legendary Mentor':
        message = `🌟 Selamat ${badge}! Anda adalah teladan MPT Philosophy. Pertahankan konsistensi dan terus mentoring komunitas.`;
        break;
      case 'Commander':
        message = `🎖️ Excellent progress, ${badge}! Fokus pada peningkatan kualitas jurnal dan analisis teknikal untuk meraih level selanjutnya.`;
        break;
      case 'Elite Warrior':
        message = `⚔️ Well done, ${badge}! Anda sudah menunjukkan kedisiplinan yang solid. Terus tingkatkan knowledge dengan menyelesaikan modul-modul sisa.`;
        break;
      default:
        message = `🥲 Selamat datang ${badge}! Mulai dari sini dengan konsisten menulis jurnal trading. Disiplin adalah fondasi kesuksesan trader.`;
    }

    // Add specific recommendations
    if (strengths.length > 0) {
      message += `\n\n💪 Kekuatan Anda: ${strengths.join(', ')}`;
    }

    if (improvements.length > 0) {
      message += `\n\n🎯 Area untuk ditingkatkan: ${improvements.join(', ')}`;
    }

    message += `\n\n📚 Saran: Fokus pada modul ${improvements[0] || 'lanjutan'} dan pertahankan momentum journaling Anda!`;

    return message;
  } catch (error) {
    console.error(`Error getting mentor notes for user ${userId}:`, error);
    return null;
  }
}

/**
 * Get weekly history for user (last 4-12 weeks)
 */
export async function getUserWeeklyHistory(userId: string, weeksBack: number = 4): Promise<Array<{
  week: number;
  year: number;
  rank: number;
  totalPoints: number;
  badge: string;
}> | null> {
  try {
    const historyContainer = getLeaderboardHistoryContainer();
    const history = [];

    const now = new Date();
    for (let i = 0; i < weeksBack; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - (i * 7));
      
      const week = Math.ceil(checkDate.getDate() / 7);
      const year = checkDate.getFullYear();
      const weekId = `${year}-w${week}`;

      try {
        const { resource: snapshot } = await historyContainer.item(weekId, weekId).read<any>();
        if (snapshot && snapshot.rankings) {
          const userRanking = snapshot.rankings.find((r: any) => r.userId === userId);
          if (userRanking) {
            history.push({
              week,
              year,
              rank: userRanking.rank,
              totalPoints: userRanking.totalPoints,
              badge: userRanking.badge
            });
          }
        }
      } catch (error) {
        // Week history not found, continue
      }
    }

    return history.length > 0 ? history : null;
  } catch (error) {
    console.error(`Error getting weekly history for user ${userId}:`, error);
    return null;
  }
}