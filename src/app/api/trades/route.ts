/**
 * Trades API - GET (List user's trades)
 * POST (Create new trade)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserTrades, createTrade, getUserTradeStats } from '@/lib/db/trade-service';

export async function GET(request: NextRequest) {
  try {
    // Verify token and get user
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is active
    if (decoded.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    // Get trades for this user
    const trades = await getUserTrades(decoded.userId);
    
    // Get stats
    const stats = await getUserTradeStats(decoded.userId);

    return NextResponse.json({
      success: true,
      trades,
      stats,
      count: trades.length,
    });
  } catch (error: any) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify token and get user
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is active
    if (decoded.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    const body = await request.json();
    const { pair, position, result, pips, entryPrice, exitPrice, stopLoss, takeProfit, lotSize, notes, emotionalState, tags, screenshot, tradeDate } = body;

    // Validation
    if (!pair || !position || !result || pips === undefined || !tradeDate) {
      return NextResponse.json(
        { error: 'Missing required fields: pair, position, result, pips, tradeDate' },
        { status: 400 }
      );
    }

    // Create trade
    const newTrade = await createTrade(decoded.userId, {
      pair,
      position,
      result,
      pips,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit,
      lotSize,
      notes,
      emotionalState,
      tags,
      screenshot,
      tradeDate,
    });

    return NextResponse.json({
      success: true,
      message: 'Trade created successfully',
      trade: newTrade,
    });
  } catch (error: any) {
    console.error('Error creating trade:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
