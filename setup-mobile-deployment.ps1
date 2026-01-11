# MPT Warrior - Mobile Deployment Setup (PowerShell)
# Run this to setup everything needed for mobile deployment

Write-Host "🚀 MPT Warrior - Mobile Deployment Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Node version
Write-Host "Step 1: Checking Node.js version..." -ForegroundColor Cyan
$nodeVersion = node -v
Write-Host "✓ Node.js $nodeVersion installed"
Write-Host ""

# Step 2: Install/Update npm packages
Write-Host "Step 2: Installing/updating npm packages..." -ForegroundColor Cyan
npm install
Write-Host "✓ npm packages installed"
Write-Host ""

# Step 3: Install EAS CLI
Write-Host "Step 3: Checking EAS CLI..." -ForegroundColor Cyan
try {
    $easVersion = eas --version
    Write-Host "✓ EAS CLI already installed: $easVersion"
} catch {
    Write-Host "Installing EAS CLI globally..."
    npm install -g eas-cli
    Write-Host "✓ EAS CLI installed"
}
Write-Host ""

# Step 4: Check Firebase credentials
Write-Host "Step 4: Checking Firebase configuration..." -ForegroundColor Cyan
if (Test-Path ".env.local") {
    $content = Get-Content ".env.local"
    if ($content -match "FIREBASE_API_KEY") {
        Write-Host "✓ Firebase credentials found in .env.local"
    } else {
        Write-Host "⚠ Firebase credentials not found in .env.local" -ForegroundColor Yellow
        Write-Host "Please follow FIREBASE_SETUP_GUIDE.md to setup credentials"
    }
} else {
    Write-Host "⚠ .env.local file not found" -ForegroundColor Yellow
    Write-Host "Create .env.local with Firebase credentials"
}
Write-Host ""

# Step 5: Build Next.js project
Write-Host "Step 5: Building Next.js project..." -ForegroundColor Cyan
npm run build
Write-Host "✓ Build completed"
Write-Host ""

# Step 6: Display next steps
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:"
Write-Host ""
Write-Host "1. 🔑 Setup Firebase Credentials:"
Write-Host "   - Follow: FIREBASE_SETUP_GUIDE.md"
Write-Host "   - Add env vars to .env.local and Vercel"
Write-Host ""
Write-Host "2. 📱 Build Android APK:"
Write-Host "   eas login  (if not already logged in)"
Write-Host "   eas build -p android --profile preview"
Write-Host ""
Write-Host "3. 🌐 Deploy to Vercel:"
Write-Host "   git add ."
Write-Host "   git commit -m 'Mobile deployment: EAS + PWA + FCM'"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "4. 📚 Read Documentation:"
Write-Host "   - MOBILE_DEPLOYMENT_QUICKSTART.md (5-min overview)"
Write-Host "   - MOBILE_APP_DEPLOYMENT_GUIDE.md (detailed guide)"
Write-Host "   - FIREBASE_SETUP_GUIDE.md (Firebase setup)"
Write-Host ""
Write-Host "5. ✅ Test Features:"
Write-Host "   npm run dev"
Write-Host "   - Open http://localhost:3000"
Write-Host "   - Test device detection"
Write-Host "   - Test notifications"
Write-Host ""
Write-Host "Focus on the Plan, Not the Panic! ⚔️🎯" -ForegroundColor Green
