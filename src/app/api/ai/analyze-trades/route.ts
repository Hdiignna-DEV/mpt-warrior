/**
 * AI Analyze Trades API
 * Uses Claude Sonnet 4.5 to analyze user's trading history
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateActiveUser } from '@/lib/middleware/auth';
import { getUserTrades, getUserTradeStats } from '@/lib/db/trade-service';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.CLAUDE_API_KEY) {
      return NextResponse.json({ 
        error: 'CLAUDE_API_KEY is not configured. Please contact admin.' 
      }, { status: 500 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

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

    // Call Claude Sonnet 4.5 API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'Anda adalah MPT Warrior AI Mentor, seorang expert trading analyst yang memberikan feedback konstruktif dan actionable untuk trader.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const analysis = response.content[0].type === 'text' ? response.content[0].text : 'No analysis generated';

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
