#!/bin/bash
# MPT Warrior - Vercel Deployment Diagnostic Script
# Run ini untuk identify issues

echo "🔍 MPT WARRIOR - DEPLOYMENT DIAGNOSTIC"
echo "======================================="
echo ""

# Check Node version
echo "1️⃣ Node Version Check"
node --version
if [ $(node --version | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]; then
  echo "⚠️  WARNING: Node version should be 20.x or higher"
else
  echo "✅ Node version OK"
fi
echo ""

# Check npm version
echo "2️⃣ NPM Version Check"
npm --version
echo "✅ NPM version OK"
echo ""

# Check key dependencies
echo "3️⃣ Key Dependencies Check"
echo "Checking framer-motion..."
npm ls framer-motion 2>/dev/null | head -1
echo ""
echo "Checking canvas-confetti..."
npm ls canvas-confetti 2>/dev/null | head -1
echo ""

# Check environment file
echo "4️⃣ Environment File Check"
if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"
  echo "Variables set:"
  grep -E "^[A-Z_]+=" .env.local | head -10
else
  echo "⚠️  .env.local NOT FOUND"
  echo "Create it with: cp .env.example .env.local"
fi
echo ""

# Check TypeScript
echo "5️⃣ TypeScript Compilation Check"
echo "Running: npm run build"
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed - see errors above"
fi
echo ""

# Summary
echo "======================================="
echo "📋 SUMMARY"
echo "======================================="
if [ $BUILD_STATUS -eq 0 ]; then
  echo "✅ All checks passed!"
  echo ""
  echo "Next steps:"
  echo "1. git add ."
  echo "2. git commit -m 'fix: deployment'"
  echo "3. git push origin main"
  echo ""
  echo "Vercel should auto-deploy now."
else
  echo "❌ Issues found - check errors above"
  echo ""
  echo "Common fixes:"
  echo "1. npm install --force"
  echo "2. Check .env.local is complete"
  echo "3. Update dependencies: npm update"
  echo "4. Clear cache: rm -rf node_modules && npm install"
fi
echo ""
echo "Done! Report any errors to maintainer."
