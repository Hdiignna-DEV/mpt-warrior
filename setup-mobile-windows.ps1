# MPT Command Center - Mobile Deployment Setup Script (Windows PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File setup-mobile-windows.ps1

Write-Host "🚀 MPT Command Center - Mobile Deployment Setup (Windows)" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "❌ Node.js not found. Please install Node.js 20+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js installed: $(node --version)" -ForegroundColor Green

# Check npm
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "❌ npm not found. Please install npm" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm installed: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Check EAS CLI
Write-Host "📱 Checking EAS CLI..." -ForegroundColor Cyan
$easCheck = Get-Command eas -ErrorAction SilentlyContinue
if (-not $easCheck) {
    Write-Host "⬇️ Installing EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ EAS CLI installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install EAS CLI" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ EAS CLI already installed" -ForegroundColor Green
}
Write-Host ""

# Install dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check environment
Write-Host "🔐 Checking environment variables..." -ForegroundColor Cyan
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️ .env.local not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" -Destination ".env.local"
        Write-Host "📝 .env.local created. Please fill in your credentials:" -ForegroundColor Green
        Write-Host "   - Firebase config" -ForegroundColor Gray
        Write-Host "   - Azure Cosmos DB" -ForegroundColor Gray
        Write-Host "   - AI API keys" -ForegroundColor Gray
        Write-Host "   - Email config" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ .env.local found" -ForegroundColor Green
}
Write-Host ""

# Build project
Write-Host "🔨 Building Next.js project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please check for errors." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Verify app.json
Write-Host "🔧 Verifying app.json configuration..." -ForegroundColor Cyan
$appJsonContent = Get-Content app.json
if ($appJsonContent -match '"name":\s*"MPT Command Center"') {
    Write-Host "✅ App name configured correctly" -ForegroundColor Green
} else {
    Write-Host "⚠️ App name might not be configured correctly" -ForegroundColor Yellow
    Write-Host '   Update app.json: "name": "MPT Command Center"'
}
Write-Host ""

# Show next steps
Write-Host "✨ Setup complete! Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣ LOGIN TO EXPO:" -ForegroundColor Cyan
Write-Host "   eas login" -ForegroundColor Yellow
Write-Host ""
Write-Host "2️⃣ BUILD ANDROID APK:" -ForegroundColor Cyan
Write-Host "   eas build -p android --profile preview" -ForegroundColor Yellow
Write-Host "   (or use: eas build -p android --profile production)" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣ DOWNLOAD APK:" -ForegroundColor Cyan
Write-Host "   - Check Expo dashboard: https://expo.dev" -ForegroundColor Yellow
Write-Host "   - Or use: eas build:list" -ForegroundColor Yellow
Write-Host ""
Write-Host "4️⃣ UPLOAD APK TO VERCEL:" -ForegroundColor Cyan
Write-Host "   copy <downloaded-apk> public\downloads\mpt-warrior.apk" -ForegroundColor Yellow
Write-Host "   git add public\downloads\mpt-warrior.apk" -ForegroundColor Yellow
Write-Host "   git commit -m '📱 Update APK v1.0.1'" -ForegroundColor Yellow
Write-Host "   git push" -ForegroundColor Yellow
Write-Host ""
Write-Host "5️⃣ TEST PWA ON iOS:" -ForegroundColor Cyan
Write-Host "   - Open: https://mpt-community.vercel.app/get-app" -ForegroundColor Yellow
Write-Host "   - On iPhone Safari: Share → Add to Home Screen" -ForegroundColor Yellow
Write-Host ""
Write-Host "6️⃣ SETUP FIREBASE FCM (OPTIONAL):" -ForegroundColor Cyan
Write-Host "   - Go to: https://console.firebase.google.com" -ForegroundColor Yellow
Write-Host "   - Create project & add Web app" -ForegroundColor Yellow
Write-Host "   - Copy credentials to .env.local" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Full guide: MOBILE_DEPLOYMENT_COMPLETE_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
