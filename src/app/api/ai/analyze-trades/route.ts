/**
 * AI Analyze Trades API
 * Uses Google Gemini 2.0 Flash (FREE) to analyze user's trading history
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateActiveUser } from '@/lib/middleware/auth';
import { getUserTrades, getUserTradeStats } from '@/lib/db/trade-service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    // Setup AI providers (Hybrid: Groq + Gemini)
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!geminiKey && !groqKey) {
      return NextResponse.json({ 
        error: 'No AI provider configured. Please add GROQ_API_KEY or GEMINI_API_KEY to .env.local' 
      }, { status: 500 });
    }

    const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;
    const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

    // Validate auth + active status
    const { decoded, error } = validateActiveUser(request);
    if (error) return error;

    // Get user's trades from Cosmos DB
    const trades = await getUserTrades(decoded!.userId);
    const stats = await getUserTradeStats(decoded!.userId);

    if (trades.length === 0) {
      return NextResponse.json({
        error: 'No trades found. Please add trades to your journal first.',
      }, { status: 400 });
    }

    // Prepare context for AI with additional insights
    const tradesSummary = trades.slice(0, 50).map(t => ({
      pair: t.pair,
      position: t.position,
      result: t.result,
      pips: t.pips,
      date: t.tradeDate.split('T')[0],
      notes: t.notes || '',
    }));

    // Calculate additional context
    const pairFrequency = trades.reduce((acc: any, t) => {
      acc[t.pair] = (acc[t.pair] || 0) + 1;
      return acc;
    }, {});
    const mostTradedPair = Object.entries(pairFrequency).sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'N/A';
    
    // Calculate consecutive wins/losses
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentStreakType = trades[0]?.result;
    
    trades.forEach(t => {
      if (t.result === currentStreakType) {
        currentStreak++;
      } else {
        if (currentStreakType === 'WIN') maxWinStreak = Math.max(maxWinStreak, currentStreak);
        if (currentStreakType === 'LOSS') maxLossStreak = Math.max(maxLossStreak, currentStreak);
        currentStreak = 1;
        currentStreakType = t.result;
      }
    });
    if (currentStreakType === 'WIN') maxWinStreak = Math.max(maxWinStreak, currentStreak);
    if (currentStreakType === 'LOSS') maxLossStreak = Math.max(maxLossStreak, currentStreak);

    // Build enhanced context-aware prompt based on user role
    const roleContext = decoded!.role === 'ADMIN' 
      ? `Anda sedang menganalisis data trading seorang Commander (ADMIN). Berikan insight yang mendalam dan strategis dengan fokus pada:
- Pola trading yang sistematis
- Konsistensi eksekusi strategi
- Analisis risk management tingkat lanjut
- Rekomendasi untuk optimasi sistem trading`
      : `Anda sedang menganalisis data trading seorang WARRIOR. Berikan feedback yang actionable dan motivasi untuk improvement dengan fokus pada:
- Kekuatan yang sudah dimiliki
- Area improvement yang spesifik dan achievable
- Motivasi untuk konsisten dengan plan
- Dukungan mental & mindset trading`;

    const prompt = `${roleContext}

**User Profile:**
- Email: ${decoded!.email}
- Role: ${decoded!.role}
- Status: ${decoded!.status}

**Trading Statistics:**
- Total Trades: ${stats.totalTrades}
- Wins: ${stats.wins} | Losses: ${stats.losses}
- Win Rate: ${stats.winRate}%
- Total Pips: ${stats.totalPips}
- Average Pips per Trade: ${(stats.totalPips / stats.totalTrades).toFixed(2)}
- Best Win: ${stats.bestWin} pips
- Worst Loss: ${stats.worstLoss} pips
- Most Traded Pair: ${mostTradedPair}
- Max Win Streak: ${maxWinStreak} trades
- Max Loss Streak: ${maxLossStreak} trades

**Recent Trades (Last ${tradesSummary.length}):**
${JSON.stringify(tradesSummary, null, 2)}

Sebagai MPT Warrior AI Mentor, analisis performa trading ini dengan format:

## 📊 Performance Overview
[Ringkasan singkat performa dengan highlight key metrics]

## ✅ Strengths
[2-3 poin kekuatan yang terlihat dari data - sebutkan contoh spesifik]

## ⚠️ Areas for Improvement
[2-3 area yang perlu diperbaiki - dengan contoh trade spesifik dan angka]

## 🎯 Actionable Recommendations
[3-5 rekomendasi konkret yang bisa langsung diterapkan dalam 1-2 minggu ke depan]

## 🧠 Mindset Check
[Analisis psikologi trading berdasarkan pola WIN/LOSS streak, pair selection, dan catatan trading]

## 📈 Next Steps
[Roadmap prioritas untuk 1-2 minggu ke depan dengan target yang terukur]

Gunakan emoji dan bahasa yang engaging tapi tetap profesional. Berikan feedback yang spesifik berdasarkan data aktual, bukan generic advice.`;

    // HYBRID AI: Prefer Groq (faster), fallback to Gemini
    let analysis = '';
    let aiModel = '';

    if (groq) {
      console.log("⚡ Analyzing trades with Groq (ultra-fast)...");
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a professional trading analyst for MPT Warrior app.' },
            { role: 'user', content: prompt }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 4096,
        });

        analysis = completion.choices[0]?.message?.content || '';
        aiModel = 'Groq Llama 3.3 70B (FREE)';
      } catch (groqError: any) {
        console.warn("⚠️ Groq failed, falling back to Gemini:", groqError.message);
        
        // Fallback to Gemini
        if (genAI) {
          const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            systemInstruction: 'Anda adalah MPT Warrior AI Mentor, seorang expert trading analyst yang memberikan feedback konstruktif dan actionable untuk trader.',
          });
          const geminiResult = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          });
          const response = await geminiResult.response;
          analysis = response.text();
          aiModel = 'Gemini 2.0 Flash (Fallback)';
        } else {
          throw groqError;
        }
      }
    } else if (genAI) {
      console.log("💬 Analyzing trades with Gemini...");
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        systemInstruction: 'Anda adalah MPT Warrior AI Mentor, seorang expert trading analyst yang memberikan feedback konstruktif dan actionable untuk trader.',
      });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      });
      const response = await result.response;
      analysis = response.text();
      aiModel = 'Gemini 2.0 Flash (FREE)';
    }

    console.log(`✅ Trade analysis completed with: ${aiModel}`);

    return NextResponse.json({
      success: true,
      analysis,
      stats,
      tradesAnalyzed: tradesSummary.length,
      generatedAt: new Date().toISOString(),
      aiModel,
    });

  } catch (error: any) {
    console.error('Error analyzing trades:', error);
    
    // Helpful error messages
    if (error.message?.includes('API_KEY') || error.message?.includes('api key')) {
      return NextResponse.json({ 
        error: 'AI API Key tidak valid. Pastikan GROQ_API_KEY atau GEMINI_API_KEY sudah dikonfigurasi.' 
      }, { status: 500 });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json({ 
        error: 'Quota AI habis. Silakan coba lagi dalam beberapa menit.' 
      }, { status: 429 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
