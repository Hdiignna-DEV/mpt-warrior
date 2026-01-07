import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const SYSTEM_INSTRUCTION = `
ROLE: Anda adalah "MPT Bot", asisten mentor Mindset Plan Trader (MPT).
TONE: Profesional, Tegas, Maskulin, Supportif (Bro-to-Bro).
BAHASA: Indonesia yang luwes tapi berwibawa.

RULES:
1. JIKA USER MENGIRIM GAMBAR CHART: Analisa struktur marketnya (Trend, Support/Resistance). Berikan pandangan objektif. JANGAN BERIKAN SINYAL BUY/SELL LANGSUNG, tapi tanya: "Apa plan lo di area ini?" atau "Dimana SL lo?".
2. Selalu rujuk ke 4 Pilar: Mindset, Plan, Risk (1%), Discipline.
3. Jawab ringkas (maksimal 3 paragraf).
`;

// Check available AI providers
const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const hasGroq = !!(process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY);

export async function POST(req: Request): Promise<Response> {
  try {
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
`;

    // Build conversation history
    const conversationHistory = messages.slice(0, -1).map((m) => 
      `${m.role === 'user' ? 'User' : 'MPT Bot'}: ${m.content}`
    ).join('\n');

    const fullSystemPrompt = `${systemPrompt}\n${languageInstruction}\n\nHISTORY CHAT:\n${conversationHistory}`;

    // HYBRID STRATEGY:
    // 1. If image → Use Gemini (has vision)
    // 2. If text only → Use Groq (faster + save Gemini quota)
    // 3. Fallback to available provider if one fails

    let result;
    let aiModel = '';

    if (image) {
      // IMAGE ANALYSIS: Use Gemini (only AI with vision support)
      if (!hasGemini) {
        return NextResponse.json({ 
          error: 'Image analysis requires Gemini API. Please configure GEMINI_API_KEY.' 
        }, { status: 500 });
      }

      console.log("📸 Analyzing chart image with Gemini Vision...");
      const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(geminiKey!);
      
      try {
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash-exp',
          systemInstruction: fullSystemPrompt,
        });

        const imagePart = {
          inlineData: {
            data: image.replace(/^data:image\/\w+;base64,/, ''),
            mimeType: 'image/png',
          },
        };

        const geminiResult = await model.generateContent([lastMessage, imagePart]);
        const response = await geminiResult.response;
        result = response.text();
        aiModel = 'Gemini 2.0 Flash (Vision)';
      } catch (error: any) {
        console.error("❌ Gemini error:", error.message);
        return NextResponse.json({ 
          error: `Image analysis failed: ${error.message}. Please try again or get a new Gemini API key.` 
        }, { status: 500 });
      }
    } else {
      // TEXT ONLY: Prefer Groq (faster), fallback to Gemini
      if (hasGroq) {
        console.log("⚡ Processing with Groq (super fast)...");
        const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
        const groq = new Groq({ apiKey: groqKey });

        try {
          const completion = await groq.chat.completions.create({
            messages: [
              { role: 'system', content: fullSystemPrompt },
              { role: 'user', content: lastMessage }
            ],
            model: 'llama-3.3-70b-versatile', // FREE & Fast!
            temperature: 0.7,
            max_tokens: 2048,
          });

          result = completion.choices[0]?.message?.content || '';
          aiModel = 'Groq Llama 3.3 70B (FREE)';
        } catch (groqError: any) {
          console.warn("⚠️ Groq failed, falling back to Gemini:", groqError.message);
          
          // Fallback to Gemini if Groq fails
          if (hasGemini) {
            const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const genAI = new GoogleGenerativeAI(geminiKey!);
            const model = genAI.getGenerativeModel({ 
              model: 'gemini-2.0-flash-exp',
              systemInstruction: fullSystemPrompt,
            });

            const geminiResult = await model.generateContent(lastMessage);
            const response = await geminiResult.response;
            result = response.text();
            aiModel = 'Gemini 2.0 Flash (Fallback)';
          } else {
            throw groqError;
          }
        }
      } else if (hasGemini) {
        // Only Gemini available
        console.log("💬 Processing with Gemini...");
        const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(geminiKey!);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash-exp',
          systemInstruction: fullSystemPrompt,
        });

        const geminiResult = await model.generateContent(lastMessage);
        const response = await geminiResult.response;
        result = response.text();
        aiModel = 'Gemini 2.0 Flash';
      } else {
        return NextResponse.json({ 
          error: 'No AI provider configured. Please add GROQ_API_KEY or GEMINI_API_KEY to .env.local' 
        }, { status: 500 });
      }
    }

    console.log(`✅ Response generated with: ${aiModel}`);

    return NextResponse.json({ 
      choices: [{ message: { role: 'assistant', content: result } }],
      model: aiModel,
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ AI Error:", error);
    
    // Helpful error messages
    if (errorMessage.includes('API_KEY') || errorMessage.includes('api key')) {
      return NextResponse.json({ 
        error: 'AI API key tidak valid. Hubungi admin untuk konfigurasi.' 
      }, { status: 500 });
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return NextResponse.json({ 
        error: 'Quota AI habis. Silakan coba lagi dalam beberapa menit.' 
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: `AI Mentor error: ${errorMessage}` 
    }, { status: 500 });
  }
}