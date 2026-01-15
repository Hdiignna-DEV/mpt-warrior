import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if APK exists in public folder
    const fs = await import('fs').then(m => m.promises);
    const path = require('path');
    
    const apkPath = path.join(process.cwd(), 'public', 'apk', 'mpt-commandcenter.apk');
    const buildInfoPath = path.join(process.cwd(), 'public', 'apk', 'build-info.json');

    // Check if APK exists
    let buildInfo = {
      downloadUrl: '/apk/mpt-commandcenter.apk',
      version: '1.0.1',
      buildDate: new Date().toISOString(),
      platform: 'android',
      minAndroidVersion: 5.0,
      available: false,
    };

    try {
      // Try to read build info if exists
      const info = await fs.readFile(buildInfoPath, 'utf-8');
      buildInfo = { ...buildInfo, ...JSON.parse(info), available: true };
    } catch {
      // Build info doesn't exist yet, use defaults
      try {
        await fs.access(apkPath);
        buildInfo.available = true;
      } catch {
        buildInfo.available = false;
      }
    }

    return NextResponse.json(buildInfo);
  } catch (error) {
    console.error('Error fetching APK info:', error);
    return NextResponse.json(
      {
        downloadUrl: null,
        available: false,
        error: 'APK not yet available. Check back soon!',
      },
      { status: 404 }
    );
  }
}
