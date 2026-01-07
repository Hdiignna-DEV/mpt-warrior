# ================================================================
# AZURE STATIC WEB APPS - AUTO DEPLOYMENT SCRIPT
# ================================================================

Write-Host "`n════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 MPT WARRIOR - AZURE DEPLOYMENT" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Configuration
$RESOURCE_GROUP = "mpt-warrior-rg"
$LOCATION = "eastasia"  # Closest to Indonesia
$APP_NAME = "mpt-warrior-app"
$GITHUB_REPO = "Hdiignna-DEV/mpt-warrior"
$BRANCH = "main"

# Step 1: Login to Azure
Write-Host "Step 1: Login to Azure..." -ForegroundColor Yellow
Write-Host "Browser akan terbuka, login dengan akun Azure kamu`n" -ForegroundColor White

# Refresh PATH to include Azure CLI
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

az login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login gagal. Pastikan kamu punya akun Azure." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Login berhasil!`n" -ForegroundColor Green

# Step 2: Create Resource Group
Write-Host "Step 2: Create Resource Group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION
Write-Host "✅ Resource Group created!`n" -ForegroundColor Green

# Step 3: Create Static Web App
Write-Host "Step 3: Create Static Web App..." -ForegroundColor Yellow
Write-Host "Connecting to GitHub repository: $GITHUB_REPO`n" -ForegroundColor White

az staticwebapp create `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --source "https://github.com/$GITHUB_REPO" `
    --location $LOCATION `
    --branch $BRANCH `
    --app-location "/" `
    --output-location ".next" `
    --login-with-github

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Static Web App creation failed." -ForegroundColor Red
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  - GitHub authorization denied" -ForegroundColor White
    Write-Host "  - Resource name already taken" -ForegroundColor White
    Write-Host "`nTry manual setup: https://portal.azure.com" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Static Web App created!`n" -ForegroundColor Green

# Step 4: Get deployment token
Write-Host "Step 4: Getting deployment details..." -ForegroundColor Yellow
$APP_URL = az staticwebapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv

Write-Host "`n════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "Your app is live at:" -ForegroundColor Cyan
Write-Host "  https://$APP_URL`n" -ForegroundColor Blue

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Add Environment Variables di Azure Portal" -ForegroundColor White
Write-Host "     https://portal.azure.com -> $APP_NAME -> Configuration" -ForegroundColor Gray
Write-Host "`n  Variables yang perlu ditambahkan:" -ForegroundColor White
Write-Host "     - AZURE_COSMOS_ENDPOINT" -ForegroundColor Gray
Write-Host "     - AZURE_COSMOS_KEY" -ForegroundColor Gray
Write-Host "     - AZURE_COSMOS_DATABASE" -ForegroundColor Gray
Write-Host "     - GROQ_API_KEY" -ForegroundColor Gray
Write-Host "     - NEXT_PUBLIC_GROQ_API_KEY" -ForegroundColor Gray
Write-Host "     - GEMINI_API_KEY" -ForegroundColor Gray
Write-Host "     - NEXT_PUBLIC_GEMINI_API_KEY" -ForegroundColor Gray
Write-Host "     - JWT_SECRET" -ForegroundColor Gray
Write-Host "     - NEXT_PUBLIC_ADMIN_EMAIL" -ForegroundColor Gray
Write-Host "`n  2. GitHub Actions akan auto-deploy setiap git push" -ForegroundColor White
Write-Host "  3. Check deployment status di:" -ForegroundColor White
Write-Host "     https://github.com/$GITHUB_REPO/actions`n" -ForegroundColor Gray

Write-Host "════════════════════════════════════════════════════`n" -ForegroundColor Green

# Open Azure Portal
Write-Host "Opening Azure Portal to add environment variables..." -ForegroundColor Cyan
Start-Process "https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/staticSites/$APP_NAME/configuration"

Write-Host "`n✨ Happy Trading, Warrior! ✨`n" -ForegroundColor Green
