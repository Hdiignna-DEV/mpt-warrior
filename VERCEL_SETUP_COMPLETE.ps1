# ============================================
# VERCEL DEPLOYMENT QUICK FIX - PowerShell
# ============================================
# This script helps you set up Vercel correctly
# Run in VS Code terminal (PowerShell)
# ============================================

Write-Host "🚀 MPT-WARRIOR VERCEL SETUP HELPER" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check local .env.local
Write-Host "Step 1: Checking your .env.local file..." -ForegroundColor Yellow
$envFile = "c:\Users\deden\mpt-warrior\.env.local"

if (Test-Path $envFile) {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
    $envContent = Get-Content $envFile
    
    # Count variables
    $varCount = ($envContent | Where-Object { $_ -match "^[A-Z_]+=.*" }).Count
    Write-Host "   Found $varCount environment variables" -ForegroundColor Cyan
} else {
    Write-Host "❌ .env.local NOT found" -ForegroundColor Red
    Write-Host "   Create it from .env.example" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 2: Critical Variables in Vercel Settings" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  You MUST add these to Vercel Settings:" -ForegroundColor Red
Write-Host ""
Write-Host "📋 HOW TO ADD VARIABLES TO VERCEL:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Vercel Dashboard:" -ForegroundColor White
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Click your 'mpt-warrior' project" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to Settings → Environment Variables" -ForegroundColor White
Write-Host ""
Write-Host "4. For EACH variable below:" -ForegroundColor White
Write-Host "   a. Click 'Add New'" -ForegroundColor White
Write-Host "   b. Name: [variable name]" -ForegroundColor White
Write-Host "   c. Value: [copy from .env.local]" -ForegroundColor White
Write-Host "   d. Environments: Select ALL 3 (Production, Preview, Development)" -ForegroundColor White
Write-Host "   e. Click 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Extract and display variables
$variables = @(
    "NEXT_PUBLIC_GEMINI_API_KEY",
    "GEMINI_API_KEY",
    "GROQ_API_KEY",
    "NEXT_PUBLIC_GROQ_API_KEY",
    "AZURE_COSMOS_CONNECTION_STRING",
    "AZURE_COSMOS_ENDPOINT",
    "AZURE_COSMOS_KEY",
    "AZURE_COSMOS_DATABASE",
    "JWT_SECRET",
    "NEXT_PUBLIC_ADMIN_EMAIL",
    "CRON_SECRET",
    "NEXT_PUBLIC_APP_URL"
)

foreach ($var in $variables) {
    $match = ($envContent | Where-Object { $_ -match "^$var=" })
    if ($match) {
        $status = "✅"
        $color = "Green"
    } else {
        $status = "❌"
        $color = "Red"
    }
    Write-Host "  $status $var" -ForegroundColor $color
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Step 3: OPTIONAL but RECOMMENDED for Email Features" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you want email notifications to work:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option A: Use Gmail SMTP (Recommended for local/testing)" -ForegroundColor White
Write-Host "  1. Get 16-digit App Password from Google Account" -ForegroundColor White
Write-Host "  2. Add to Vercel:" -ForegroundColor White
Write-Host "     - GMAIL_USER = your_email@gmail.com" -ForegroundColor Cyan
Write-Host "     - GMAIL_APP_PASSWORD = [16-digit app password]" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option B: Use Resend Email API (Recommended for production)" -ForegroundColor White
Write-Host "  1. Sign up at https://resend.com" -ForegroundColor White
Write-Host "  2. Get API key" -ForegroundColor White
Write-Host "  3. Add to Vercel:" -ForegroundColor White
Write-Host "     - RESEND_API_KEY = [your resend api key]" -ForegroundColor Cyan
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Step 4: After Adding Variables" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. In Vercel Dashboard, go to Deployments" -ForegroundColor White
Write-Host "2. Find your failed deployment" -ForegroundColor White
Write-Host "3. Click 'Rebuild'" -ForegroundColor White
Write-Host "4. Wait for build to complete (should succeed now!)" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Step 5: Test Local Build First (Optional but Recommended)" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "To ensure build works before pushing:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host ""
Write-Host "If this succeeds locally, Vercel should also succeed!" -ForegroundColor Green
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Need help?" -ForegroundColor Yellow
Write-Host "→ Check VERCEL_COMPLETE_SETUP.md for detailed troubleshooting" -ForegroundColor Cyan
Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Green
Write-Host "1. Copy environment variables to Vercel Settings" -ForegroundColor White
Write-Host "2. Make sure Node.js 20.x is selected in Build Settings" -ForegroundColor White
Write-Host "3. Click Rebuild on failed deployment" -ForegroundColor White
Write-Host "4. Monitor the build logs for any errors" -ForegroundColor White
Write-Host ""
Write-Host "✅ Ready to deploy!" -ForegroundColor Green
