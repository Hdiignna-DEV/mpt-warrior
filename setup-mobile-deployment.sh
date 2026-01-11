#!/usr/bin/env bash
# MPT Warrior - Complete Deployment Script
# Run this to setup everything needed for mobile deployment

set -e  # Exit on error

echo "🚀 MPT Warrior - Mobile Deployment Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node version
echo -e "${BLUE}Step 1: Checking Node.js version...${NC}"
node_version=$(node -v)
echo "✓ Node.js ${node_version} installed"
echo ""

# Step 2: Install/Update npm packages
echo -e "${BLUE}Step 2: Installing/updating npm packages...${NC}"
npm install
echo "✓ npm packages installed"
echo ""

# Step 3: Install EAS CLI
echo -e "${BLUE}Step 3: Checking EAS CLI...${NC}"
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI globally..."
    npm install -g eas-cli
else
    echo "✓ EAS CLI already installed"
    eas --version
fi
echo ""

# Step 4: Check Firebase credentials
echo -e "${BLUE}Step 4: Checking Firebase configuration...${NC}"
if [ -f ".env.local" ]; then
    if grep -q "FIREBASE_API_KEY" .env.local; then
        echo "✓ Firebase credentials found in .env.local"
    else
        echo -e "${YELLOW}⚠ Firebase credentials not found in .env.local${NC}"
        echo "Please follow FIREBASE_SETUP_GUIDE.md to setup credentials"
    fi
else
    echo -e "${YELLOW}⚠ .env.local file not found${NC}"
    echo "Create .env.local with Firebase credentials"
fi
echo ""

# Step 5: Build Next.js project
echo -e "${BLUE}Step 5: Building Next.js project...${NC}"
npm run build
echo "✓ Build completed"
echo ""

# Step 6: Display next steps
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🔑 Setup Firebase Credentials:"
echo "   - Follow: FIREBASE_SETUP_GUIDE.md"
echo "   - Add env vars to .env.local and Vercel"
echo ""
echo "2. 📱 Build Android APK:"
echo "   eas login  (if not already logged in)"
echo "   eas build -p android --profile preview"
echo ""
echo "3. 🌐 Deploy to Vercel:"
echo "   git add ."
echo "   git commit -m 'Mobile deployment: EAS + PWA + FCM'"
echo "   git push origin main"
echo ""
echo "4. 📚 Read Documentation:"
echo "   - MOBILE_DEPLOYMENT_QUICKSTART.md (5-min overview)"
echo "   - MOBILE_APP_DEPLOYMENT_GUIDE.md (detailed guide)"
echo "   - FIREBASE_SETUP_GUIDE.md (Firebase setup)"
echo ""
echo "5. ✅ Test Features:"
echo "   npm run dev"
echo "   - Open http://localhost:3000"
echo "   - Test device detection"
echo "   - Test notifications"
echo ""
echo -e "${GREEN}Focus on the Plan, Not the Panic! ⚔️🎯${NC}"
