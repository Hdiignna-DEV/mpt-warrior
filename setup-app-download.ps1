# PowerShell version of setup script
param(
    [switch]$SkipCapacitor = $false,
    [switch]$BuildOnly = $false
)

Write-Host "🚀 MPT Warrior - App Download System Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Step 1: Check prerequisites
Write-Host "`nStep 1: Checking prerequisites..." -ForegroundColor Blue
$nodeVersion = node -v
$npmVersion = npm -v
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host "`nStep 2: Installing dependencies..." -ForegroundColor Blue
npm install

# Step 3: Build Next.js
Write-Host "`nStep 3: Building Next.js..." -ForegroundColor Blue
npm run build
Write-Host "✅ Next.js build complete" -ForegroundColor Green

if ($BuildOnly) {
    Write-Host "`n✅ Build complete! Next step: Deploy to Vercel" -ForegroundColor Green
    exit 0
}

if (-not $SkipCapacitor) {
    # Step 4: Install Capacitor
    Write-Host "`nStep 4: Installing Capacitor..." -ForegroundColor Blue
    npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen --save
    npm install --save-dev @types/capacitor
    Write-Host "✅ Capacitor installed" -ForegroundColor Green

    # Step 5: Initialize Capacitor
    if (-not (Test-Path "android")) {
        Write-Host "`nStep 5: Initializing Capacitor..." -ForegroundColor Blue
        npx cap init "MPT Warrior" "com.mptwarrior.app"
        npx cap add android
        npx cap sync android
        Write-Host "✅ Capacitor initialized" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ Capacitor already initialized" -ForegroundColor Yellow
    }
}

# Step 6: Create directories
Write-Host "`nStep 6: Creating directories..." -ForegroundColor Blue
New-Item -ItemType Directory -Path "public/downloads" -Force | Out-Null
Write-Host "✅ Directories created" -ForegroundColor Green

# Step 7: Show next steps
Write-Host "`n$([char]27)[32m✅ Setup complete!$([char]27)[0m" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Build APK: npx cap open android"
Write-Host "   OR: cd android && .\gradlew assembleRelease"
Write-Host "2. Deploy: npm run build && vercel --prod"
Write-Host "3. Copy APK to public/downloads/mpt-warrior.apk"
Write-Host "`n📲 Download page ready at: /get-app"
