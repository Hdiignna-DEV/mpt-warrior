import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Check if APK file exists
    const apkPath = path.join(process.cwd(), 'public', 'apk', 'mpt-warrior-release.apk');
    
    if (fs.existsSync(apkPath)) {
      // Serve existing APK
      const fileBuffer = fs.readFileSync(apkPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': 'attachment; filename="mpt-warrior-v1.0.0.apk"',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // If no APK exists, return information about installation methods
    return NextResponse.json(
      {
        status: 'APK not built yet',
        message: 'APK file is not available. Use alternative installation methods:',
        methods: [
          {
            name: 'Build from Source',
            steps: [
              'Clone: git clone https://github.com/Hdiignna-DEV/mpt-warrior.git',
              'Navigate: cd mpt-warrior/mobile',
              'Install: npm install',
              'Build: bash build-apk.sh',
            ],
          },
          {
            name: 'Use Expo Go',
            steps: [
              'Install Expo Go app from Play Store',
              'Run: npm start (in mobile folder)',
              'Scan QR code with Expo Go',
            ],
          },
        ],
        buildInstructions: {
          local:
            'Run: npm run build-apk (requires Android SDK)',
          eas: 'Run: eas build --platform android (requires EAS account)',
          github: 'Check releases: https://github.com/Hdiignna-DEV/mpt-warrior/releases',
        },
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('APK download error:', error);
    return NextResponse.json(
      { error: 'Failed to download APK' },
      { status: 500 }
    );
  }
}
