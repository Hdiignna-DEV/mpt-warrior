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

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API Key hilang' }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 🔥 PERBAIKAN DISINI: Balik ke "gemini-flash-latest" (Jalur Aman & Gratis)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); 

    const { messages, image } = await req.json(); 
    const lastMessage = messages[messages.length - 1].content;

    const conversationHistory = messages.slice(0, -1).map((m: any) => 
      `${m.role === 'user' ? 'User' : 'MPT Bot'}: ${m.content}`
    ).join('\n');

    const finalPrompt = `
    ${SYSTEM_INSTRUCTION}
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
    
  } catch (error: any) {
    console.error("Error Backend:", error);
    return NextResponse.json({ error: `Gagal: ${error.message}` }, { status: 500 });
  }
}