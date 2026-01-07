/**
 * Notification Service
 * Handles achievement and milestone notifications
 */

import { toast } from '@/utils/toast';

// Badge level thresholds
const BADGE_LEVEL_REQUIREMENTS = {
  RECRUIT: {
    FIRST_TRADE: 0,
    CONSISTENT_5: 0,
    DISCIPLINED_WARRIOR: 0,
    PROFIT_MASTER: 0,
    EDUCATOR: 0,
    LEGACY_BUILDER: 0
  },
  WARRIOR: {
    FIRST_TRADE: 10,        // 10 winning trades
    CONSISTENT_5: 30,       // 30 days active trading
    DISCIPLINED_WARRIOR: 600, // 600 discipline score
    PROFIT_MASTER: 5000,    // $5000 total profit
    EDUCATOR: 5,            // 5 academy modules completed
    LEGACY_BUILDER: 0       // Not applicable
  },
  VETERAN: {
    FIRST_TRADE: 100,       // 100 winning trades
    CONSISTENT_5: 90,       // 90 days active trading
    DISCIPLINED_WARRIOR: 850, // 850 discipline score
    PROFIT_MASTER: 25000,   // $25000 total profit
    EDUCATOR: 15,           // 15 academy modules completed
    LEGACY_BUILDER: 10      // 10 successful referrals
  }
};

// Discipline score milestones
const DISCIPLINE_MILESTONES = [100, 250, 500, 750, 850, 1000];

/**
 * Check if user earned a badge upgrade
 */
export function checkBadgeUpgrade(
  badgeType: string,
  currentLevel: string,
  currentProgress: number
): { upgraded: boolean; newLevel?: string; emoji?: string } {
  
  // Check if progress meets Warrior threshold
  if (currentLevel === 'RECRUIT') {
    const threshold = (BADGE_LEVEL_REQUIREMENTS.WARRIOR as any)[badgeType];
    if (currentProgress >= threshold && threshold > 0) {
      return {
        upgraded: true,
        newLevel: 'WARRIOR',
        emoji: '⚔️'
      };
    }
  }

  // Check if progress meets Veteran threshold
  if (currentLevel === 'WARRIOR' || currentLevel === 'RECRUIT') {
    const threshold = (BADGE_LEVEL_REQUIREMENTS.VETERAN as any)[badgeType];
    if (currentProgress >= threshold && threshold > 0) {
      return {
        upgraded: true,
        newLevel: 'VETERAN',
        emoji: '👑'
      };
    }
  }

  return { upgraded: false };
}

/**
 * Check if discipline score crossed a milestone
 */
export function checkDisciplineMilestone(
  previousScore: number,
  newScore: number
): { milestone: boolean; value?: number; emoji?: string } {
  
  for (const milestone of DISCIPLINE_MILESTONES) {
    if (previousScore < milestone && newScore >= milestone) {
      return {
        milestone: true,
        value: milestone,
        emoji: milestone >= 850 ? '🏆' : milestone >= 500 ? '⭐' : '🎯'
      };
    }
  }

  return { milestone: false };
}

/**
 * Show badge upgrade notification
 */
export function notifyBadgeUpgrade(badgeType: string, newLevel: string) {
  const badgeNames: Record<string, string> = {
    FIRST_TRADE: 'First Blood',
    CONSISTENT_5: 'Consistent Warrior',
    DISCIPLINED_WARRIOR: 'Discipline Master',
    PROFIT_MASTER: 'Profit Master',
    EDUCATOR: 'Educator',
    LEGACY_BUILDER: 'Legacy Builder'
  };

  const emoji = newLevel === 'VETERAN' ? '👑' : '⚔️';
  
  toast.success(
    `${emoji} Badge Upgraded!`,
    `${badgeNames[badgeType]} → ${newLevel}`
  );
}

/**
 * Show discipline milestone notification
 */
export function notifyDisciplineMilestone(score: number) {
  const emoji = score >= 850 ? '🏆' : score >= 500 ? '⭐' : '🎯';
  
  toast.success(
    `${emoji} Discipline Milestone!`,
    `Reached ${score} points`
  );
}

/**
 * Show referral success notification
 */
export function notifyReferralSuccess(referredUser: string) {
  toast.success(
    `🎉 Referral Success!`,
    `${referredUser} joined using your code`
  );
}

/**
 * Show overall badge level upgrade (Recruit → Warrior → Veteran)
 */
export function notifyOverallLevelUp(newLevel: string) {
  const emoji = newLevel === 'VETERAN' ? '👑' : '⚔️';
  const title = newLevel === 'VETERAN' ? 'VETERAN ACHIEVED!' : 'WARRIOR ACHIEVED!';
  
  toast.success(
    `${emoji} ${title}`,
    `You've been promoted to ${newLevel}`
  );
}

/**
 * Check if user's overall badge level should upgrade
 * User upgrades to next level when ALL badges reach that level
 */
export function checkOverallLevelUpgrade(badges: any[]): string {
  // Count badges at each level
  const warriorBadges = badges.filter(b => b.level === 'WARRIOR' || b.level === 'VETERAN').length;
  const veteranBadges = badges.filter(b => b.level === 'VETERAN').length;

  // Upgrade to Veteran if ALL badges are Veteran
  if (veteranBadges === badges.length) {
    return 'VETERAN';
  }

  // Upgrade to Warrior if ALL badges are at least Warrior
  if (warriorBadges === badges.length) {
    return 'WARRIOR';
  }

  return 'RECRUIT';
}

/**
 * Process trade and trigger relevant notifications
 */
export async function processTrade(trade: any, userId: string) {
  try {
    const token = localStorage.getItem('mpt_token');

    // Trigger discipline analysis (will auto-update score and check badges)
    const response = await fetch('/api/discipline/analyze-trade', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tradeId: trade.id,
        userId
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      // Check for badge upgrades
      if (result.badgeUpgrades && result.badgeUpgrades.length > 0) {
        result.badgeUpgrades.forEach((upgrade: any) => {
          notifyBadgeUpgrade(upgrade.badgeType, upgrade.newLevel);
        });
      }

      // Check for discipline milestone
      if (result.disciplineMilestone) {
        notifyDisciplineMilestone(result.newDisciplineScore);
      }

      // Check for overall level upgrade
      if (result.levelUpgrade) {
        notifyOverallLevelUp(result.newOverallLevel);
      }
    }
  } catch (error) {
    console.error('Error processing trade notifications:', error);
  }
}
