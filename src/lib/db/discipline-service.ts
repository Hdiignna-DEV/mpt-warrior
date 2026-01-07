/**
 * Discipline Score Service
 * Calculate and track warrior discipline based on trading behavior
 */

import { getDatabase } from '@/utils/cosmosdb';

export interface DisciplineAction {
  action: 
    | 'FOLLOWED_STRATEGY'     // +5 points
    | 'JOURNAL_ENTRY'         // +3 points
    | 'RISK_MANAGEMENT'       // +5 points
    | 'REVENGE_TRADE'         // -10 points
    | 'OVERTRADING'           // -5 points
    | 'EMOTIONAL_TRADE'       // -7 points
    | 'NO_STOP_LOSS'          // -8 points
    | 'EXCEEDED_RISK';        // -6 points
  userId: string;
  tradeId?: string;
  reason?: string;
}

const DISCIPLINE_POINTS: Record<DisciplineAction['action'], number> = {
  FOLLOWED_STRATEGY: 5,
  JOURNAL_ENTRY: 3,
  RISK_MANAGEMENT: 5,
  REVENGE_TRADE: -10,
  OVERTRADING: -5,
  EMOTIONAL_TRADE: -7,
  NO_STOP_LOSS: -8,
  EXCEEDED_RISK: -6
};

const MAX_DISCIPLINE_SCORE = 1000;
const MIN_DISCIPLINE_SCORE = 0;

/**
 * Add discipline points to user
 */
export async function addDisciplinePoints(data: DisciplineAction): Promise<{
  success: boolean;
  newScore: number;
  pointsAdded: number;
}> {
  try {
    const database = await getDatabase();
    const usersContainer = database.container('users');
    const logsContainer = database.container('discipline-logs');

    // Get current user
    const { resource: user } = await usersContainer.item(data.userId, data.userId).read();
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate points
    const pointsToAdd = DISCIPLINE_POINTS[data.action];
    const currentScore = user.disciplineScore || 0;
    const newScore = Math.max(MIN_DISCIPLINE_SCORE, Math.min(MAX_DISCIPLINE_SCORE, currentScore + pointsToAdd));

    // Update user score
    await usersContainer.item(data.userId, data.userId).replace({
      ...user,
      disciplineScore: newScore,
      updatedAt: new Date().toISOString()
    });

    // Log the action
    await logsContainer.items.create({
      id: `${data.userId}-${Date.now()}`,
      userId: data.userId,
      action: data.action,
      points: pointsToAdd,
      previousScore: currentScore,
      newScore: newScore,
      tradeId: data.tradeId,
      reason: data.reason,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      newScore,
      pointsAdded: pointsToAdd
    };

  } catch (error) {
    console.error('Error adding discipline points:', error);
    throw error;
  }
}

/**
 * Analyze trade and award/deduct discipline points automatically
 */
export async function analyzeTrade(tradeData: {
  userId: string;
  tradeId: string;
  hasStopLoss: boolean;
  hasJournalEntry: boolean;
  followedStrategy: boolean;
  riskPercent: number;
  maxRiskPercent: number;
  timeSinceLastTrade: number; // minutes
  result: 'WIN' | 'LOSS';
  previousResult?: 'WIN' | 'LOSS';
}): Promise<{
  actions: DisciplineAction['action'][];
  totalPoints: number;
  newScore: number;
}> {
  const actions: DisciplineAction['action'][] = [];
  
  // Positive actions
  if (tradeData.followedStrategy) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'FOLLOWED_STRATEGY',
      tradeId: tradeData.tradeId,
      reason: 'Followed trading strategy'
    });
    actions.push('FOLLOWED_STRATEGY');
  }

  if (tradeData.hasJournalEntry) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'JOURNAL_ENTRY',
      tradeId: tradeData.tradeId,
      reason: 'Created journal entry'
    });
    actions.push('JOURNAL_ENTRY');
  }

  if (tradeData.hasStopLoss && tradeData.riskPercent <= tradeData.maxRiskPercent) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'RISK_MANAGEMENT',
      tradeId: tradeData.tradeId,
      reason: 'Proper risk management'
    });
    actions.push('RISK_MANAGEMENT');
  }

  // Negative actions
  if (!tradeData.hasStopLoss) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'NO_STOP_LOSS',
      tradeId: tradeData.tradeId,
      reason: 'No stop loss set'
    });
    actions.push('NO_STOP_LOSS');
  }

  if (tradeData.riskPercent > tradeData.maxRiskPercent) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'EXCEEDED_RISK',
      tradeId: tradeData.tradeId,
      reason: `Risk ${tradeData.riskPercent}% exceeds max ${tradeData.maxRiskPercent}%`
    });
    actions.push('EXCEEDED_RISK');
  }

  // Check for revenge trading (loss followed by quick trade)
  if (
    tradeData.previousResult === 'LOSS' && 
    tradeData.timeSinceLastTrade < 30 && // Less than 30 minutes
    tradeData.result === 'LOSS'
  ) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'REVENGE_TRADE',
      tradeId: tradeData.tradeId,
      reason: 'Potential revenge trading detected'
    });
    actions.push('REVENGE_TRADE');
  }

  // Check for overtrading (more than 5 trades per day)
  const tradesContainer = (await getDatabase()).container('trades');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { resources: todayTrades } = await tradesContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.createdAt >= @today',
      parameters: [
        { name: '@userId', value: tradeData.userId },
        { name: '@today', value: today.toISOString() }
      ]
    })
    .fetchAll();

  if (todayTrades.length > 5) {
    await addDisciplinePoints({
      userId: tradeData.userId,
      action: 'OVERTRADING',
      tradeId: tradeData.tradeId,
      reason: `${todayTrades.length} trades today (max recommended: 5)`
    });
    actions.push('OVERTRADING');
  }

  // Get final score
  const { resource: user } = await (await getDatabase()).container('users').item(tradeData.userId, tradeData.userId).read();
  
  const totalPoints = actions.reduce((sum, action) => sum + DISCIPLINE_POINTS[action], 0);

  return {
    actions,
    totalPoints,
    newScore: user?.disciplineScore || 0
  };
}

/**
 * Get discipline score history
 */
export async function getDisciplineHistory(userId: string, limit: number = 20) {
  try {
    const database = await getDatabase();
    const logsContainer = database.container('discipline-logs');

    const { resources: logs } = await logsContainer.items
      .query({
        query: `
          SELECT TOP @limit * FROM c 
          WHERE c.userId = @userId 
          ORDER BY c.timestamp DESC
        `,
        parameters: [
          { name: '@userId', value: userId },
          { name: '@limit', value: limit }
        ]
      })
      .fetchAll();

    return logs;
  } catch (error) {
    console.error('Error getting discipline history:', error);
    return [];
  }
}

/**
 * Get discipline milestones
 */
export function getDisciplineMilestones() {
  return [
    { score: 100, title: 'Novice Discipline', badge: 'Bronze Shield' },
    { score: 250, title: 'Growing Discipline', badge: 'Silver Shield' },
    { score: 500, title: 'Strong Discipline', badge: 'Gold Shield' },
    { score: 750, title: 'Elite Discipline', badge: 'Platinum Shield' },
    { score: 1000, title: 'Master Discipline', badge: 'Diamond Shield' }
  ];
}
