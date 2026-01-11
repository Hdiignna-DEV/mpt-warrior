#!/bin/bash

# 🚀 MPT Warrior - APK & PWA Setup Script
# Otomatis build APK dan configure PWA untuk deployment

set -e

echo "🔧 MPT Warrior - App Download System Setup"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js >= 20.9.0"
  exit 1
fi
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found"
  exit 1
fi
echo -e "${GREEN}✅ Prerequisites checked${NC}"

# Step 2: Install Capacitor
echo -e "${BLUE}Step 2: Installing Capacitor...${NC}"
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen --save
npm install --save-dev @types/capacitor
echo -e "${GREEN}✅ Capacitor installed${NC}"

# Step 3: Build Next.js
echo -e "${BLUE}Step 3: Building Next.js...${NC}"
npm run build
echo -e "${GREEN}✅ Next.js build complete${NC}"

# Step 4: Initialize Capacitor if not exists
if [ ! -d "android" ]; then
  echo -e "${BLUE}Step 4: Initializing Capacitor project...${NC}"
  npx cap init "MPT Warrior" "com.mptwarrior.app"
  npx cap add android
  echo -e "${GREEN}✅ Capacitor initialized${NC}"
else
  echo -e "${YELLOW}⚠️  Capacitor project already exists${NC}"
fi

# Step 5: Sync with Android
echo -e "${BLUE}Step 5: Syncing with Android...${NC}"
npx cap sync android
echo -e "${GREEN}✅ Android synced${NC}"

# Step 6: Create assets directory
echo -e "${BLUE}Step 6: Creating assets directory...${NC}"
mkdir -p public/downloads
echo -e "${GREEN}✅ Assets directory created${NC}"

# Step 7: Info
echo -e "${BLUE}Step 7: Build information${NC}"
cat << 'EOF'

📦 To build APK:
  1. Option A (GUI):
     npx cap open android
     → Build → Generate Signed Bundle/APK

  2. Option B (CLI):
     cd android && ./gradlew assembleRelease
     APK will be at: android/app/release/app-release.apk

📱 PWA Setup:
  ✅ manifest.json configured
  ✅ service-worker.js enabled
  ✅ /get-app page created

🔗 Deploy Steps:
  1. npm run build
  2. npm run start
  3. Deploy to Vercel:
     vercel --prod

📥 Download Links:
  - APK: https://mpt-community.vercel.app/downloads/mpt-warrior.apk
  - Web: https://mpt-community.vercel.app/get-app

EOF

echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${YELLOW}Next: Build APK using above commands${NC}"
