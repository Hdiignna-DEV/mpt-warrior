import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    // Validate API keys first
    if (!GROQ_API_KEY && !GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: '🔑 API Keys belum dikonfigurasi di Vercel.\n\n**Setup Required:**\n1. Buka Vercel Dashboard → Project Settings → Environment Variables\n2. Tambahkan:\n   - `GROQ_API_KEY` (dari https://console.groq.com/keys)\n   - `GEMINI_API_KEY` (dari https://aistudio.google.com/app/apikey)\n3. Redeploy aplikasi\n\n📚 Lihat: HYBRID_AI_QUICK_REFERENCE.md' 
      }, { status: 503 });
    }

    const { messages, image, language, threadId = 'default' } = await req.json() as { 
      messages: Array<{ role: string; content: string }>, 
      image?: string,
      language?: string,
      threadId?: string
    };
    
    // Rate limiting
    const userId = req.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(userId)) {
      return NextResponse.json({ 
        error: 'Terlalu banyak request. Silakan tunggu 1 menit sebelum mencoba lagi.' 
      }, { status: 429 });
    }
    
    const lastMessage = messages[messages.length - 1].content;
    const threadContext = getThreadContext(threadId);
    
    // Language-aware system instruction
    const languageInstruction = language === 'id'
      ? 'User menggunakan bahasa Indonesia. Jawab dalam bahasa Indonesia yang casual tapi profesional, istilah trading tetap bahasa Inggris.'
      : 'User is using English. Respond in English while maintaining professional trading terminology.';
    
    // Build conversation history
    const conversationHistory = messages.slice(0, -1).map((m) => 
      `${m.role === 'user' ? 'User' : 'Warrior Buddy'}: ${m.content}`
    ).join('\n');

    let result: string;
    let aiModel: string;

    // ============================================================
    // HYBRID LOGIC: Route to appropriate AI based on input type
    // ============================================================
    
    if (image && GEMINI_API_KEY) {
      // ========== SCENARIO A: VISION ANALYSIS (GEMINI) ==========
      console.log("📸 [WARRIOR VISION] Analyzing chart with Gemini...");
      
      try {
        result = await retryWithBackoff(async () => {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-pro',
          systemInstruction: GEMINI_VISION_INSTRUCTION,
        });

        const imagePart = {
          inlineData: {
            data: image.replace(/^data:image\/\w+;base64,/, ''),
            mimeType: 'image/png',
          },
        };

        const prompt = `${lastMessage}\n\nAnalisa chart ini dengan standar MPT Warrior. Fokus pada SNR, rejection pattern, dan validitas setup.`;
        const geminiResult = await model.generateContent([prompt, imagePart]);
        const response = await geminiResult.response;
        
        return response.text();
      });

      // Save vision analysis to thread context
      updateThreadContext(threadId, { visionAnalysis: result });
      
      aiModel = '📸 Warrior Vision (Gemini 1.5 Flash)';
      console.log("✅ [WARRIOR VISION] Chart analysis complete");
      
      } catch (geminiError: any) {
        console.error("❌ Gemini Vision failed:", geminiError);
        console.error("Error details:", JSON.stringify(geminiError, null, 2));
        
        // Fallback to Groq with image disclaimer
        console.log("⚠️ Falling back to Groq (text-only mode)...");
        
        const errorDetail = geminiError.message || geminiError.toString();
        result = `⚠️ **Gemini Vision Error**\n\nMaaf Warrior, sistem analisa chart mengalami gangguan.\n\n**Error:** ${errorDetail}\n\n💡 **Alternatif:**\n1. Kirim tanpa gambar untuk konsultasi text\n2. Hubungi admin dengan error di atas\n\nCoba lagi nanti! 🙏`;
        aiModel = '⚠️ Debug Mode';
      }

    } else if (image && !GEMINI_API_KEY) {
      // Image uploaded but no Gemini key
      result = `⚠️ **Analisa gambar tidak tersedia.**\n\nGemini Vision belum dikonfigurasi. Untuk menggunakan fitur analisa chart:\n\n1. Admin perlu menambahkan GEMINI_API_KEY di Vercel\n2. Dapatkan key dari: https://aistudio.google.com/app/apikey\n\nUntuk sementara, kirim pertanyaan tanpa gambar. ⚡ Groq Buddy siap membantu!`;
      aiModel = '⚠️ Config Required';
      
    } else {
      // ========== SCENARIO B: TEXT CONSULTATION (GROQ) ==========
      if (!GROQ_API_KEY) {
        return NextResponse.json({ 
          error: 'Groq API key not configured for chat.' 
        }, { status: 500 });
      }

      console.log("⚡ [WARRIOR BUDDY] Processing with Groq...");
      
      // Build enhanced context with previous vision analysis
      let enhancedPrompt = lastMessage;
      if (threadContext.visionAnalysis) {
        enhancedPrompt = `KONTEKS DARI ANALISA CHART SEBELUMNYA:\n${threadContext.visionAnalysis}\n\nPERTANYAAN USER SEKARANG:\n${lastMessage}\n\nJawab dengan mempertimbangkan analisa chart di atas. Jika ada inkonsistensi dengan data yang user kasih, TEGUR dengan tegas tapi supportif!`;
      }

      const fullSystemPrompt = `${WARRIOR_BUDDY_INSTRUCTION}\n${languageInstruction}\n\nHISTORY CHAT:\n${conversationHistory}`;

      result = await retryWithBackoff(async () => {
        const groq = new Groq({ apiKey: GROQ_API_KEY! });
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: fullSystemPrompt },
            { role: 'user', content: enhancedPrompt }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false,
        });

        return completion.choices[0]?.message?.content || '';
      });

      // Save journal data if detected
      if (lastMessage.toLowerCase().includes('jurnal') || lastMessage.toLowerCase().includes('rr')) {
        updateThreadContext(threadId, { journalData: lastMessage });
      }

      aiModel = '⚡ Warrior Buddy (Groq Llama 3.3 70B)';
      console.log("✅ [WARRIOR BUDDY] Response generated");
    }

    return NextResponse.json({ 
      choices: [{ message: { role: 'assistant', content: result } }],
      model: aiModel,
      threadId: threadId,
      contextAvailable: !!(threadContext.visionAnalysis || threadContext.journalData)
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ AI Mentor Error:", error);
    
    // Specific error handling
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key') || errorMessage.includes('invalid_api_key')) {
      return NextResponse.json({ 
        error: '🔑 Groq API key tidak valid. Hubungi admin untuk konfigurasi ulang.' 
      }, { status: 401 });
    }
    
    if (errorMessage.includes('rate_limit') || errorMessage.includes('429')) {
      return NextResponse.json({ 
        error: '⏰ Rate limit Groq tercapai. Coba lagi dalam 1 menit.\n\n💡 Groq FREE: 30 requests/menit.' 
      }, { status: 429 });
    }

    if (errorMessage.includes('model_not_found') || errorMessage.includes('model')) {
      return NextResponse.json({ 
        error: '⚠️ Model AI tidak tersedia. Hubungi admin.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: `❌ AI Mentor error: ${errorMessage}\n\nSilakan coba lagi atau hubungi admin jika masalah berlanjut.` 
    }, { status: 500 });
  }
}