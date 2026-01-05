/**
 * AI Analyze Trades API
 * Uses Gemini 1.5 Pro to analyze user's trading history
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserTrades, getUserTradeStats } from '@/lib/db/trade-service';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY is not configured. Please contact admin.' 
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Verify token
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is active
    if (decoded.status !== 'active') {
      return NextResponse.json({ error: 'Account not active - please wait for approval' }, { status: 403 });
    }

    // Get user's trades from Cosmos DB
    const trades = await getUserTrades(decoded.userId);
    const stats = await getUserTradeStats(decoded.userId);

    if (trades.length === 0) {
      return NextResponse.json({
        error: 'No trades found. Please add trades to your journal first.',
      }, { status: 400 });
    }

    // Prepare context for AI
    const tradesSummary = trades.slice(0, 50).map(t => ({
      pair: t.pair,
      position: t.position,
      result: t.result,
      pips: t.pips,
      date: t.tradeDate.split('T')[0],
      notes: t.notes || '',
    }));

    // Build context-aware prompt based on user role
    const roleContext = decoded.role === 'ADMIN' 
      ? 'Anda sedang menganalisis data trading seorang Commander (ADMIN). Berikan insight yang mendalam dan strategis.'
      : 'Anda sedang menganalisis data trading seorang WARRIOR. Berikan feedback yang actionable dan motivasi untuk improvement.';

    const prompt = `${roleContext}

**User:** ${decoded.email}
**Role:** ${decoded.role}
**Status:** ${decoded.status}

**Trading Statistics:**
- Total Trades: ${stats.totalTrades}
- Wins: ${stats.wins} | Losses: ${stats.losses}
- Win Rate: ${stats.winRate}%
- Total Pips: ${stats.totalPips}
- Best Win: ${stats.bestWin} pips
- Worst Loss: ${stats.worstLoss} pips

**Recent Trades (Last ${tradesSummary.length}):**
${JSON.stringify(tradesSummary, null, 2)}

Sebagai MPT Warrior AI Mentor, analisis performa trading ini dengan format:

## 📊 Performance Overview
[Ringkasan singkat performa]

## ✅ Strengths
[2-3 poin kekuatan yang terlihat dari data]

## ⚠️ Areas for Improvement
[2-3 area yang perlu diperbaiki, dengan contoh spesifik dari data]

## 🎯 Actionable Recommendations
[3-5 rekomendasi konkret yang bisa langsung diterapkan]

## 🧠 Mindset Check
[Analisis psikologi trading berdasarkan pola WIN/LOSS dan catatan]

## 📈 Next Steps
[Roadmap untuk 1-2 minggu ke depan]

Gunakan emoji dan bahasa yang engaging tapi tetap profesional. Berikan feedback yang spesifik berdasarkan data aktual.`;

    // Call Gemini API with correct v1 stable endpoint
    const model = genAI.getGenerativeModel({ 
      model: 'models/gemini-1.5-flash-latest',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({
      success: true,
      analysis,
      stats,
      tradesAnalyzed: tradesSummary.length,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error analyzing trades:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
