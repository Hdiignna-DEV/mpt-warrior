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

    try {
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
        result = response.text();
      } else {
        // TEXT ONLY
        console.log("💬 Processing text with Gemini...");
        const model = genAI.getGenerativeModel(modelConfig);
        
        const geminiResult = await model.generateContent(lastMessage);
        const response = await geminiResult.response;
        result = response.text();
      }

      console.log("✅ Response generated successfully with Gemini 2.0 Flash");

      return NextResponse.json({ 
        choices: [{ message: { role: 'assistant', content: result } }],
        model: 'Gemini 2.0 Flash Experimental',
      });
    } catch (geminiError: any) {
      console.error("❌ Gemini API error:", geminiError);
      
      // Provide helpful error messages
      if (geminiError.message?.includes('API_KEY_INVALID') || geminiError.message?.includes('API key')) {
        return NextResponse.json({ 
          error: 'Gemini API key tidak valid. Silakan periksa konfigurasi API key.' 
        }, { status: 401 });
      }
      
      if (geminiError.message?.includes('quota') || geminiError.message?.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json({ 
          error: 'Quota Gemini API habis. Silakan coba lagi dalam beberapa menit atau upgrade ke paid plan.' 
        }, { status: 429 });
      }

      if (geminiError.message?.includes('SAFETY')) {
        return NextResponse.json({ 
          error: 'Konten terdeteksi tidak aman. Mohon gunakan bahasa yang lebih profesional.' 
        }, { status: 400 });
      }
      
      throw geminiError;
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ AI Mentor Error:", error);
    
    return NextResponse.json({ 
      error: `AI Mentor mengalami gangguan: ${errorMessage}. Silakan coba lagi.` 
    }, { status: 500 });
  }
}