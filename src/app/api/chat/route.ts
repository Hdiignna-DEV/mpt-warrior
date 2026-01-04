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
`;

export async function POST(req: Request): Promise<Response> {
  try {
    // Use the public API key (available on server in Next.js)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API Key hilang' }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 🔥 PERBAIKAN DISINI: Balik ke "gemini-flash-latest" (Jalur Aman & Gratis)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); 

    const { messages, image, language } = await req.json() as { messages: Array<{ role: string; content: string }>, image?: string, language?: string };
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
`;

    const conversationHistory = messages.slice(0, -1).map((m) => 
      `${m.role === 'user' ? 'User' : 'MPT Bot'}: ${m.content}`
    ).join('\n');

    const finalPrompt = `
    ${systemPrompt}
    ${languageInstruction}
    --------------------------------------------------
    HISTORY CHAT:
    ${conversationHistory}
    --------------------------------------------------
    PERTANYAAN USER SAAT INI: ${lastMessage}
    JAWABAN MPT BOT:
    `;

    let result;
    
    if (image) {
      console.log("Menerima Gambar Chart...");
      result = await model.generateContent([
        finalPrompt,
        {
          inlineData: {
            data: image, 
            mimeType: "image/png",
          },
        },
      ]);
    } else {
      console.log("Menerima Teks Biasa...");
      result = await model.generateContent(finalPrompt);
    }

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
        choices: [{ message: { role: 'assistant', content: text } }] 
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error Backend:", error);
    return NextResponse.json({ error: `Gagal: ${errorMessage}` }, { status: 500 });
  }
}