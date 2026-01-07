/**
 * API Route: Analyze Trade for Discipline & Achievements
 * POST /api/discipline/analyze-trade
 * Analyzes trade behavior, updates discipline score, checks badge progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/role-check';
import { getCosmosClient } from '@/utils/cosmosdb';
import { analyzeTrade } from '@/lib/db/discipline-service';
import { checkBadgeUpgrade, checkDisciplineMilestone, checkOverallLevelUpgrade } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  return requireAuth(req, async (authenticatedReq) => {
    try {
      const userId = authenticatedReq.user!.id;
      const body = await req.json();
      const { tradeId } = body;

      // Get Cosmos client
      const client = getCosmosClient();
    const database = client.database('MPT');
    const usersContainer = database.container('users');
    const tradesContainer = database.container('trades');

    // Get trade
    const { resource: trade } = await tradesContainer.item(tradeId, userId).read();
    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    // Get user
    const { resource: user } = await usersContainer.item(userId, userId).read();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Analyze trade for discipline violations
    const analysis = await analyzeTrade({
      userId: userId,
      tradeId: trade.id,
      hasStopLoss: !!trade.stopLoss,
      hasJournalEntry: !!trade.notes,
      followedStrategy: trade.followedStrategy || false,
      riskPercent: trade.riskPercent || 1,
      maxRiskPercent: user.settings?.riskPercent || 2,
      timeSinceLastTrade: 0, // Calculate if needed
      result: trade.result,
      previousResult: trade.previousResult
    });
    
    // Calculate new discipline score
    const previousScore = user.disciplineScore || 500;
    const scoreChange = analysis.totalPoints || 0;
    const newScore = Math.max(0, Math.min(1000, previousScore + scoreChange));

    // Check for discipline milestone
    const milestonCheck = checkDisciplineMilestone(previousScore, newScore);

    // Update badge progress
    const updatedBadges = user.badges || [];
    const badgeUpgrades: any[] = [];

    // Update FIRST_TRADE badge (winning trades)
    if (trade.result === 'WIN') {
      const firstBloodIndex = updatedBadges.findIndex((b: any) => b.type === 'FIRST_TRADE');
      if (firstBloodIndex >= 0) {
        const badge = updatedBadges[firstBloodIndex];
        const newProgress = badge.progress + 1;
        
        const upgrade = checkBadgeUpgrade('FIRST_TRADE', badge.level, newProgress);
        if (upgrade.upgraded) {
          updatedBadges[firstBloodIndex] = {
            ...badge,
            level: upgrade.newLevel,
            progress: newProgress
          };
          badgeUpgrades.push({
            badgeType: 'FIRST_TRADE',
            newLevel: upgrade.newLevel
          });
        } else {
          updatedBadges[firstBloodIndex] = {
            ...badge,
            progress: newProgress
          };
        }
      }
    }

    // Update DISCIPLINED_WARRIOR badge
    const disciplineIndex = updatedBadges.findIndex((b: any) => b.type === 'DISCIPLINED_WARRIOR');
    if (disciplineIndex >= 0) {
      const badge = updatedBadges[disciplineIndex];
      const upgrade = checkBadgeUpgrade('DISCIPLINED_WARRIOR', badge.level, newScore);
      
      if (upgrade.upgraded) {
        updatedBadges[disciplineIndex] = {
          ...badge,
          level: upgrade.newLevel,
          progress: newScore
        };
        badgeUpgrades.push({
          badgeType: 'DISCIPLINED_WARRIOR',
          newLevel: upgrade.newLevel
        });
      } else {
        updatedBadges[disciplineIndex] = {
          ...badge,
          progress: newScore
        };
      }
    }

    // Update PROFIT_MASTER badge
    if (trade.result === 'WIN') {
      const profitIndex = updatedBadges.findIndex((b: any) => b.type === 'PROFIT_MASTER');
      if (profitIndex >= 0) {
        const badge = updatedBadges[profitIndex];
        const totalProfit = (badge.progress || 0) + (trade.profitLoss || 0);
        
        const upgrade = checkBadgeUpgrade('PROFIT_MASTER', badge.level, totalProfit);
        if (upgrade.upgraded) {
          updatedBadges[profitIndex] = {
            ...badge,
            level: upgrade.newLevel,
            progress: totalProfit
          };
          badgeUpgrades.push({
            badgeType: 'PROFIT_MASTER',
            newLevel: upgrade.newLevel
          });
        } else {
          updatedBadges[profitIndex] = {
            ...badge,
            progress: totalProfit
          };
        }
      }
    }

    // Check overall level upgrade
    const newOverallLevel = checkOverallLevelUpgrade(updatedBadges);
    const levelUpgrade = newOverallLevel !== user.currentBadgeLevel;

    // Update user
    const updatedUser = {
      ...user,
      disciplineScore: newScore,
      badges: updatedBadges,
      currentBadgeLevel: newOverallLevel,
      updatedAt: new Date().toISOString()
    };

    await usersContainer.item(userId, userId).replace(updatedUser);

    return NextResponse.json({
      success: true,
      previousDisciplineScore: previousScore,
      newDisciplineScore: newScore,
      scoreChange,
      analysis,
      badgeUpgrades,
      disciplineMilestone: milestonCheck.milestone,
      levelUpgrade,
      newOverallLevel: levelUpgrade ? newOverallLevel : undefined
    });

    } catch (error: any) {
      console.error('Error analyzing trade:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
