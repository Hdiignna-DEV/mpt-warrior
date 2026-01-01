import { NextRequest, NextResponse } from 'next/server';

interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
  currency: string;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch dari calendar.mql5.com atau alternative API
    const response = await fetch('https://www.investing.com/economic-calendar/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch economic calendar');
    }

    // Parse data
    // Note: Ini adalah contoh. Anda mungkin perlu menggunakan library seperti cheerio untuk scraping
    const mockEvents: EconomicEvent[] = [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        country: 'USD',
        event: 'Interest Rate Decision',
        impact: 'high',
        forecast: '5.25%',
        previous: '5.25%',
        currency: 'USD',
      },
      {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        time: '15:30',
        country: 'EUR',
        event: 'CPI Release',
        impact: 'high',
        forecast: '2.4%',
        previous: '2.5%',
        currency: 'EUR',
      },
      {
        id: '3',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '08:00',
        country: 'GBP',
        event: 'Employment Change',
        impact: 'medium',
        forecast: '45K',
        previous: '42K',
        currency: 'GBP',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockEvents,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching economic calendar:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch economic calendar data',
      },
      { status: 500 }
    );
  }
}
