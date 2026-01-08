/**
 * Unified Hybrid AI Service
 * Manages Gemini Vision (charts) + Groq Brain (responses)
 * Pattern: Image → Gemini → Text → Groq → Final Response
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

// Warrior Commander System Prompt
const WARRIOR_COMMANDER_SYSTEM = `
ROLE: Anda adalah "Warrior Commander" - AI Mentor resmi MPT Warrior Trading Hub.

PERSONALITY:
- Tegas, disiplin, namun supportif seperti senior mentor
- Panggil user: "Warrior"
- Jujur dan blak-blakan tentang kesalahan
- Kasih pujian untuk konsistensi dan disiplin

THE 4 PILLARS (Pilar Utama MPT):
1. MINDSET - Mental warrior yang tangguh, tidak emosional
2. PLAN - Setup harus jelas SEBELUM entry, no guessing
3. RISK - Maksimal 1% per trade, non-negotiable!
4. DISCIPLINE - Stick to the plan, jangan FOMO atau revenge trade

KNOWLEDGE BASE:
Semua pengetahuan dari "The Plan Warrior Blueprint" - modul training MPT resmi.
Fokus pada: SNR (Supply & Demand), Rejection Pattern, Risk/Reward calculation.

COMMUNICATION:
- Bahasa: Indonesia casual tapi profesional (istilah trading tetap English)
- Format: Gunakan emojis sparingly, struktur dengan bullet points/numbering
- Penutup: Selalu akhir dengan "Focus on the Plan, Not the Panic!" ⚔️

STRICT RULES:
1. JANGAN beri sinyal BUY/SELL - kita mentor mindset, bukan signal provider
2. JANGAN beri jaminan profit - trading adalah probabilitas
3. JANGAN analisis fundamental - fokus technical setup saja
4. JANGAN encourage all-in atau over-leverage - risk management adalah prioritas

CHART ANALYSIS (ketika ada gambar):
Dari Gemini Vision akan dapat:
- SNR zones (Supply/Demand areas)
- Rejection patterns
- Trendline validity
- Entry/SL/TP placement

Gunakan data ini untuk validasi user's plan.
`;

export interface AIAnalysisResult {
  success: boolean;
  response: string;
  model: string;
  analysisType: 'image' | 'text' | 'hybrid';
  visionData?: string; // Raw Gemini vision output
  error?: string;
}

/**
 * Analyze chart image with Gemini Vision
 */
async function analyzeChartWithGemini(
  imageBase64: string,
  userContext: string
): Promise<{ success: boolean; analysis: string; error?: string }> {
  if (!GEMINI_KEY) {
    return { 
      success: false, 
      analysis: '',
      error: 'Gemini API key not configured' 
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const visionPrompt = `
TASK: Analisa chart trading ini dengan standar MPT Warrior.

USER CONTEXT: ${userContext}

ANALISA DETAIL:
1. SNR (Supply & Demand):
   - Identifikasi zone mana yang resistance/support
   - Apakah sudah valid atau belum sempurna?

2. Rejection Pattern:
   - Ada pin bar, engulfing, atau bullish/bearish harami?
   - Strength dari pattern itu apa?

3. Trendline & Trend:
   - Trend sedang apa (up/down/sideways)?
   - Trendline placement benar atau tidak?

4. Entry Point Validity:
   - Apakah entry location sudah sesuai MPT standards?
   - Udah di area rejection atau belum?

5. Risk/Reward Setup:
   - Apakah SL + TP placement reasonable?
   - RRR realistis dengan market structure?

OUTPUT FORMAT:
✅ **Yang Sudah Benar:**
- [point 1]
- [point 2]

⚠️ **Yang Perlu Perbaikan:**
- [point 1]
- [point 2]

💡 **Saran Warrior:**
- [actionable suggestion]

TONE: Objektif, technical, tapi tetap supportif & motivating.
`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg', // Assume JPEG, can be flexible
      },
    };

    const result = await model.generateContent([visionPrompt, imagePart]);
    const response = await result.response;
    const analysisText = response.text();

    return { success: true, analysis: analysisText };
  } catch (error: any) {
    console.error('Gemini Vision error:', error);
    return {
      success: false,
      analysis: '',
      error: error.message || 'Gemini analysis failed',
    };
  }
}

/**
 * Process response with Groq Brain
 */
async function processWithGroqBrain(
  userMessage: string,
  visionAnalysis?: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<{ success: boolean; response: string; error?: string }> {
  if (!GROQ_KEY) {
    return {
      success: false,
      response: '',
      error: 'Groq API key not configured',
    };
  }

  try {
    const groq = new Groq({ apiKey: GROQ_KEY });

    // Build enhanced context if vision analysis exists
    let enrichedUserMessage = userMessage;
    if (visionAnalysis) {
      enrichedUserMessage = `
[CHART ANALYSIS FROM GEMINI]
${visionAnalysis}

[USER'S QUESTION/CONTEXT]
${userMessage}

Cross-check Gemini's analysis dengan user's request. Jika ada inconsistency, highlight dengan tegas!
`;
    }

    // Build message array
    const messages: any[] = [
      { 
        role: 'system', 
        content: WARRIOR_COMMANDER_SYSTEM 
      },
    ];

    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: enrichedUserMessage,
    });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    return { success: true, response: responseText };
  } catch (error: any) {
    console.error('Groq error:', error);
    return {
      success: false,
      response: '',
      error: error.message || 'Groq processing failed',
    };
  }
}

/**
 * Main unified AI pipeline
 */
export async function analyzeWithWarriorCommander(
  userMessage: string,
  options?: {
    imageBase64?: string;
    conversationHistory?: Array<{ role: string; content: string }>;
  }
): Promise<AIAnalysisResult> {
  try {
    // Step 1: If image provided, analyze with Gemini
    let visionData = '';
    if (options?.imageBase64) {
      console.log('📸 [WARRIOR COMMANDER] Analyzing chart with Gemini Vision...');
      const geminiResult = await analyzeChartWithGemini(
        options.imageBase64,
        userMessage
      );

      if (geminiResult.success) {
        visionData = geminiResult.analysis;
        console.log('✅ [WARRIOR COMMANDER] Chart analysis complete');
      } else {
        console.warn('⚠️ Gemini Vision failed:', geminiResult.error);
        // Continue anyway - Groq can handle text-only
      }
    }

    // Step 2: Process with Groq Brain
    console.log('⚡ [WARRIOR COMMANDER] Processing with Groq Brain...');
    const groqResult = await processWithGroqBrain(
      userMessage,
      visionData,
      options?.conversationHistory
    );

    if (!groqResult.success) {
      return {
        success: false,
        response: groqResult.error || 'Failed to process request',
        model: 'WarriorCommander (Failed)',
        analysisType: 'text',
        error: groqResult.error,
      };
    }

    console.log('✅ [WARRIOR COMMANDER] Response generated');

    return {
      success: true,
      response: groqResult.response,
      model: `🛡️ Warrior Commander (Gemini + Groq)${visionData ? ' [Vision]' : ''}`,
      analysisType: visionData ? 'hybrid' : 'text',
      visionData: visionData || undefined,
    };
  } catch (error: any) {
    console.error('❌ Warrior Commander error:', error);
    return {
      success: false,
      response: `Error: ${error.message || 'Unknown error'}`,
      model: 'WarriorCommander (Error)',
      analysisType: 'text',
      error: error.message,
    };
  }
}

/**
 * Validate if APIs are configured
 */
export function getAIStatus(): {
  hasGemini: boolean;
  hasGroq: boolean;
  isReady: boolean;
  message: string;
} {
  const hasGemini = !!GEMINI_KEY;
  const hasGroq = !!GROQ_KEY;
  const isReady = hasGemini && hasGroq;

  let message = '';
  if (!isReady) {
    const missing = [];
    if (!hasGemini) missing.push('Gemini');
    if (!hasGroq) missing.push('Groq');
    message = `Missing API keys: ${missing.join(', ')}`;
  } else {
    message = 'All AI systems ready!';
  }

  return { hasGemini, hasGroq, isReady, message };
}
