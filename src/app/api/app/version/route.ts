import { NextRequest, NextResponse } from 'next/server';

// Current app version - Update this when new version is released
const CURRENT_VERSION = '1.0.0';
const MIN_REQUIRED_VERSION = '0.9.0';

interface UpdateInfo {
  currentVersion: string;
  minRequiredVersion: string;
  hasUpdate: boolean;
  updateAvailable: boolean;
  forceUpdate: boolean;
  downloadUrl: string;
  releaseNotes: string;
  releasedAt: string;
}

/**
 * GET /api/app/version?version=X.X.X
 * 
 * Check if app update is available
 * Returns update info that mobile app can use for:
 * - Check if new version available
 * - Force update if min version not met
 * - Provide download link
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appVersion = searchParams.get('version');
    const platform = searchParams.get('platform') || 'android'; // android or ios

    if (!appVersion) {
      return NextResponse.json(
        { error: 'Version parameter required' },
        { status: 400 }
      );
    }

    // Parse versions for comparison
    const appVersionParts = appVersion.split('.').map(Number);
    const currentVersionParts = CURRENT_VERSION.split('.').map(Number);
    const minVersionParts = MIN_REQUIRED_VERSION.split('.').map(Number);

    // Check if app version is less than min required
    const isBelowMinRequired = compareVersions(appVersionParts, minVersionParts) < 0;
    
    // Check if new version is available
    const hasNewVersion = compareVersions(appVersionParts, currentVersionParts) < 0;

    const updateInfo: UpdateInfo = {
      currentVersion: CURRENT_VERSION,
      minRequiredVersion: MIN_REQUIRED_VERSION,
      hasUpdate: hasNewVersion,
      updateAvailable: hasNewVersion,
      forceUpdate: isBelowMinRequired,
      downloadUrl: getDownloadUrl(platform),
      releaseNotes: getReleaseNotes(CURRENT_VERSION),
      releasedAt: '2026-01-10T12:00:00Z',
    };

    return NextResponse.json(updateInfo, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error checking app version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Compare two version arrays
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: number[], v2: number[]): number {
  const maxLength = Math.max(v1.length, v2.length);

  for (let i = 0; i < maxLength; i++) {
    const part1 = v1[i] || 0;
    const part2 = v2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
}

/**
 * Get download URL based on platform
 */
function getDownloadUrl(platform: string): string {
  const baseUrl = 'https://mpt-community.vercel.app';
  
  if (platform === 'ios') {
    return `${baseUrl}/downloads/testflight`; // TestFlight link
  }
  
  // Android APK
  return `${baseUrl}/downloads`; // Will redirect to GitHub releases
}

/**
 * Get release notes for a specific version
 */
function getReleaseNotes(version: string): string {
  const releaseNotes: Record<string, string> = {
    '1.0.0': `🎉 Initial Release
    
✨ Features:
- Trading Journal with full CRUD operations
- AI Mentor Chat integration
- Push Notifications
- Offline Mode with auto-sync
- Real-time Analytics Dashboard
- Achievement System
- User Profile Management

🔧 Technical:
- React Native with Expo
- TypeScript strict mode
- Zustand state management
- Axios HTTP client with JWT auth
- AsyncStorage + Secure Store
- Error boundaries & loading states

🔒 Security:
- End-to-end encryption for sensitive data
- JWT token-based authentication
- HTTPS only communication
- GDPR compliant privacy policy`,

    '0.9.0': `Beta Release - Limited Features
    
⚠️ Note: This version is outdated. Please update to latest.`,
  };

  return releaseNotes[version] || `Release notes for version ${version}`;
}
