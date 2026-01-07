# MPT Warrior - Azure Monitoring Setup Script (PowerShell)
# This script helps you setup monitoring alerts for Azure for Students free tier

Write-Host "🔔 Setting up Azure Monitoring Alerts for MPT Warrior" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI not found!" -ForegroundColor Red
    Write-Host "📥 Install from: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Windows: winget install -e --id Microsoft.AzureCLI" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Azure CLI found" -ForegroundColor Green
Write-Host ""

# Login to Azure
Write-Host "🔐 Logging in to Azure..." -ForegroundColor Cyan
az login

# Get subscription ID
$SUBSCRIPTION_ID = az account show --query id -o tsv
Write-Host "📋 Subscription ID: $SUBSCRIPTION_ID" -ForegroundColor Cyan
Write-Host ""

# Prompt for resource group name
$RESOURCE_GROUP = Read-Host "Enter your Resource Group name (default: mpt-warrior-rg)"
if ([string]::IsNullOrWhiteSpace($RESOURCE_GROUP)) {
    $RESOURCE_GROUP = "mpt-warrior-rg"
}

# Prompt for email for alerts
$ALERT_EMAIL = Read-Host "Enter your email for alerts"

if ([string]::IsNullOrWhiteSpace($ALERT_EMAIL)) {
    Write-Host "❌ Email is required for alerts" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Creating monitoring alerts for:" -ForegroundColor Cyan
Write-Host "   Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "   Alert Email: $ALERT_EMAIL" -ForegroundColor White
Write-Host ""

# Create action group for alerts
Write-Host "📧 Creating action group..." -ForegroundColor Cyan
az monitor action-group create `
  --name "mpt-warrior-alerts" `
  --resource-group "$RESOURCE_GROUP" `
  --short-name "MPTAlerts" `
  --email-receiver name="Admin" email-address="$ALERT_EMAIL"

Write-Host "✅ Action group created" -ForegroundColor Green
Write-Host ""

# Get Cosmos DB account name
$COSMOS_ACCOUNT = az cosmosdb list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv

if ([string]::IsNullOrWhiteSpace($COSMOS_ACCOUNT)) {
    Write-Host "⚠️  No Cosmos DB account found in this resource group" -ForegroundColor Yellow
    Write-Host "Skipping Cosmos DB alerts..." -ForegroundColor Yellow
} else {
    Write-Host "📊 Found Cosmos DB account: $COSMOS_ACCOUNT" -ForegroundColor Green
    
    # Get Cosmos DB resource ID
    $COSMOS_ID = az cosmosdb show --name "$COSMOS_ACCOUNT" --resource-group "$RESOURCE_GROUP" --query id -o tsv
    
    # Alert 1: High RU consumption (800 RU/s - near free tier limit)
    Write-Host "🔔 Creating alert: High RU consumption..." -ForegroundColor Cyan
    az monitor metrics alert create `
      --name "cosmos-high-ru-consumption" `
      --resource-group "$RESOURCE_GROUP" `
      --scopes "$COSMOS_ID" `
      --condition "avg TotalRequestUnits > 800" `
      --window-size 5m `
      --evaluation-frequency 1m `
      --action "mpt-warrior-alerts" `
      --description "Alert when RU consumption exceeds 800 RU/s (approaching free tier limit of 1000)"
    
    Write-Host "✅ High RU alert created" -ForegroundColor Green
    
    # Alert 2: Storage approaching limit (20 GB)
    Write-Host "🔔 Creating alert: Storage approaching limit..." -ForegroundColor Cyan
    az monitor metrics alert create `
      --name "cosmos-storage-limit" `
      --resource-group "$RESOURCE_GROUP" `
      --scopes "$COSMOS_ID" `
      --condition "avg DataUsage > 21474836480" `
      --window-size 1h `
      --evaluation-frequency 30m `
      --action "mpt-warrior-alerts" `
      --description "Alert when storage exceeds 20 GB (80% of free tier 25 GB limit)"
    
    Write-Host "✅ Storage alert created" -ForegroundColor Green
}

Write-Host ""

# Get Static Web App name
$SWA_NAME = az staticwebapp list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv

if ([string]::IsNullOrWhiteSpace($SWA_NAME)) {
    Write-Host "⚠️  No Static Web App found in this resource group" -ForegroundColor Yellow
    Write-Host "Deploy to Azure first, then run this script again for SWA alerts" -ForegroundColor Yellow
} else {
    Write-Host "🌐 Found Static Web App: $SWA_NAME" -ForegroundColor Green
    
    # Get SWA resource ID
    $SWA_ID = az staticwebapp show --name "$SWA_NAME" --resource-group "$RESOURCE_GROUP" --query id -o tsv
    
    # Alert 3: High bandwidth usage (80 GB - near free tier limit)
    Write-Host "🔔 Creating alert: High bandwidth usage..." -ForegroundColor Cyan
    az monitor metrics alert create `
      --name "swa-high-bandwidth" `
      --resource-group "$RESOURCE_GROUP" `
      --scopes "$SWA_ID" `
      --condition "total BytesSent > 85899345920" `
      --window-size 24h `
      --evaluation-frequency 1h `
      --action "mpt-warrior-alerts" `
      --description "Alert when bandwidth exceeds 80 GB (80% of free tier 100 GB limit)"
    
    Write-Host "✅ Bandwidth alert created" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Monitoring setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Alerts configured:" -ForegroundColor Cyan
Write-Host "   1. Cosmos DB RU > 800/s (approaching 1000 free limit)" -ForegroundColor White
Write-Host "   2. Cosmos DB Storage > 20 GB (approaching 25 GB limit)" -ForegroundColor White
Write-Host "   3. Static Web App Bandwidth > 80 GB (approaching 100 GB limit)" -ForegroundColor White
Write-Host ""
Write-Host "📧 Alerts will be sent to: $ALERT_EMAIL" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 View alerts in Azure Portal:" -ForegroundColor Cyan
Write-Host "   https://portal.azure.com → Monitor → Alerts" -ForegroundColor White
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test alerts by triggering a test condition" -ForegroundColor White
Write-Host "   2. Check your email for alert confirmations" -ForegroundColor White
Write-Host "   3. Monitor usage weekly in Azure Portal" -ForegroundColor White
Write-Host ""
