#!/bin/bash

# MPT Warrior - APK Build & Distribution Script
# Builds APK and manages download distribution

set -e

echo "🚀 MPT Warrior APK Build & Distribution"
echo "======================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
fi

# Check if we're logged in to Expo
echo -e "${YELLOW}📋 Checking Expo credentials...${NC}"
eas whoami || {
    echo -e "${YELLOW}🔐 Please login to Expo${NC}"
    eas login
}

# Build APK
echo -e "${YELLOW}🔨 Building Android APK...${NC}"
eas build --platform android --profile production --wait

echo -e "${GREEN}✅ APK Build Complete!${NC}"

# Get the build info
echo -e "${YELLOW}📥 Fetching build information...${NC}"
BUILD_INFO=$(eas build:list --platform android --limit 1 --json)

# Extract download URL
DOWNLOAD_URL=$(echo $BUILD_INFO | grep -o '"artifacts":{[^}]*"buildUrl":"[^"]*' | sed 's/.*"buildUrl":"//')

if [ -z "$DOWNLOAD_URL" ]; then
    echo -e "${RED}❌ Failed to get download URL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo -e "${YELLOW}📱 APK Download URL:${NC}"
echo "$DOWNLOAD_URL"

# Create download info file
cat > ./public/downloads/build-info.json << EOF
{
  "version": "1.0.1",
  "downloadUrl": "$DOWNLOAD_URL",
  "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "platform": "android",
  "size": "~85MB",
  "minAndroidVersion": 5.0,
  "minVersionCode": 2
}
EOF

echo -e "${GREEN}✅ Build info saved to ./public/downloads/build-info.json${NC}"

# Update download page
echo -e "${YELLOW}📄 Update your download page with this URL${NC}"
echo "1. Copy the URL above"
echo "2. Update NEXT_PUBLIC_APK_DOWNLOAD_URL in .env.local"
echo "3. Or update the download link in app/download/page.tsx"

echo -e "${GREEN}✅ Done! Users can now download the APK${NC}"
