import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export async function GET() {
  try {
    // Fetch ForexFactory calendar page
    const response = await axios.get('https://www.forexfactory.com/calendar', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const events: EconomicEvent[] = [];
    let currentDate = '';

    // Parse calendar table
    $('.calendar__row').each((_, element) => {
      const $row = $(element);
      
      // Skip header rows
      if ($row.hasClass('calendar__row--header')) {
        return;
      }

      // Get date if present
      const dateCell = $row.find('.calendar__date');
      if (dateCell.length && dateCell.text().trim()) {
        currentDate = dateCell.text().trim();
      }

      // Only get today's events
      const today = new Date();
      const todayStr = today.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });

      // Skip if not today
      if (currentDate && !currentDate.includes(todayStr.split(',')[0])) {
        return;
      }

      // Extract event data
      const time = $row.find('.calendar__time').text().trim();
      const currency = $row.find('.calendar__currency').text().trim();
      const eventName = $row.find('.calendar__event').text().trim();
      const impactSpan = $row.find('.calendar__impact span');
      
      // Determine impact level
      let impact: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (impactSpan.hasClass('icon--ff-impact-red')) {
        impact = 'HIGH';
      } else if (impactSpan.hasClass('icon--ff-impact-ora') || impactSpan.hasClass('icon--ff-impact-yel')) {
        impact = 'MEDIUM';
      }

      // Only add if we have essential data
      if (time && currency && eventName) {
        events.push({
          time,
          currency,
          event: eventName,
          impact,
          actual: $row.find('.calendar__actual').text().trim(),
          forecast: $row.find('.calendar__forecast').text().trim(),
          previous: $row.find('.calendar__previous').text().trim(),
        });
      }
    });

    // Filter only today's events and sort by time
    const todayEvents = events.filter(e => e.time && e.time !== 'All Day');

    return NextResponse.json({
      success: true,
      date: new Date().toISOString(),
      events: todayEvents,
      count: todayEvents.length,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('ForexFactory scrape error:', errorMessage);
    
    // Return dummy data as fallback
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch calendar data',
      fallback: true,
      events: [
        { time: '08:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'HIGH' },
        { time: '14:00', currency: 'EUR', event: 'ECB Interest Rate Decision', impact: 'HIGH' },
        { time: '15:30', currency: 'USD', event: 'Fed Chair Powell Speech', impact: 'HIGH' },
      ],
    });
  }
}