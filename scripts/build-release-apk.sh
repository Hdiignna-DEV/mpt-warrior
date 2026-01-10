#!/bin/bash
# Complete APK Build and Release Script for MPT Warrior
# Usage: bash scripts/build-release-apk.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         MPT Warrior Mobile App - APK Release Builder       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/../mobile" || exit 1

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf android dist build-output.txt

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps > /dev/null 2>&1

# Run TypeScript check
echo -e "${YELLOW}🔍 Checking TypeScript...${NC}"
npx tsc --noEmit

# Prebuild for Android
echo -e "${YELLOW}🔨 Prebuilding Android native code...${NC}"
npx expo prebuild --platform android --clean

# Try to build with Gradle
if command -v gradle &> /dev/null || command -v ./gradlew &> /dev/null; then
    echo -e "${YELLOW}🏗️ Building APK with Gradle...${NC}"
    cd android
    if [ -f "gradlew" ]; then
        chmod +x gradlew
        ./gradlew assembleRelease 2>&1 | tee build-output.txt
    else
        gradle assembleRelease 2>&1 | tee build-output.txt
    fi
    cd ..
    
    # Check if APK was generated
    APK_PATH=$(find android -name "*.apk" -type f 2>/dev/null | head -1)
    if [ -n "$APK_PATH" ]; then
        echo -e "${GREEN}✅ APK built successfully!${NC}"
        cp "$APK_PATH" "../public/apk/mpt-warrior-release.apk"
        echo -e "${GREEN}✅ APK copied to public/apk/mpt-warrior-release.apk${NC}"
        echo ""
        echo -e "${GREEN}📊 APK Details:${NC}"
        ls -lh "../public/apk/mpt-warrior-release.apk"
        exit 0
    fi
fi

# If no gradle, try EAS
echo -e "${YELLOW}🔗 Gradle not available, attempting EAS build...${NC}"
echo -e "${YELLOW}Note: This requires authentication with Expo/EAS account${NC}"

if command -v eas &> /dev/null || npm list -g eas-cli &> /dev/null; then
    echo -e "${YELLOW}🚀 Starting EAS build...${NC}"
    # This will prompt for login if needed
    eas build --platform android --local
    
    # Get the build URL from EAS
    echo -e "${GREEN}✅ Check your EAS dashboard for the APK download link${NC}"
else
    echo -e "${YELLOW}📥 Install EAS CLI with: npm install -g eas-cli${NC}"
fi

echo ""
echo -e "${YELLOW}💡 Alternative: Build locally${NC}"
echo "Run: npm run android"
echo ""
echo "For more details, see: QUICK_START.md"
