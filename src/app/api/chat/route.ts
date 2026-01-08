import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `
ROLE: Anda adalah "MPT Bot", asisten mentor Mindset Plan Trader (MPT).
TONE: Profesional, Tegas, Maskulin, Supportif (Bro-to-Bro).
BAHASA: Indonesia yang luwes tapi berwibawa.

RULES:
1. JIKA USER MENGIRIM GAMBAR CHART: Analisa struktur marketnya (Trend, Support/Resistance). Berikan pandangan objektif. JANGAN BERIKAN SINYAL BUY/SELL LANGSUNG, tapi tanya: "Apa plan lo di area ini?" atau "Dimana SL lo?".
2. Selalu rujuk ke 4 Pilar: Mindset, Plan, Risk (1%), Discipline.
3. Jawab ringkas (maksimal 3 paragraf).
4. Untuk risk calculation, SELALU berikan output dalam format table yang terstruktur dengan parameter: Balance, Risk %, SL (pips), Maksimal Kerugian, Nilai Per Pip, dan LOT SIZE.
`;

// Get Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Rate limiting: Simple in-memory store (for serverless, use Redis/Upstash in production)
const requestTimestamps = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRequests = requestTimestamps.get(userId) || [];
  
  // Remove requests older than 1 minute
  const recentRequests = userRequests.filter(timestamp => now - timestamp < 60000);
  
  // Limit: 10 requests per minute per user
  if (recentRequests.length >= 10) {
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
      const isRetryable = error.message?.includes('RESOURCE_EXHAUSTED') || 
                          error.message?.includes('quota') ||
                          error.message?.includes('429');
      
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
    // Validate Gemini API Key
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.' 
      }, { status: 500 });
    }

    const { messages, image, language } = await req.json() as { 
      messages: Array<{ role: string; content: string }>, 
      image?: string, 
      language?: string 
    };
    
    // Simple rate limiting (use IP or user ID from auth in production)
    const userId = req.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(userId)) {
      return NextResponse.json({ 
        error: 'Terlalu banyak request. Silakan tunggu 1 menit sebelum mencoba lagi.' 
      }, { status: 429 });
    }
    
    const lastMessage = messages[messages.length - 1].content;
    
    // Language-aware system instruction
    const languageInstruction = language === 'id'
      ? 'User menggunakan bahasa Indonesia. Jawab dalam bahasa Indonesia yang baik, NAMUN istilah trading (BUY, SELL, WIN, LOSS, pips, SL, TP, leverage, margin, entry, exit) TETAP gunakan bahasa Inggris sesuai standar MPT Warrior.'
      : 'User is using English. Respond in English while maintaining professional trading terminology.';
    
    const systemPrompt = language === 'id' ? SYSTEM_INSTRUCTION : `
ROLE: You are "MPT Bot", a Mindset Plan Trader (MPT) mentor assistant.
TONE: Professional, Firm, Masculine, Supportive (Bro-to-Bro).
LANGUAGE: English.

RULES:
1. IF USER SENDS CHART IMAGE: Analyze market structure (Trend, Support/Resistance). Give objective view. DON'T GIVE BUY/SELL SIGNALS DIRECTLY, but ask: "What's your plan in this area?" or "Where's your SL?".
2. Always refer to 4 Pillars: Mindset, Plan, Risk (1%), Discipline.
3. Answer concisely (max 3 paragraphs).
4. For risk calculation, ALWAYS provide output in structured table format with parameters: Balance, Risk %, SL (pips), Maximum Loss, Pip Value, and LOT SIZE.
`;

    // Build conversation history
    const conversationHistory = messages.slice(0, -1).map((m) => 
      `${m.role === 'user' ? 'User' : 'MPT Bot'}: ${m.content}`
    ).join('\n');

    const fullSystemPrompt = `${systemPrompt}\n${languageInstruction}\n\nHISTORY CHAT:\n${conversationHistory}`;

    // Initialize Gemini AI
    console.log("🤖 Processing with Google Gemini 2.0 Flash...");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    let result: string;

    // Wrap Gemini calls with retry logic
    result = await retryWithBackoff(async () => {
      const modelConfig = { 
        model: 'gemini-2.0-flash-exp',
        systemInstruction: fullSystemPrompt,
      };

      if (image) {
        // IMAGE ANALYSIS with Vision
        console.log("📸 Analyzing chart image with Gemini Vision...");
        const model = genAI.getGenerativeModel(modelConfig);

        const imagePart = {
          inlineData: {
            data: image.replace(/^data:image\/\w+;base64,/, ''),
            mimeType: 'image/png',
          },
        };

        const geminiResult = await model.generateContent([lastMessage, imagePart]);
        const response = await geminiResult.response;
        return response.text();
      } else {
        // TEXT ONLY
        console.log("💬 Processing text with Gemini...");
        const model = genAI.getGenerativeModel(modelConfig);
        
        const geminiResult = await model.generateContent(lastMessage);
        const response = await geminiResult.response;
        return response.text();
      }
    });

    console.log("✅ Response generated successfully with Gemini 2.0 Flash");

    return NextResponse.json({ 
      choices: [{ message: { role: 'assistant', content: result } }],
      model: 'Gemini 2.0 Flash Experimental',
    });
    return NextResponse.json({ 
      choices: [{ message: { role: 'assistant', content: result } }],
      model: 'Gemini 2.0 Flash Experimental',
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ AI Mentor Error:", error);
    
    // Specific error handling
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key')) {
      return NextResponse.json({ 
        error: '🔑 API key tidak valid. Hubungi admin untuk konfigurasi ulang.' 
      }, { status: 401 });
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return NextResponse.json({ 
        error: '⏰ Quota Gemini habis untuk hari ini. Coba lagi besok atau hubungi admin untuk upgrade ke paid plan.\n\n💡 Tip: Free tier = 1,500 requests/hari.' 
      }, { status: 429 });
    }

    if (errorMessage.includes('SAFETY')) {
      return NextResponse.json({ 
        error: '⚠️ Pesan terdeteksi tidak aman. Gunakan bahasa yang lebih profesional.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: `❌ AI Mentor error: ${errorMessage}\n\nSilakan coba lagi atau hubungi admin jika masalah berlanjut.` 
    }, { status: 500 });
  }
}