/**
 * API Route: /api/exchange-rate
 * GET - Get current USD to IDR exchange rate
 */

import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_RATE = 15750; // 1 USD = 15,750 IDR

export async function GET(request: NextRequest) {
  try {
    // Fetch from ExchangeRate-API (free tier)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates?.IDR) {
      throw new Error('IDR rate not found in response');
    }

    return NextResponse.json({
      success: true,
      rate: data.rates.IDR,
      timestamp: new Date().toISOString(),
      source: 'exchangerate-api.com',
    });

  } catch (error: any) {
    console.error('Exchange rate API error:', error);
    
    // Return fallback rate
    return NextResponse.json({
      success: false,
      rate: FALLBACK_RATE,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: error.message,
    }, { status: 200 }); // Still return 200 with fallback
  }
}
