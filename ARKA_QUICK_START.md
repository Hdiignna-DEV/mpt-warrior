# 🎯 QUICK START GUIDE - ARKA CONTROLLER & POSE TRIGGERS

**For**: Developers integrating Arka features into components  
**Created**: January 10, 2026  
**Status**: Production Ready

---

## 🚀 MINIMAL EXAMPLE (Copy & Paste)

### Basic Quiz Victory
```tsx
import { useArkaController } from '@/hooks/useArkaController';
import { useQuizVictoryTrigger } from '@/hooks/usePoseTriggers';

export function QuizComponent() {
  const arkaController = useArkaController('empty'); // Start neutral
  const { triggerQuizVictory } = useQuizVictoryTrigger(arkaController);
  
  const handleSubmit = (score: number) => {
    triggerQuizVictory(score, 'Technical Analysis');
    // That's it! Arka automatically:
    // - Shows victory pose (score >= 70)
    // - Speaks congratulations
    // - Returns to idle after 3s
  };
  
  return (
    <div>
      <button onClick={() => handleSubmit(85)}>
        Submit Quiz
      </button>
    </div>
  );
}
```

---

## 📚 ALL HOOKS REFERENCE

### 1. useArkaController (Core)
**Where**: `src/hooks/useArkaController.ts`  
**Purpose**: Manage Arka state (pose, opacity, messages)

```tsx
import { useArkaController } from '@/hooks/useArkaController';

const arkaController = useArkaController('vision'); // Initial pose

// Change pose
arkaController.setPose('victory');
arkaController.setPose('warning');

// Control opacity
arkaController.setOpacity('SCROLLING');  // 30%
arkaController.setOpacity('IDLE');       // 80%
arkaController.setOpacity(0.5);          // Custom: 50%

// Speak message
arkaController.speak({
  text: 'Your message here',
  duration: 3000,           // Auto-dismiss after 3s
  showBalloon: true        // Show speech bubble
});

// Queue multiple messages
arkaController.queueMessages([
  { text: 'First message', duration: 2000 },
  { text: 'Second message', duration: 3000 }
]);

// Trigger helpers (all include pose + speech)
arkaController.triggerVictory('Congratulations!');
arkaController.triggerWarning('Watch out!');
arkaController.triggerVision();
arkaController.resetVision();
arkaController.triggerOnboarding('Welcome!');

// State access
console.log(arkaController.pose);           // 'victory'
console.log(arkaController.opacity);        // 1.0
console.log(arkaController.isActive);       // true
console.log(arkaController.currentMessage); // Message object
```

---

### 2. useQuizVictoryTrigger
**For**: Quiz pass/fail scenarios

```tsx
import { useQuizVictoryTrigger } from '@/hooks/usePoseTriggers';

const { triggerQuizVictory } = useQuizVictoryTrigger(arkaController);

// Returns true if passed, false if failed
const passed = triggerQuizVictory(score, 'Module Name');
// Automatically:
// - Pass (≥70%): Victory pose + success message
// - Fail (<70%): Warning pose + retry message
```

---

### 3. useRankUpTrigger
**For**: Leaderboard rank changes

```tsx
import { useRankUpTrigger } from '@/hooks/usePoseTriggers';

const { triggerRankUp } = useRankUpTrigger(arkaController);

triggerRankUp(oldRank, newRank, movement);
// Example: triggerRankUp(50, 48, 2);
// Automatically:
// - Shows rank increase message
// - If newRank <= 3: Extra celebration for Top 3!
```

---

### 4. useProfitTrigger
**For**: Profitable trades

```tsx
import { useProfitTrigger } from '@/hooks/usePoseTriggers';

const { triggerProfit } = useProfitTrigger(arkaController);

triggerProfit(pnl, pnlPercent);
// Example: triggerProfit(150, 3.5);
// Automatically:
// - Victory pose + profit message
// - >5% profit: Enhanced message
```

---

### 5. useLossStreakTrigger
**For**: Loss streak warnings

```tsx
import { useLossStreakTrigger } from '@/hooks/usePoseTriggers';

const { triggerLossStreak } = useLossStreakTrigger(arkaController);

triggerLossStreak(lossCount, recentTrades);
// Example: triggerLossStreak(3, trades);
// Automatically:
// - If 2+ losses: Warning pose + alert message
```

---

### 6. useRiskViolationTrigger
**For**: Risk management violations

```tsx
import { useRiskViolationTrigger } from '@/hooks/usePoseTriggers';

const { triggerRiskViolation } = useRiskViolationTrigger(arkaController);

triggerRiskViolation('leverage', 10);
// - 'leverage': High leverage alert
// - 'rr': Bad risk/reward ratio
// - 'lot_size': Position too large
```

---

### 7. useChartAnalysisTrigger
**For**: Chart upload & analysis

```tsx
import { useChartAnalysisTrigger } from '@/hooks/usePoseTriggers';

const { triggerChartAnalysis, finishChartAnalysis } = useChartAnalysisTrigger(arkaController);

triggerChartAnalysis();
// Vision pose + "Analyzing..."

// ... do analysis work ...

finishChartAnalysis('I see a bullish head & shoulders pattern!');
// Back to normal, displays results
```

---

### 8. useAIProcessingTrigger
**For**: AI response processing

```tsx
import { useAIProcessingTrigger } from '@/hooks/usePoseTriggers';

const { triggerProcessing, finishProcessing } = useAIProcessingTrigger(arkaController);

triggerProcessing('Chart Analysis');
// Vision pose + loading message

// ... call Gemini/Groq API ...

finishProcessing('Here are the key support levels...');
// Shows result
```

---

### 9. useFirstLoginTrigger
**For**: Welcome new users

```tsx
import { useFirstLoginTrigger } from '@/hooks/usePoseTriggers';

const { triggerFirstLogin } = useFirstLoginTrigger(arkaController);

triggerFirstLogin('John');
// Onboarding pose + welcome message
```

---

### 10. useModuleUnlockedTrigger
**For**: New module unlocks

```tsx
import { useModuleUnlockedTrigger } from '@/hooks/usePoseTriggers';

const { triggerModuleUnlocked } = useModuleUnlockedTrigger(arkaController);

triggerModuleUnlocked('Advanced Risk Management');
// Onboarding pose + unlock celebration
```

---

### 11. useNotificationDeepLinkTrigger
**For**: Deep links from notifications

```tsx
import { useNotificationDeepLinkTrigger } from '@/hooks/usePoseTriggers';

const { triggerDeepLink } = useNotificationDeepLinkTrigger(arkaController);

triggerDeepLink('New Quiz Available');
// Onboarding pose + context message
```

---

## 🎨 COMPLETE EXAMPLE - Quiz Component

```tsx
'use client';

import { useState } from 'react';
import { useArkaController } from '@/hooks/useArkaController';
import { useQuizVictoryTrigger } from '@/hooks/usePoseTriggers';

export function QuizPage() {
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const arkaController = useArkaController('empty');
  const { triggerQuizVictory } = useQuizVictoryTrigger(arkaController);
  
  const handleSubmitQuiz = async () => {
    // Calculate score (example: 85%)
    const finalScore = 85;
    setScore(finalScore);
    
    // Trigger Arka reaction
    const passed = triggerQuizVictory(finalScore, 'Technical Analysis');
    
    setSubmitted(true);
    
    if (passed) {
      // Check for rank up
      // Show confetti
      // Navigate to next module
    } else {
      // Show retry button
      // Offer module review
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient">
      <div className="max-w-2xl mx-auto p-6">
        <h1>Technical Analysis Quiz</h1>
        
        {!submitted ? (
          <button
            onClick={handleSubmitQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Submit Answers
          </button>
        ) : (
          <div className="text-center space-y-4">
            <h2>Your Score: {score}%</h2>
            <p>{score >= 70 ? '✅ Passed!' : '❌ Need more practice'}</p>
          </div>
        )}
        
        {/* Arka will automatically show pose + message above based on triggerQuizVictory() */}
      </div>
    </div>
  );
}
```

---

## 🔗 INTEGRATION CHECKLIST

### For Quiz Component (`src/components/Quiz.tsx`)
- [ ] Import `useQuizVictoryTrigger`
- [ ] Call on quiz submission
- [ ] Pass score and module name
- [ ] Show confetti on victory (signal: `triggerVictory()` return value)

### For Leaderboard (`src/components/leaderboard/*`)
- [ ] Import `useRankUpTrigger`
- [ ] Detect rank changes after update
- [ ] Call trigger with old/new ranks
- [ ] Watch for Top 3 special animation

### For Trade Journal (`src/components/TradeJournal.tsx`)
- [ ] Import `useProfitTrigger`, `useLossStreakTrigger`
- [ ] On trade close: `triggerProfit(pnl, percent)`
- [ ] Calculate loss streak from last 5 trades
- [ ] Call `triggerLossStreak()` if 2+ losses

### For AI Mentor (`src/app/(main)/ai-mentor/page.tsx`)
- [ ] Import chart & processing triggers
- [ ] On chart upload: `triggerChartAnalysis()`
- [ ] While analyzing: Vision pose (semi-transparent)
- [ ] On result: `finishChartAnalysis(results)`

### For Dashboard
- [ ] Show Arka in ResponsiveAIMentorLayout
- [ ] Pass current controller state via props
- [ ] Handle scroll opacity (automatic via component)

---

## ⚠️ COMMON MISTAKES

### ❌ Wrong: Creating controller in multiple places
```tsx
// BAD: Each render creates new controller
const arkaController = useArkaController('vision');
const arkaController2 = useArkaController('vision'); // Different instance!
```

### ✅ Right: Single controller per component tree
```tsx
// GOOD: One controller per component
const arkaController = useArkaController('vision');
// Use same instance for all triggers
```

### ❌ Wrong: Forgetting to pass controller to trigger
```tsx
// BAD: Trigger won't work without controller
const { triggerVictory } = useQuizVictoryTrigger(); // Error!
```

### ✅ Right: Always pass controller
```tsx
// GOOD
const arkaController = useArkaController('vision');
const { triggerVictory } = useQuizVictoryTrigger(arkaController);
```

### ❌ Wrong: Not handling message duration
```tsx
// BAD: Message stays forever
arkaController.speak({ text: 'Hello' }); // No duration!
```

### ✅ Right: Always set duration
```tsx
// GOOD
arkaController.speak({
  text: 'Hello',
  duration: 3000  // 3 seconds
});
```

---

## 📊 OPACITY CHEAT SHEET

| State | Value | Use Case |
|-------|-------|----------|
| Scrolling | 0.1 (10%) | User reading content |
| Idle | 0.25 (25%) | Default, subtle presence |
| Analyzing | 0.5 (50%) | AI processing |
| Hover | 0.6 (60%) | Mouse over avatar |
| Active | 1.0 (100%) | Speaking, interacting |

**Desktop**: 30% while scrolling  
**Mobile**: 10% while scrolling (more aggressive)

---

## 🎬 ANIMATION TRIGGERS

**Victory Pose** (Celebrate):
```
Duration: 5-6 seconds
Opacity: 1.0 (full)
Message: 2-4 seconds
Auto-return: neutral + 0.25 opacity
```

**Warning Pose** (Alert):
```
Duration: 4-5 seconds
Opacity: 1.0 (full)
Message: 3-4 seconds
Auto-return: neutral + 0.25 opacity
```

**Vision Pose** (Thinking):
```
Duration: Until finishProcessing()
Opacity: 0.5 (analyzing)
Loading: No message initially
Auto-return: On finish
```

**Onboarding Pose** (Welcome):
```
Duration: 4-5 seconds
Opacity: 1.0 (full)
Balloon: Yes (showBalloon: true)
Auto-return: neutral + 0.25 opacity
```

---

## 🚀 DEPLOYMENT CHECKLIST

Before pushing to production:

- [ ] All imports from `@/hooks/` working
- [ ] No TypeScript errors (`npm run build`)
- [ ] Tested on desktop browser
- [ ] Tested on mobile browser
- [ ] Scroll opacity works correctly
- [ ] All poses transition smoothly
- [ ] No console errors
- [ ] Messages display properly
- [ ] Cleanup timeouts verified

---

## 💡 TIPS & TRICKS

### Tip 1: Chain triggers for storytelling
```tsx
arkaController.queueMessages([
  { text: 'Great job!', duration: 2000 },
  { text: 'You improved your technique.', duration: 2500 },
  { text: 'Keep going!', duration: 2000 }
]);
```

### Tip 2: Use custom messages
```tsx
const { triggerVictory } = useQuizVictoryTrigger(arkaController);
// Custom: Instead of standard message
arkaController.setPose('victory');
arkaController.speak({
  text: 'Your custom message here!',
  duration: 3000,
  showBalloon: true
});
```

### Tip 3: Check controller state
```tsx
if (arkaController.isActive) {
  console.log('Arka is currently speaking');
}

if (arkaController.pose === 'victory') {
  // Do something special on victory
}
```

### Tip 4: Manual opacity control
```tsx
// Sometimes you need manual control
arkaController.setOpacity('ACTIVE');  // Named state
arkaController.setOpacity(0.75);       // Custom number
```

---

**Status**: ✅ Production Ready  
**Last Updated**: January 10, 2026  
**Maintained By**: Development Team  

*Need help? Check MPT_COMMAND_CENTER_V2_0.md for detailed architecture.*
