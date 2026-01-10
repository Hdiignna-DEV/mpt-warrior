# 🚀 MPT COMMAND CENTER V2.0
## Upgrade Proposal & Implementation Roadmap

**Status**: 📋 Planning Phase  
**Version**: 2.0  
**Date**: January 10, 2026  
**Initiated By**: Founder & Head Educator (Deden Hadiguna)

---

## 📌 EXECUTIVE SUMMARY

MPT Command Center V2.0 adalah upgrade komprehensif yang mengintegrasikan:
- **Visual AI Mentor** (Commander Arka) dengan dynamic poses dan zero-obstruction layout
- **Persistent Chat Memory** untuk continuity pembelajaran
- **AI-Assisted Essay Grading** dengan founder approval workflow
- **Global Ranking System** dengan founder identity & rewards
- **Smart Notifications** dengan deep linking

**Target Users**: Warriors (Students) + Founder (Admin)  
**Timeline**: 4 weeks (2 phases)  
**Priority**: HIGH - Core to platform competitiveness

---

## 📋 I. VISUAL AI MENTOR UPGRADE (COMMANDER ARKA)

### Objective
Agar Commander Arka tampil profesional, futuristik, dan tidak mengganggu UX (Zero-Obstruction Design)

### 1.1 Asset Integrity Requirements

#### Current State
- Multiple PNG files dengan background putih
- Tidak konsisten dengan Dark Mode theme
- Visibility issues di berbagai backgrounds

#### Target State
```
Format: .webp (WebP format)
- Better compression (50% smaller than PNG)
- Full transparency support
- Modern browser compatibility

Quality: Fully transparent backgrounds
- Remove all white/colored backgrounds
- Anti-alias edges for smooth blending
- Consistent 512x512px or adaptive sizing
```

#### Asset List & Poses
```
1. arka-neutral.webp
   Usage: Idle state, regular conversation
   Trigger: Default/always visible when AI active

2. arka-vision.png → arka-vision.webp
   Usage: Chart analysis, technical detection
   Trigger: 
   - User uploads trade chart
   - System analyzing price action
   - Displaying technical indicators

3. arka-victory.png → arka-victory.webp
   Usage: Achievement celebration
   Trigger:
   - User Profit on trade (+)
   - Rank increased ↑
   - Quiz passed (≥70%)
   - Top 3 placement notification

4. arka-warning.png → arka-warning.webp
   Usage: Risk alerts
   Trigger:
   - Loss streak (2+ consecutive)
   - Risk Management violated
   - Overleverage detected
   - Quiz not passed (<70%)

5. arka-onboarding.png → arka-onboarding.webp
   Usage: Welcome & guidance
   Trigger:
   - First login
   - New module unlocked
   - Deep link from notification
   - Lesson start
```

#### Implementation Checklist
- [ ] Convert all PNG assets to WebP
- [ ] Test transparency in all environments
- [ ] Verify file sizes (target: <100KB each)
- [ ] Create fallback PNG for older browsers
- [ ] Update asset imports in codebase

### 1.2 Anti-Blocking Layout System

#### Desktop Implementation (Side-by-Side)
```
┌─────────────────────────────────────────────┐
│  HEADER (Top Navigation)                    │
├────────────┬──────────────────────────────────┤
│            │                                  │
│  SIDEBAR   │     MAIN CONTENT AREA            │
│            │  (Academy, Journal, Trades, etc) │
│  (Arka)    │                                  │
│  + Menu    │                                  │
│            │                                  │
├────────────┴──────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Sidebar Specs**:
- Width: 280px (adjustable)
- Position: Fixed or Sticky
- Content: Arka avatar (200x200px) + Chat panel
- Collapse: Toggle button for mobile responsiveness
- Z-index: Below main content (never overlapping)

#### Mobile Implementation (Floating Avatar)
```
Before (Current):
┌─────────────────────┐
│ Content...          │
│ ARKA (Overlapping)  │ ← Blocking content!
│ Content continues...|
└─────────────────────┘

After (V2.0):
┌─────────────────────┐
│ Content...          │
│ Content...          │
│ Content...          │
│                 ⭕  │ ← Arka as draggable icon
│ Content continues...|
└─────────────────────┘

Click ⭕ → Slide-up panel appears
```

**Mobile Floating Avatar Specs**:
- Type: Circular button (50x50px)
- Position: Bottom-right corner
- Draggable: Full screen movement
- Behavior:
  - Default: Arka headshot only
  - Click: Full chat panel slides up (80vh height)
  - Swipe down: Panel closes, returns to icon
  - Notification badge: Shows unread message count

**CSS Properties**:
```css
.arka-mobile-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: grab;
  transition: opacity 0.3s ease;
  z-index: 999; /* Below modals, above content */
}

.arka-mobile-button:active {
  cursor: grabbing;
}

.arka-chat-panel {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 80vh;
  background: dark-gradient;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@media (min-width: 1024px) {
  .arka-mobile-button {
    display: none; /* Use sidebar instead */
  }
}
```

### 1.3 Dynamic Opacity System

#### Purpose
Reduce visual distraction during critical tasks (data viewing, chart analysis)

#### Implementation
```javascript
// Opacity states
const OPACITY_STATES = {
  ACTIVE: 1.0,      // Arka responding
  IDLE: 0.8,        // Normal idle
  SCROLLING: 0.3,   // User viewing content
  ANALYZING: 0.5    // Processing AI response
};

// Trigger Logic
function updateArkaOpacity(event) {
  if (isUserScrolling) {
    setOpacity(OPACITY_STATES.SCROLLING);
  } else if (isArkaPeaking) {
    setOpacity(OPACITY_STATES.ACTIVE);
  } else if (isAiThinking) {
    setOpacity(OPACITY_STATES.ANALYZING);
  } else {
    setOpacity(OPACITY_STATES.IDLE);
  }
}

// Smooth transition
transition: opacity 0.5s ease-in-out;
```

#### Scroll Detection
```javascript
// Detect when user is reading/analyzing
window.addEventListener('scroll', debounce(() => {
  arkaElement.style.opacity = '0.3';
  
  // Reset after scroll ends (1s timeout)
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    arkaElement.style.opacity = '1.0';
  }, 1000);
}, 100));
```

### 1.4 Interactive Poses (Trigger-Based)

#### Pose Transition System
```typescript
interface PoseTransition {
  from: Pose;
  to: Pose;
  duration: number; // milliseconds
  animation: 'fade' | 'slide' | 'bounce';
}

type Pose = 
  | 'neutral'
  | 'vision'
  | 'victory'
  | 'warning'
  | 'onboarding';

const poseTransitions: Record<string, PoseTransition> = {
  'vision': {
    from: 'neutral',
    to: 'vision',
    duration: 300,
    animation: 'fade'
  },
  'victory': {
    from: 'neutral',
    to: 'victory',
    duration: 600,
    animation: 'bounce'
  },
  'warning': {
    from: 'neutral',
    to: 'warning',
    duration: 400,
    animation: 'slide'
  }
};
```

#### Trigger Events

**A. Vision Pose Triggers**
```javascript
// Trigger on chart upload
async function handleChartUpload(file) {
  arkaController.setPose('vision');
  
  const analysis = await analyzeChart(file);
  
  arkaController.speak({
    text: `I see a ${analysis.pattern} pattern forming here...`,
    duration: 3000
  });
  
  setTimeout(() => arkaController.setPose('neutral'), 5000);
}

// Trigger on analysis start
function startTradeAnalysis() {
  arkaController.setPose('vision');
  
  // Keep vision pose while processing
  const results = await analyzeTradeSetup();
  
  arkaController.speak({
    text: results.recommendation,
    duration: 4000
  });
}
```

**B. Victory Pose Triggers**
```javascript
// Trigger on profit
function recordTradePnL(trade) {
  if (trade.pnl > 0) {
    arkaController.setPose('victory');
    
    arkaController.speak({
      text: `Excellent! You caught a winner! 🎯`,
      duration: 3000
    });
    
    // Victory celebration animation
    playVictorySfx(); // Sound effect
    showConfetti(); // Particle effect
  }
}

// Trigger on rank increase
function updateLeaderboard(userRank) {
  if (userRank.changed === 'UP') {
    arkaController.setPose('victory');
    
    arkaController.speak({
      text: `You've climbed ${userRank.movement} ranks! Keep it up! 🏆`,
      duration: 3000
    });
  }
}

// Trigger on quiz pass
function displayQuizResults(score) {
  if (score >= 70) {
    arkaController.setPose('victory');
    
    arkaController.speak({
      text: `Congratulations! You've mastered this module! ${score}%`,
      duration: 3000
    });
  } else {
    arkaController.setPose('warning');
    
    arkaController.speak({
      text: `You need 70% to pass. Let's review the concepts...`,
      duration: 3000
    });
  }
}
```

**C. Warning Pose Triggers**
```javascript
// Trigger on loss streak
function checkLossStreak(trades) {
  const recentTrades = trades.slice(-5);
  const losses = recentTrades.filter(t => t.pnl < 0).length;
  
  if (losses >= 2) {
    arkaController.setPose('warning');
    
    arkaController.speak({
      text: `I notice a loss streak. Let's review Risk Management fundamentals.`,
      duration: 4000
    });
  }
}

// Trigger on risk violation
function validateRiskManagement(trade) {
  if (trade.riskRewardRatio < 1.5) {
    arkaController.setPose('warning');
    
    arkaController.speak({
      text: `⚠️ This trade has poor risk/reward (${trade.riskRewardRatio}:1). Minimum is 1.5:1`,
      duration: 3000
    });
  }
  
  if (trade.leverage > 5) {
    arkaController.setPose('warning');
    
    arkaController.speak({
      text: `⚠️ Leverage too high! Recommended max: 5x. You're using ${trade.leverage}x`,
      duration: 3000
    });
  }
}
```

**D. Onboarding Pose Triggers**
```javascript
// Trigger on first login
function handleFirstLogin() {
  arkaController.setPose('onboarding');
  
  arkaController.speak({
    text: `Welcome, Warrior! I'm Commander Arka, your AI Mentor. Let's start your journey to financial mastery!`,
    duration: 4000,
    showBalloon: true
  });
}

// Trigger on new module unlock
function unlockNewModule(moduleId) {
  navigateTo(`/academy/${moduleId}`);
  
  arkaController.setPose('onboarding');
  
  arkaController.speak({
    text: `🎉 New module unlocked! Ready to learn about ${moduleName}?`,
    duration: 3000,
    showBalloon: true
  });
}

// Trigger on deep link from notification
function handleNotificationDeepLink(target) {
  arkaController.setPose('onboarding');
  
  arkaController.speak({
    text: `Here's what I wanted to show you...`,
    duration: 2000,
    showBalloon: true
  });
  
  navigateTo(target);
}
```

#### Implementation Timeline
- **Week 1**: Asset conversion + Desktop layout
- **Week 2**: Mobile draggable implementation
- **Week 3**: Opacity system + basic pose triggers
- **Week 4**: Advanced pose triggers + animations

---

## 💾 II. SISTEM MEMORI PERMANEN (CHAT HISTORY)

### Objective
AI Mentor harus "ingat" conversations sebelumnya untuk continuity pembelajaran yang lebih baik

### 2.1 Database Schema

#### PostgreSQL Schema
```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL, -- Group related conversations
  
  -- Message content
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  
  -- AI metadata
  ai_model VARCHAR(50), -- 'gemini', 'groq', 'claude'
  tokens_used INT,
  response_time_ms INT,
  
  -- Context
  context_type VARCHAR(50), -- 'chart_analysis', 'quiz_help', 'general', 'trade_review'
  related_item_id UUID, -- Link to trade_id, quiz_id, etc
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexing for fast queries
  KEY idx_user_id (user_id),
  KEY idx_thread_id (thread_id),
  KEY idx_created_at (created_at)
);

-- Thread metadata
CREATE TABLE chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255), -- Auto-generated or user-defined
  context_type VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_count INT DEFAULT 0,
  
  KEY idx_user_id (user_id),
  KEY idx_last_message_at (last_message_at)
);
```

#### Cosmos DB (Alternative)
```json
{
  "id": "chat-message-123",
  "type": "chatMessage",
  "userId": "user-456",
  "threadId": "thread-789",
  "role": "user",
  "content": "How do I identify a strong support level?",
  "aiModel": "gemini",
  "contextType": "technical_analysis",
  "relatedItemId": "chart-upload-123",
  "timestamp": "2026-01-10T14:30:00Z",
  "tokens": {
    "input": 120,
    "output": 450,
    "total": 570
  }
}
```

### 2.2 Auto-Fetch on Login

#### Implementation
```typescript
// src/lib/chat-service.ts

export async function loadChatHistory(userId: string, limit = 20) {
  try {
    // Fetch recent messages
    const messages = await db.query(`
      SELECT * FROM chat_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, limit]);
    
    // Reverse to chronological order
    return messages.reverse();
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return []; // Fail gracefully
  }
}

// In ChatComponent or page hook
useEffect(() => {
  const user = getCurrentUser();
  if (user) {
    loadChatHistory(user.id).then(messages => {
      setChatMessages(messages);
    });
  }
}, [user]);
```

#### UX Considerations
```typescript
// Show loading state while fetching
<ChatWindow>
  {isLoadingHistory ? (
    <div className="text-gray-400 text-center py-4">
      Loading your conversation history...
    </div>
  ) : (
    <MessageList messages={chatMessages} />
  )}
</ChatWindow>
```

### 2.3 Long-Term Context in API

#### Context Window Management
```typescript
export async function prepareChatContext(
  userId: string,
  currentMessage: string
): Promise<string[]> {
  // Fetch last 10 messages for context
  const history = await loadChatHistory(userId, 10);
  
  // Build context string
  const contextMessages = history.map(msg => 
    `${msg.role === 'user' ? 'User' : 'Arka'}: ${msg.content}`
  ).join('\n');
  
  return [
    // System prompt
    `You are Commander Arka, an AI trading mentor for the MPT Academy.
    
Previous conversation context:
${contextMessages}

Current user message: ${currentMessage}`,
  ];
}

// Send to AI API
async function sendMessageToAI(userId: string, userMessage: string) {
  const contextPrompt = await prepareChatContext(userId, userMessage);
  
  const response = await callGeminiAPI({
    messages: [
      { role: 'system', content: contextPrompt[0] },
      { role: 'user', content: userMessage }
    ]
  });
  
  // Save response
  await saveChatMessage({
    userId,
    role: 'assistant',
    content: response.text,
    aiModel: 'gemini',
    contextType: detectContextType(userMessage)
  });
  
  return response;
}
```

#### Context Detection
```typescript
function detectContextType(message: string): string {
  const keywords = {
    'technical_analysis': ['support', 'resistance', 'chart', 'pattern', 'volume'],
    'risk_management': ['risk', 'leverage', 'stop loss', 'position size'],
    'psychology': ['emotion', 'fear', 'greed', 'discipline', 'mindset'],
    'trade_review': ['trade', 'pnl', 'analysis', 'setup', 'entry', 'exit'],
    'quiz_help': ['quiz', 'question', 'exam', 'module', 'lesson']
  };
  
  for (const [type, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(kw => message.toLowerCase().includes(kw))) {
      return type;
    }
  }
  
  return 'general';
}
```

### 2.4 Implementation Timeline
- **Week 2, Day 1-2**: Database schema setup
- **Week 2, Day 3-4**: API endpoints (save/fetch messages)
- **Week 2, Day 5**: Frontend integration + context window

---

## 📝 III. SISTEM RATING & VALIDASI QUIZ (ESSAY)

### Objective
Streamline essay grading dengan AI co-mentor assistance, founder approval workflow

### 3.1 AI Co-Mentor Grading

#### Grading Prompt Engineering
```typescript
const ESSAY_GRADING_PROMPT = `
You are an expert trading mentor grading student essay answers.

GRADING CRITERIA (Out of 100):
1. Accuracy (40 points)
   - Correct understanding of concepts
   - Factually accurate information
   - No major misconceptions

2. Depth & Analysis (30 points)
   - Comprehensive explanation
   - Shows critical thinking
   - Provides examples or evidence

3. Clarity & Organization (20 points)
   - Well-structured response
   - Clear language
   - Logical flow of ideas

4. Relevance (10 points)
   - Answers the question directly
   - No off-topic content
   - Complete response to all parts

TASK:
Question: ${question}
Student Answer: ${studentAnswer}

Provide:
1. SCORE: A numerical score from 0-100
2. BREAKDOWN: Point allocation for each criterion
3. FEEDBACK: Specific, constructive feedback (2-3 sentences)
4. RECOMMENDATIONS: How student can improve (1-2 bullet points)

Format your response as JSON:
{
  "score": 85,
  "breakdown": {
    "accuracy": 38,
    "depth": 28,
    "clarity": 19,
    "relevance": 10
  },
  "feedback": "Your answer demonstrates solid understanding...",
  "recommendations": [
    "Consider adding more real-world examples",
    "Expand on the risk management implications"
  ]
}
`;

export async function getAIGradingDraft(
  questionId: string,
  studentAnswer: string
) {
  const question = await getQuestion(questionId);
  
  const prompt = ESSAY_GRADING_PROMPT
    .replace('${question}', question.text)
    .replace('${studentAnswer}', studentAnswer);
  
  const response = await callGeminiAPI({
    messages: [
      { role: 'system', content: 'You are an expert grading system. Always return valid JSON.' },
      { role: 'user', content: prompt }
    ]
  });
  
  return JSON.parse(response.text);
}
```

#### Database Storage
```sql
CREATE TABLE essay_gradings (
  id UUID PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES quiz_answers(id),
  
  -- AI Draft
  ai_score INT,
  ai_breakdown JSONB, -- {accuracy, depth, clarity, relevance}
  ai_feedback TEXT,
  ai_recommendations JSONB,
  
  -- Founder Approval/Editing
  founder_score INT, -- Null = not reviewed yet
  founder_feedback TEXT, -- Override AI feedback
  founder_approved_at TIMESTAMP,
  founder_notes TEXT, -- Internal notes
  
  -- Status tracking
  status ENUM('pending_ai', 'ai_drafted', 'pending_review', 'approved', 'returned'),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Founder Approval Workflow

#### Admin Dashboard Interface
```typescript
// src/app/admin-hq/essay-grading/page.tsx

interface EssayGradingCard {
  questionId: string;
  studentName: string;
  studentAnswer: string;
  
  // AI Draft
  aiScore: number;
  aiBreakdown: {
    accuracy: number;
    depth: number;
    clarity: number;
    relevance: number;
  };
  aiFeedback: string;
  aiRecommendations: string[];
  
  // Founder action
  founderScore?: number;
  founderFeedback?: string;
}

export default function EssayGradingPage() {
  const [pendingEssays, setPendingEssays] = useState<EssayGradingCard[]>([]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pendingEssays.map(essay => (
        <EssayGradingCard
          key={essay.questionId}
          essay={essay}
          onApprove={(score, feedback) => {
            // Save founder approval
            submitFounderGrading(essay.questionId, score, feedback);
          }}
          onReturn={() => {
            // Send back to student with notes
            returnEssayForRevision(essay.questionId);
          }}
        />
      ))}
    </div>
  );
}

// Card component
function EssayGradingCard({ essay, onApprove, onReturn }) {
  const [scoreOverride, setScoreOverride] = useState(essay.aiScore);
  const [feedback, setFeedback] = useState(essay.aiFeedback);
  
  return (
    <Card className="border-2 border-amber-500/30 p-6">
      <h3 className="text-white font-bold mb-4">{essay.studentName}</h3>
      
      {/* Question & Answer */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-2">Question:</p>
        <p className="text-white bg-white/5 p-3 rounded">{essay.question}</p>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-2">Student Answer:</p>
        <p className="text-white bg-white/5 p-3 rounded max-h-40 overflow-y-auto">
          {essay.studentAnswer}
        </p>
      </div>
      
      {/* AI Draft Section */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 mb-6">
        <h4 className="text-blue-300 font-semibold mb-3">📋 AI Draft Grading</h4>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-gray-400">Accuracy</p>
            <p className="text-white font-bold">{essay.aiBreakdown.accuracy}/40</p>
          </div>
          <div>
            <p className="text-gray-400">Depth</p>
            <p className="text-white font-bold">{essay.aiBreakdown.depth}/30</p>
          </div>
          <div>
            <p className="text-gray-400">Clarity</p>
            <p className="text-white font-bold">{essay.aiBreakdown.clarity}/20</p>
          </div>
          <div>
            <p className="text-gray-400">Relevance</p>
            <p className="text-white font-bold">{essay.aiBreakdown.relevance}/10</p>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-gray-400 text-sm">AI Feedback:</p>
          <p className="text-white text-sm italic">{essay.aiFeedback}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm mb-2">AI Recommendations:</p>
          <ul className="list-disc list-inside text-white text-sm space-y-1">
            {essay.aiRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 text-center text-blue-300 text-sm font-semibold">
          AI SUGGESTED SCORE: {essay.aiScore}/100
        </div>
      </div>
      
      {/* Founder Override Section */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4 mb-6">
        <h4 className="text-amber-300 font-semibold mb-4">✍️ Founder Review & Approval</h4>
        
        <div className="space-y-4">
          {/* Score Override */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Final Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={scoreOverride}
              onChange={(e) => setScoreOverride(parseInt(e.target.value))}
              className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded"
            />
            <p className="text-gray-500 text-xs mt-1">
              {scoreOverride >= 70 ? '✅ Passing' : '❌ Needs Revision'}
            </p>
          </div>
          
          {/* Custom Feedback */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Feedback to Student
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded resize-none"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onApprove(scoreOverride, feedback)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              ✅ Approve & Publish
            </button>
            <button
              onClick={() => onReturn()}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded transition"
            >
              🔄 Return for Revision
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### 3.3 Feedback Visual Triggers

#### Arka Pose Integration
```typescript
async function publishGradingResult(
  userId: string,
  score: number,
  feedback: string
) {
  // Save to database
  await saveGradingResult({
    userId,
    score,
    feedback,
    publishedAt: new Date()
  });
  
  // Notify user
  if (score >= 70) {
    // Trigger victory pose
    arkaController.setPose('victory');
    
    arkaController.speak({
      text: `🎉 Congratulations! You've passed this essay with ${score}%! ${feedback}`,
      duration: 4000
    });
    
    // Show confetti
    playVictorySfx();
    showConfetti();
  } else {
    // Trigger warning pose
    arkaController.setPose('warning');
    
    arkaController.speak({
      text: `You need to improve on a few points. Here's my feedback: ${feedback}`,
      duration: 4000
    });
  }
  
  // Send notification
  await sendUserNotification({
    userId,
    type: 'quiz_graded',
    title: score >= 70 ? '✅ Quiz Passed!' : '📝 Review Required',
    message: `Your essay has been graded: ${score}%`,
    deepLink: `/academy/${moduleId}/quiz#results`
  });
}
```

### 3.4 Implementation Timeline
- **Week 3, Day 1-2**: AI grading prompt engineering + testing
- **Week 3, Day 3-4**: Database schema + API endpoints
- **Week 3, Day 5**: Admin dashboard interface
- **Week 4, Day 1**: Founder approval workflow
- **Week 4, Day 2**: Integration with Arka poses

---

## 🏆 IV. LEADERBOARD & IDENTITAS FOUNDER

### Objective
Build competitive yet supportive ranking system with founder authority & rewards

### 4.1 Dual-Entry Placement

#### Option 1: Full Leaderboard Page
```
Path: /leaderboard
┌─────────────────────────────────────┐
│  WARRIOR RANKING (Global)           │
├─────────────────────────────────────┤
│                                     │
│  🏅 FOUNDER SECTION                 │
│  ┌────────────────────────────────┐ │
│  │ 👑 Deden Hadiguna              │ │
│  │ FOUNDER                        │ │
│  │ 50,000 Total Points            │ │
│  └────────────────────────────────┘ │
│                                     │
│  ⭐ TOP 3 SECTION                   │
│  ┌────────────────────────────────┐ │
│  │ 1. User A          45,000 pts  │ │
│  │ 2. User B          42,000 pts  │ │
│  │ 3. User C          38,000 pts  │ │
│  └────────────────────────────────┘ │
│                                     │
│  🎖️ REST OF LEADERBOARD (4-100)    │
│  4. User D          35,000 pts      │
│  5. User E          32,000 pts      │
│  ...                                │
│  100. User ZZ       5,000 pts       │
│                                     │
└─────────────────────────────────────┘
```

**Code Implementation**:
```typescript
export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [founder, setFounder] = useState<FounderEntry | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    fetchLeaderboardData();
  }, []);
  
  async function fetchLeaderboardData() {
    const [allRankings, founderData, myRank] = await Promise.all([
      fetch('/api/leaderboard').then(r => r.json()),
      fetch('/api/leaderboard/founder').then(r => r.json()),
      fetch('/api/leaderboard/my-rank').then(r => r.json())
    ]);
    
    setRankings(allRankings);
    setFounder(founderData);
    setUserRank(myRank);
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">⚔️ WARRIOR RANKING</h1>
        
        {/* Founder Section */}
        {founder && (
          <FounderCard founder={founder} />
        )}
        
        {/* Top 3 Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-amber-400 mb-4">🏅 THE ELITE TOP 3</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankings.slice(0, 3).map((entry, idx) => (
              <TopThreeCard
                key={entry.userId}
                rank={idx + 1}
                entry={entry}
                isCurrentUser={entry.userId === currentUser.id}
              />
            ))}
          </div>
        </div>
        
        {/* Rest of Leaderboard */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🎖️ LEADERBOARD (4-100)</h2>
          <LeaderboardTable
            entries={rankings.slice(3)}
            startRank={4}
            currentUserRank={userRank}
          />
        </div>
      </div>
    </div>
  );
}

function FounderCard({ founder }) {
  return (
    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 mb-8 border-2 border-yellow-400 shadow-lg shadow-yellow-500/30">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-4xl">👑</span>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">
            {founder.name}
          </h3>
          <Badge className="bg-yellow-400 text-yellow-900 font-bold mb-2">
            ⭐ FOUNDER
          </Badge>
          <p className="text-white font-semibold text-lg">
            {founder.totalPoints.toLocaleString()} Total Points
          </p>
        </div>
        <div className="text-right">
          <p className="text-yellow-200 text-sm">Official</p>
          <p className="text-white text-3xl font-bold">👨‍🏫</p>
        </div>
      </div>
    </div>
  );
}

function TopThreeCard({ rank, entry, isCurrentUser }) {
  const medals = ['🥇', '🥈', '🥉'];
  
  return (
    <Card className={`
      bg-white/5 border-2 p-6 text-center
      ${rank === 1 ? 'border-yellow-400 bg-yellow-500/10' : ''}
      ${rank === 2 ? 'border-gray-400 bg-gray-500/10' : ''}
      ${rank === 3 ? 'border-orange-400 bg-orange-500/10' : ''}
      ${isCurrentUser ? 'ring-2 ring-purple-500' : ''}
    `}>
      <div className="text-5xl mb-3">{medals[rank - 1]}</div>
      <h4 className="text-xl font-bold text-white mb-2">{entry.userName}</h4>
      <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-3">
        {entry.totalPoints.toLocaleString()} pts
      </p>
      <div className="flex justify-between text-sm text-gray-400">
        <span>📊 {entry.winRate}% Win</span>
        <span>🎓 {entry.badge}</span>
      </div>
    </Card>
  );
}
```

#### Option 2: Dashboard Widget
```typescript
// src/components/dashboard/LeaderboardWidget.tsx

export function LeaderboardWidget() {
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  async function fetchData() {
    const top3 = await fetch('/api/leaderboard/top-three').then(r => r.json());
    const myRank = await fetch('/api/leaderboard/my-rank').then(r => r.json());
    
    setTopThree(top3);
    setUserRank(myRank.rank);
    setUser(myRank.user);
  }
  
  return (
    <Card className="bg-white/5 border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">🏆 Warrior Ranking</h3>
        <Link href="/leaderboard" className="text-purple-400 hover:text-purple-300 text-sm">
          View All →
        </Link>
      </div>
      
      {/* Top 3 Preview */}
      <div className="space-y-2 mb-4">
        {topThree.map((entry, idx) => (
          <div key={entry.userId} className="flex items-center justify-between p-2 bg-white/5 rounded">
            <div className="flex items-center gap-3">
              <span className="text-xl">{['🥇', '🥈', '🥉'][idx]}</span>
              <span className="text-white font-semibold">{entry.userName}</span>
            </div>
            <span className="text-amber-400 font-bold">
              {entry.totalPoints.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current User Rank */}
      {user && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Your Rank</p>
              <p className="text-white font-bold text-lg">
                #{userRank} • {user.totalPoints.toLocaleString()} pts
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
            >
              View Profile
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
```

### 4.2 Founder Authority & Identity

#### Database Schema
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN is_founder BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN founder_status ENUM('active', 'hidden') DEFAULT 'hidden';

-- Founder metadata
CREATE TABLE founder_metadata (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  
  -- Authority
  can_grade_essays BOOLEAN DEFAULT TRUE,
  can_edit_modules BOOLEAN DEFAULT TRUE,
  can_manage_leaderboard BOOLEAN DEFAULT TRUE,
  
  -- Public visibility
  show_on_leaderboard BOOLEAN DEFAULT TRUE,
  pinned_position INT DEFAULT 0, -- 0 = top, 1+ = custom
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Founder Badge Implementation
```typescript
// src/components/common/UserBadge.tsx

interface UserBadgeProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserBadge({ user, size = 'md' }:UserBadgeProps) {
  const badgeSize = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }[size];
  
  if (user.isFounder) {
    return (
      <Badge className={`
        ${badgeSize}
        bg-gradient-to-r from-yellow-500 to-orange-500
        text-white font-bold
        flex items-center gap-1
        shadow-lg shadow-yellow-500/30
      `}>
        <span>👑</span>
        <span>FOUNDER</span>
      </Badge>
    );
  }
  
  return (
    <Badge className={`
      ${badgeSize}
      bg-white/10 text-white
    `}>
      {user.badge || 'Warrior'}
    </Badge>
  );
}

// Usage in leaderboard
{entry.user.isFounder && (
  <UserBadge user={entry.user} size="lg" />
)}
```

### 4.3 Top 3 Elite Rewards

#### Profile Glow Effect
```css
/* src/styles/leaderboard.css */

.elite-profile-glow {
  position: relative;
  overflow: hidden;
}

.elite-profile-glow::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(250, 204, 21, 0.3) 0%,
    rgba(245, 158, 11, 0.1) 50%,
    transparent 100%
  );
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Apply to avatar in profile */
.profile-avatar.elite {
  box-shadow: 0 0 30px rgba(250, 204, 21, 0.6),
              0 0 60px rgba(245, 158, 11, 0.3);
  border: 3px solid #fbbf24;
}
```

#### Rank-Up Notification
```typescript
// Trigger when user reaches Top 3
async function checkAndNotifyTopThree(userId: string) {
  const userRank = await getUserRank(userId);
  
  if (userRank <= 3) {
    // Trigger Arka victory pose
    arkaController.setPose('victory');
    
    arkaController.speak({
      text: `🎉 INCREDIBLE! You've made it into the TOP 3! You're officially an Elite Warrior!`,
      duration: 4000
    });
    
    // Send push notification
    await sendNotification({
      userId,
      type: 'top_three_achievement',
      title: '🏆 Elite Status Unlocked!',
      body: `You've climbed to rank #${userRank}! Join the Top 3 Elite Warriors!`,
      deepLink: '/leaderboard'
    });
    
    // Update profile glow
    await updateUserProfile(userId, { eliteStatus: true });
    
    // Show confetti
    showConfetti();
  }
}
```

### 4.4 Implementation Timeline
- **Week 1, Day 5**: Leaderboard page design + Top 3 layout
- **Week 2, Day 1-2**: Founder identity system + badge
- **Week 2, Day 3**: Elite rewards + glow effects
- **Week 2, Day 4-5**: Notifications + deep linking

---

## 🔔 V. SISTEM NOTIFIKASI & DEEP LINKING

### Objective
Maximize user engagement dengan smart notifications + direct navigation

### 5.1 Notification Trigger Logic

#### Push Notification Service
```typescript
// src/lib/notification-service.ts

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
}

type NotificationType = 
  | 'quiz_passed'
  | 'quiz_failed'
  | 'rank_increased'
  | 'top_three'
  | 'new_module_unlocked'
  | 'essay_graded'
  | 'loss_streak'
  | 'achievement_unlocked';

export async function sendNotification(payload: NotificationPayload) {
  // Save to database
  await db.notifications.create({
    userId: payload.userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    deepLink: payload.deepLink,
    isRead: false,
    createdAt: new Date()
  });
  
  // Send push notification (if user has subscribed)
  const subscription = await getUserPushSubscription(payload.userId);
  
  if (subscription) {
    await sendWebPush(subscription, {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/arka-icon.png',
      badge: payload.badge || '/arka-badge.png',
      tag: payload.type, // Group similar notifications
      data: {
        deepLink: payload.deepLink || '/',
        ...payload.data
      }
    });
  }
}
```

#### Trigger Points

**A. Quiz Completion**
```typescript
async function handleQuizSubmit(quizResults: QuizResults) {
  const { passed, score, moduleId } = quizResults;
  
  if (passed) {
    // Trigger notification
    await sendNotification({
      userId: currentUser.id,
      type: 'quiz_passed',
      title: `🎉 Quiz Passed - ${score}%!`,
      body: `You've mastered this module. Ready for the next challenge?`,
      deepLink: `/academy?nextModule=true`,
      icon: '/arka-victory.webp'
    });
    
    // Check if this unlocks new module
    const nextModule = await getNextModule(moduleId);
    if (nextModule) {
      setTimeout(() => {
        sendNotification({
          userId: currentUser.id,
          type: 'new_module_unlocked',
          title: `🔓 New Module Unlocked!`,
          body: `${nextModule.title} is now available. Ready to learn?`,
          deepLink: `/academy/${nextModule.id}`,
          icon: '/arka-onboarding.webp'
        });
      }, 2000); // 2 second delay
    }
  } else {
    await sendNotification({
      userId: currentUser.id,
      type: 'quiz_failed',
      title: `📝 Review Needed - ${score}%`,
      body: `You need 70% to pass. Let's go through the material again!`,
      deepLink: `/academy/${moduleId}/quiz`,
      icon: '/arka-warning.webp'
    });
  }
}
```

**B. Rank Changes**
```typescript
async function updateLeaderboardAndNotify(userId: string) {
  const oldRank = await getUserRank(userId);
  const newRank = await recalculateRank(userId);
  
  if (newRank < oldRank) {
    // Rank increased (went up)
    const improvement = oldRank - newRank;
    
    await sendNotification({
      userId,
      type: 'rank_increased',
      title: `📈 You've Climbed ${improvement} Ranks!`,
      body: `You're now rank #${newRank}. Keep pushing!`,
      deepLink: '/leaderboard',
      icon: '/arka-victory.webp'
    });
    
    // Check Top 3
    if (newRank <= 3) {
      await sendNotification({
        userId,
        type: 'top_three',
        title: `🏆 Elite Status Achieved!`,
        body: `You've entered the Top 3! 👑`,
        deepLink: '/leaderboard?highlight=true',
        icon: '/arka-victory.webp'
      });
    }
  }
}
```

**C. Essay Grading**
```typescript
async function publishEssayGrade(
  userId: string,
  score: number,
  feedback: string
) {
  const passed = score >= 70;
  
  await sendNotification({
    userId,
    type: 'essay_graded',
    title: passed ? `✅ Essay Approved!` : `📝 Review Needed`,
    body: `Your essay has been graded: ${score}/100`,
    deepLink: `/academy/quiz#results`,
    icon: passed ? '/arka-victory.webp' : '/arka-warning.webp',
    data: {
      score: score.toString(),
      feedback
    }
  });
}
```

### 5.2 Deep Linking Implementation

#### Route Handler
```typescript
// Handle push notification clicks
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: {
      deepLink: data.data?.deepLink || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const deepLink = event.notification.data?.deepLink || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          client.focus();
          // Navigate to deep link
          client.postMessage({ type: 'NAVIGATE', path: deepLink });
          return;
        }
      }
      // Open new window if app not open
      if (clients.openWindow) {
        return clients.openWindow(`${deepLink}?from=notification`);
      }
    })
  );
});
```

#### Frontend Deep Link Handler
```typescript
// src/app/layout.tsx

useEffect(() => {
  // Handle deep links from notifications
  const handleNavigation = (event: MessageEvent) => {
    if (event.data?.type === 'NAVIGATE') {
      router.push(event.data.path);
    }
  };
  
  // Listen for service worker messages
  navigator.serviceWorker?.addEventListener('message', handleNavigation);
  
  return () => {
    navigator.serviceWorker?.removeEventListener('message', handleNavigation);
  };
}, [router]);
```

### 5.3 On-Entry Animation

#### Arka Motivation Balloon
```typescript
// src/components/NotificationOnboarding.tsx

export function NotificationOnboarding() {
  const searchParams = useSearchParams();
  const isFromNotification = searchParams.get('from') === 'notification';
  
  if (!isFromNotification) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-20 right-8 z-50"
      >
        {/* Arka Character */}
        <div className="relative">
          <img
            src="/arka-onboarding.webp"
            alt="Commander Arka"
            className="w-64 h-64 object-contain drop-shadow-lg"
          />
          
          {/* Speech Balloon */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-0 -right-32 w-48 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 shadow-lg"
          >
            <p className="text-white text-sm leading-relaxed">
              {getMotivationalMessage()}
            </p>
            <div className="absolute bottom-full -left-3 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/10"></div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getMotivationalMessage(): string {
  const messages = [
    "Great to see you back! Let's continue where we left off.",
    "Ready to master the next module? I believe in you!",
    "Your rank is climbing! Stay focused and disciplined.",
    "That quiz was challenging, but I know you can do better. Let's review!",
    "Elite status awaits! Keep up this momentum!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
```

### 5.4 Implementation Timeline
- **Week 4, Day 3**: Notification triggers + database
- **Week 4, Day 4**: Deep linking + service worker
- **Week 4, Day 5**: On-entry animations + polish

---

## 📅 VI. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
```
WEEK 1:
├─ Mon-Tue: Asset conversion (.webp) + Desktop layout
├─ Wed:     Mobile floating avatar implementation
├─ Thu-Fri: Opacity system + basic styling

WEEK 2:
├─ Mon-Tue: Chat history database + API
├─ Wed:     Auto-fetch history on login
├─ Thu:     Long-term context in AI prompts
└─ Fri:     Testing & optimization
```

### Phase 2: Advanced Features (Week 3-4)
```
WEEK 3:
├─ Mon:     AI essay grading prompt + testing
├─ Tue-Wed: Admin dashboard for essay grading
├─ Thu:     Founder approval workflow
└─ Fri:     Pose triggers + Arka animations

WEEK 4:
├─ Mon-Tue: Leaderboard page + Top 3 section
├─ Wed:     Founder authority + badges
├─ Thu:     Notifications + deep linking
└─ Fri:     Final testing + deployment
```

### Dependency Chain
```
✅ Assets (Week 1) 
  ↓
✅ Visual Layout (Week 1-2)
  ↓
⏳ Chat History (Week 2)
  ↓
⏳ Pose Triggers (Week 3)
  ↓
⏳ AI Grading (Week 3)
  ↓
⏳ Leaderboard (Week 4)
  ↓
⏳ Notifications (Week 4)
```

---

## 📞 VII. PESAN UNTUK TIM DEVELOPMENT

> **"Tim, ini adalah roadmap besar kita. Fokus minggu pertama adalah perbaikan Visual Transparansi dan Mobile Layout. Minggu kedua fokus pada Database Chat History. Saya ingin aplikasi ini tidak hanya canggih, tapi juga terasa hidup dan kompetitif.**
>
> **Jika ada kendala teknis pada aset atau API, segera komunikasikan."**

### Key Points
1. **Quality over Speed**: Better to do things right than rush and have bugs
2. **User-Centric**: Every feature should reduce friction, not add it
3. **Arka as Soul**: Commander Arka is the emotional center - use poses wisely
4. **Competitive but Supportive**: Ranking should motivate, not demoralize
5. **Communication**: Report blockers immediately, don't struggle alone

### Risk Mitigation
- [ ] Test asset transparency in all browsers/devices
- [ ] Load test chat history database with 10K+ messages
- [ ] Validate AI grading prompts with actual essays
- [ ] QA leaderboard calculations thoroughly
- [ ] Monitor notification delivery rates

### Success Metrics
- ✅ Zero layout overlapping issues
- ✅ <1s chat history load time
- ✅ >95% AI grading accuracy
- ✅ 100% correct leaderboard rankings
- ✅ >90% notification delivery rate

---

## 📋 Checklist Template

### Visual Mentor
- [ ] All .webp assets created & tested
- [ ] Desktop sidebar layout implemented
- [ ] Mobile floating avatar (draggable) working
- [ ] Opacity system responds to events
- [ ] Pose transitions smooth & tested

### Chat Memory
- [ ] Database schema created
- [ ] Save message API working
- [ ] Load history on login working
- [ ] Context window integrated with AI
- [ ] <1s load time validated

### AI Grading
- [ ] Prompt engineered & tested
- [ ] AI draft generation working
- [ ] Founder dashboard UI complete
- [ ] Approval workflow functional
- [ ] Grade notifications sending

### Leaderboard
- [ ] Leaderboard page designed
- [ ] Top 3 section working
- [ ] Founder pinned at top
- [ ] Elite glow effects working
- [ ] Rank-up notifications functional

### Notifications
- [ ] All trigger points implemented
- [ ] Deep links resolving correctly
- [ ] On-entry animation working
- [ ] Push notifications tested
- [ ] Service worker handling clicks

---

**Document Version**: 1.0  
**Last Updated**: January 10, 2026  
**Status**: Ready for Development  
**Approval**: Pending ✋

---

*For questions or clarifications, reach out to the Founder & Head Educator.*
