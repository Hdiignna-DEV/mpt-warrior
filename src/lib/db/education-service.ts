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

  const { resource } = await container.items.upsert(userAnswer);
  return resource!;
}

/**
 * Grade essay question (Admin only)
 */
export async function gradeEssayAnswer(
  userId: string,
  questionId: string,
  score: number,
  feedback: string,
  gradedBy: string
): Promise<UserQuizAnswer> {
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

  const { resource } = await container.item(answerId, userId).replace(updatedAnswer);
  return resource!;
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
          new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
        )[0].lastAccessedAt
      : '';
    
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
    const prereqModule = await getAllModules().then(modules => 
      modules.find(m => m.id === prereqId)
    );
    
    if (!prereqModule) continue;
    
    const prereqProgress = userProgress.filter(p => p.moduleId === prereqId && p.completed);
    const totalLessons = prereqModule.lessons.length;
    
    if (prereqProgress.length < totalLessons) {
      return false; // Prerequisite not fully completed
    }
  }
  
  return true;
}
