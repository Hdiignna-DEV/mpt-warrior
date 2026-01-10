'use client';

/**
 * Pose Trigger Examples & Integration Patterns
 * 
 * This file demonstrates how to trigger different Arka poses
 * throughout the application based on user actions
 */

import { useArkaController } from '@/hooks/useArkaController';

// ============= VICTORY TRIGGERS =============

/**
 * Trigger victory when user passes quiz
 */
export function useQuizVictoryTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerQuizVictory = (score: number, moduleName: string) => {
    if (score >= 70) {
      controller.triggerVictory(
        `🎉 Luar biasa! Anda lulus quiz ${moduleName} dengan skor ${score}%!`,
        'Anda siap melanjutkan ke modul berikutnya!'
      );
      return true;
    } else {
      controller.triggerWarning(
        `📝 Skor Anda ${score}%. Minimum 70% untuk lulus. Mari kita review materi ini lagi!`
      );
      return false;
    }
  };

  return { triggerQuizVictory };
}

/**
 * Trigger victory when user rank increases
 */
export function useRankUpTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerRankUp = (oldRank: number, newRank: number, movement: number) => {
    const improvement = oldRank - newRank;
    
    if (improvement > 0) {
      controller.triggerVictory(
        `📈 Selamat! Anda naik ${improvement} peringkat!`,
        `Dari #${oldRank} ke #${newRank}. Momentum bagus, terus pertahankan! 💪`
      );
      
      // Special trigger for Top 3
      if (newRank <= 3) {
        setTimeout(() => {
          controller.setPose('victory');
          controller.speak({
            text: `🏆 WOW! Anda masuk TOP 3 Elite Warriors! Ini adalah pencapaian luar biasa!`,
            duration: 4000,
            showBalloon: true
          });
        }, 3000);
      }
    }
  };

  return { triggerRankUp };
}

/**
 * Trigger victory when user profit on trade
 */
export function useProfitTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerProfit = (pnl: number, pnlPercent: number) => {
    if (pnl > 0) {
      const message = pnlPercent > 5 
        ? `🎯 Sangat bagus! +${pnlPercent.toFixed(2)}% profit! Anda menguasai timing!`
        : `✅ Profit terambil! +${pnlPercent.toFixed(2)}%. Konsistensi adalah kunci!`;
      
      controller.triggerVictory(message);
    }
  };

  return { triggerProfit };
}

// ============= WARNING TRIGGERS =============

/**
 * Trigger warning on loss streak
 */
export function useLossStreakTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerLossStreak = (lossCount: number, recentTrades: any[]) => {
    if (lossCount >= 2) {
      controller.triggerWarning(
        `⚠️ Loss streak! ${lossCount} losses berturut-turut. Saatnya review Risk Management dan Psikologi Trading.`
      );
    }
  };

  return { triggerLossStreak };
}

/**
 * Trigger warning on risk management violation
 */
export function useRiskViolationTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerRiskViolation = (violationType: 'leverage' | 'rr' | 'lot_size', value: number) => {
    const messages = {
      leverage: `⚠️ Leverage terlalu tinggi! ${value}x. Recommended: max 5x. Risk reward tidak seimbang!`,
      rr: `⚠️ Risk/Reward ratio ${value}:1. Minimum 1.5:1 untuk profitable trading!`,
      lot_size: `⚠️ Lot size terlalu besar! Kurangi ukuran posisi untuk kelola risk.`
    };
    
    controller.triggerWarning(messages[violationType]);
  };

  return { triggerRiskViolation };
}

/**
 * Trigger warning on essay grade below passing
 */
export function useEssayFailedTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerEssayFailed = (score: number, feedback: string) => {
    if (score < 70) {
      controller.triggerWarning(
        `📝 Nilai essay: ${score}/100. Perlu perbaikan: ${feedback}`
      );
    }
  };

  return { triggerEssayFailed };
}

// ============= VISION TRIGGERS =============

/**
 * Trigger vision when chart is uploaded/analyzed
 */
export function useChartAnalysisTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerChartAnalysis = () => {
    controller.triggerVision();
    
    controller.speak({
      text: 'Analyzing chart... mencari pattern dan support/resistance...',
      duration: 2000
    });
  };

  const finishChartAnalysis = (analysis: string) => {
    controller.resetVision();
    controller.speak({
      text: analysis,
      duration: 4000,
      showBalloon: true
    });
  };

  return { triggerChartAnalysis, finishChartAnalysis };
}

/**
 * Trigger vision when system is processing AI response
 */
export function useAIProcessingTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerProcessing = (taskName: string) => {
    controller.triggerVision();
    controller.speak({
      text: `Processing: ${taskName}...`,
      duration: 2000
    });
  };

  const finishProcessing = (result: string) => {
    controller.resetVision();
    controller.speak({
      text: result,
      duration: 3500,
      showBalloon: true
    });
  };

  return { triggerProcessing, finishProcessing };
}

// ============= ONBOARDING TRIGGERS =============

/**
 * Trigger onboarding on first login
 */
export function useFirstLoginTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerFirstLogin = (userName: string) => {
    controller.triggerOnboarding(
      `Selamat datang, ${userName}! 🫡 Saya Commander Arka, AI Mentor Anda. Mari kita taklukkan pasar trading bersama-sama!`
    );
  };

  return { triggerFirstLogin };
}

/**
 * Trigger onboarding when new module unlocked
 */
export function useModuleUnlockedTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerModuleUnlocked = (moduleName: string) => {
    controller.triggerOnboarding(
      `🔓 Modul Baru Terbuka! "${moduleName}" sudah siap dipelajari. Apakah Anda siap untuk tantangan baru?`
    );
  };

  return { triggerModuleUnlocked };
}

/**
 * Trigger onboarding from notification deep link
 */
export function useNotificationDeepLinkTrigger(controller: ReturnType<typeof useArkaController>) {
  const triggerDeepLink = (context: string) => {
    controller.triggerOnboarding(
      `Sini sini! Saya ingin menunjukkan sesuatu kepada Anda: ${context} 📍`
    );
  };

  return { triggerDeepLink };
}

// ============= USAGE EXAMPLE IN A COMPONENT =============

/**
 * Example component using Arka triggers
 */
export function QuizResultExample() {
  const arkaController = useArkaController('empty');
  const { triggerQuizVictory } = useQuizVictoryTrigger(arkaController);
  const { triggerRankUp } = useRankUpTrigger(arkaController);

  const handleQuizSubmit = async (answers: any[]) => {
    // Calculate score
    const score = 85;
    const passed = triggerQuizVictory(score, 'Technical Analysis');

    if (passed) {
      // Fetch updated rank
      const oldRank = 50;
      const newRank = 48;
      
      // Trigger rank up
      triggerRankUp(oldRank, newRank, oldRank - newRank);
    }
  };

  return (
    <div>
      <h1>Quiz Result: {arkaController.pose}</h1>
      <p>Opacity: {arkaController.opacity}</p>
      {arkaController.currentMessage && (
        <p>Message: {arkaController.currentMessage.text}</p>
      )}
    </div>
  );
}

/**
 * Integration points where Arka triggers should be used:
 * 
 * 1. Quiz Component (/src/components/Quiz.tsx)
 *    - On quiz pass: triggerQuizVictory()
 *    - On quiz fail: triggerWarning()
 *
 * 2. Leaderboard Component (/src/components/leaderboard/*)
 *    - On rank increase: triggerRankUp()
 *    - On Top 3 achievement: special victory trigger
 *
 * 3. Trade Journal Component (/src/components/TradeJournal.tsx)
 *    - On profit: triggerProfit()
 *    - On loss streak: useLossStreakTrigger()
 *    - On risk violation: useRiskViolationTrigger()
 *
 * 4. Chat Component (/src/app/(main)/ai-mentor/page.tsx)
 *    - On chart upload: useChartAnalysisTrigger()
 *    - On AI processing: useAIProcessingTrigger()
 *
 * 5. Module/Academy Component
 *    - On first login: useFirstLoginTrigger()
 *    - On module unlock: useModuleUnlockedTrigger()
 *
 * 6. Navigation (from notifications)
 *    - On deep link: useNotificationDeepLinkTrigger()
 */
