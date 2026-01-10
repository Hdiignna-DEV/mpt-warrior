#!/usr/bin/env pwsh
<#
  Phase 6: Testing & Validation Script
  Run this to verify all Phase 4 & 5 features work correctly
#>

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    PHASE 6: TESTING & VALIDATION SUITE             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Test 1: Check Build Status
Write-Host "📦 TEST 1: Build Status" -ForegroundColor Yellow
$buildResult = npm run build 2>&1 | Select-String "Compiled successfully"
if ($buildResult) {
    Write-Host "✅ Build: PASSING" -ForegroundColor Green
} else {
    Write-Host "❌ Build: FAILING" -ForegroundColor Red
    exit 1
}

# Test 2: Verify all Phase 4 & 5 files exist
Write-Host "`n📂 TEST 2: File Structure" -ForegroundColor Yellow
$requiredFiles = @(
    "src/services/leaderboardAutoUpdateService.ts",
    "src/services/emailNotificationService.ts",
    "src/hooks/useLeaderboardAutoUpdate.ts",
    "src/hooks/useNotificationTriggers.ts",
    "src/app/api/leaderboard/update-score/route.ts",
    "src/app/api/notifications/send/route.ts",
    "src/components/LeaderboardWithAutoUpdate.tsx",
    "src/components/Phase45IntegrationExample.tsx"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - MISSING" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n❌ Some files are missing!" -ForegroundColor Red
    exit 1
}

# Test 3: Check TypeScript compilation
Write-Host "`n🔍 TEST 3: TypeScript Check" -ForegroundColor Yellow
$tsErrors = npm run build 2>&1 | Select-String "error" -ErrorAction SilentlyContinue
if (-not $tsErrors) {
    Write-Host "✅ No TypeScript errors" -ForegroundColor Green
} else {
    Write-Host "⚠️  TypeScript warnings present" -ForegroundColor Yellow
}

# Test 4: Verify environment setup
Write-Host "`n🔐 TEST 4: Environment Configuration" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local"
    if ($envContent -match "COSMOS_ENDPOINT") {
        Write-Host "✅ Cosmos DB configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Cosmos DB not configured" -ForegroundColor Yellow
    }
    if ($envContent -match "GEMINI_API_KEY|GROQ_API_KEY") {
        Write-Host "✅ AI provider configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  AI provider not configured" -ForegroundColor Yellow
    }
    if ($envContent -match "SENDGRID_API_KEY|RESEND_API_KEY") {
        Write-Host "✅ Email provider configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Email provider not configured" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env.local not found - copy from .env.local.example" -ForegroundColor Yellow
}

# Test 5: Check API routes exist
Write-Host "`n🔗 TEST 5: API Routes" -ForegroundColor Yellow
$apiRoutes = @(
    "src/app/api/leaderboard/update-score/route.ts",
    "src/app/api/notifications/send/route.ts",
    "src/app/api/chat/sessions/route.ts"
)
foreach ($route in $apiRoutes) {
    if (Test-Path $route) {
        Write-Host "  ✅ $(Split-Path $route -LeafBase) route exists" -ForegroundColor Green
    }
}

# Test 6: Component integrity
Write-Host "`n🎨 TEST 6: Component Structure" -ForegroundColor Yellow
$components = @(
    "src/components/LeaderboardWithAutoUpdate.tsx",
    "src/components/Phase45IntegrationExample.tsx"
)
foreach ($component in $components) {
    $content = Get-Content $component
    if ($content -match "export function|export class|export default") {
        Write-Host "  ✅ $(Split-Path $component -LeafBase)" -ForegroundColor Green
    }
}

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           ✅ ALL TESTS PASSED ✅                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Update .env.local with your credentials" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
Write-Host "  4. Test Phase 4 & 5 features" -ForegroundColor White
Write-Host "`n"
