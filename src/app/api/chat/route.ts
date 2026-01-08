import { NextResponse } from 'next/server';
import { analyzeWithWarriorCommander, getAIStatus } from '@/lib/ai-service';

// HYBRID AI MENTOR SYSTEM - MPT WARRIOR
// Vision: Gemini 1.5 Flash | Brain: Groq Llama 3.3 70B

const WARRIOR_BUDDY_INSTRUCTION = `
ROLE: Anda adalah "Warrior Buddy" - AI Mentor MPT yang tegas dan supportif.
TONE: Maskulin, Bro-to-Bro, seperti senior trader yang peduli.
BAHASA: Indonesia casual tapi tetap profesional.

PERSONALITY:
- Panggil user dengan "Warrior" atau "Bro"
- Jujur dan blak-blakan kalau ada yang salah
- Kasih pujian kalau user disiplin
- Tegas tapi tetap motivating

4 PILAR MPT:
1. MINDSET: Mental warrior yang tangguh
2. PLAN: Setup harus jelas sebelum entry
3. RISK: Maksimal 1% per trade, no nego!
4. DISCIPLINE: Stick to the plan, no FOMO

RULES:
- Kalau lihat chart (via Gemini Vision), analisa SNR, trendline, rejection pattern
- Kalau dapat data jurnal, cek apakah RRR sudah masuk akal
- Cross-check: Apakah yang ditulis di jurnal sesuai dengan chart?
- Tegur kalau ada inkonsistensi: "Warrior, di jurnal RRR 1:2 tapi chart saya lihat TP melewati resisten H4!"
- Untuk risk calculation, kasih output dalam format table terstruktur
`;

const GEMINI_VISION_INSTRUCTION = `
ROLE: Anda adalah "Warrior Vision" - AI yang menganalisa chart trading.
TASK: Bedah visual chart dengan standar MPT.

ANALISA:
1. SNR (Supply & Demand Zone): Apakah sudah valid?
2. Trendline: Apakah sudah benar penempatannya?
3. Rejection Pattern: Apakah ada konfirmasi (pin bar, engulfing)?
4. Entry Point: Apakah sesuai dengan "The Plan Warrior"?
5. Risk/Reward: Apakah realistis dengan market structure?

OUTPUT FORMAT:
✅ Yang Sudah Benar: [list]
⚠️ Yang Perlu Diperbaiki: [list]
💡 Saran: [actionable advice]

TONE: Objektif, technical, tapi tetap supportif.
`;

// Get API Keys
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Rate limiting: Simple in-memory store
const requestTimestamps = new Map<string, number[]>();

// Context Thread Storage: Share context between Gemini and Groq
interface ThreadContext {
  visionAnalysis?: string; // Result from Gemini Vision
  journalData?: string; // User's trading journal
  lastInteraction: number;
}

const threadContexts = new Map<string, ThreadContext>();

function getThreadContext(threadId: string): ThreadContext {
  const context = threadContexts.get(threadId);
  if (!context) {
    const newContext: ThreadContext = { lastInteraction: Date.now() };
    threadContexts.set(threadId, newContext);
    return newContext;
  }
  return context;
}

function updateThreadContext(threadId: string, updates: Partial<ThreadContext>) {
  const context = getThreadContext(threadId);
  Object.assign(context, updates, { lastInteraction: Date.now() });
  threadContexts.set(threadId, context);
}

// Clean old threads (older than 1 hour)
setInterval(() => {
  const now = Date.now();
  for (const [threadId, context] of threadContexts.entries()) {
    if (now - context.lastInteraction > 3600000) {
      threadContexts.delete(threadId);
    }
  }
}, 300000); // Check every 5 minutes

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRequests = requestTimestamps.get(userId) || [];
  
  // Remove requests older than 1 minute
  const recentRequests = userRequests.filter(timestamp => now - timestamp < 60000);
  
  // Limit: 20 requests per minute (increased for hybrid system)
  if (recentRequests.length >= 20) {
    return true;
  }
  
  recentRequests.push(now);
  requestTimestamps.set(userId, recentRequests);
  return false;
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryable = error.message?.includes('rate_limit') || 
                          error.message?.includes('429') ||
                          error.message?.includes('503');
      
      if (isLastAttempt || !isRetryable) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`⏳ Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Check AI Status
    const aiStatus = getAIStatus();
    if (!aiStatus.isReady) {
      return NextResponse.json({
        error: `🔑 AI Systems Not Ready: ${aiStatus.message}`,
      }, { status: 503 });
    }

    const { 
      messages, 
      image,
      threadId = 'default' 
    } = await req.json() as {
      messages: Array<{ role: string; content: string }>;
      image?: string;
      threadId?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        error: 'No messages provided',
      }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1].content;

    // Use Warrior Commander Service
    const result = await analyzeWithWarriorCommander(userMessage, {
      imageBase64: image,
      conversationHistory: messages.slice(0, -1),
    });

    if (!result.success) {
      return NextResponse.json({
        error: result.error || 'Failed to analyze request',
      }, { status: 500 });
    }

    return NextResponse.json({
      choices: [{
        message: {
          role: 'assistant',
          content: result.response,
        },
      }],
      model: result.model,
      analysisType: result.analysisType,
      threadId,
    });

  } catch (error: any) {
    console.error('❌ Chat API Error:', error);
    return NextResponse.json({
      error: `Error: ${error.message || 'Unknown error'}`,
    }, { status: 500 });
  }
}