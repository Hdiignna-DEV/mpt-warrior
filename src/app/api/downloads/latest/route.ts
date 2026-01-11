import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/downloads/latest
 * Returns information about the latest APK version available for download
 */
export async function GET(req: NextRequest) {
  try {
    // Path to APK in public folder
    const apkPath = path.join(process.cwd(), 'public', 'downloads', 'mpt-warrior.apk');

    // Check if APK file exists
    const apkExists = fs.existsSync(apkPath);

    if (!apkExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'APK not found',
          message: 'The APK file is not yet available. Please check back soon.',
          version: null,
          downloadUrl: null,
        },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = fs.statSync(apkPath);
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2); // Convert to MB
    const lastModified = new Date(stats.mtime);

    // Return APK information
    return NextResponse.json(
      {
        success: true,
        version: '1.0.0',
        downloadUrl: '/downloads/mpt-warrior.apk',
        fileSize: `${fileSize} MB`,
        lastUpdated: lastModified.toISOString(),
        fileName: 'mpt-warrior.apk',
        platform: 'Android',
        minimumAndroidVersion: '8.0',
        releaseNotes: `
MPT Warrior Mobile v1.0.0
- Full feature parity with web version
- AI Mentor for 24/7 trading guidance
- Trading Journal with performance analytics
- Risk Calculator
- Real-time leaderboard
- Achievement system
- Offline support
- Secure authentication
        `.trim(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error('Error fetching APK info:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch APK information',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * HEAD /api/downloads/latest
 * Quick check if APK exists without returning full content
 */
export async function HEAD(req: NextRequest) {
  try {
    const apkPath = path.join(process.cwd(), 'public', 'downloads', 'mpt-warrior.apk');
    const apkExists = fs.existsSync(apkPath);

    if (apkExists) {
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse(null, { status: 404 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
