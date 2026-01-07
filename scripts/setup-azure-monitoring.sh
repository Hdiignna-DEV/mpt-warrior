#!/bin/bash

# MPT Warrior - Azure Monitoring Setup Script
# This script helps you setup monitoring alerts for Azure for Students free tier

echo "🔔 Setting up Azure Monitoring Alerts for MPT Warrior"
echo "=================================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found!"
    echo "📥 Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    echo ""
    echo "Windows: winget install -e --id Microsoft.AzureCLI"
    echo "Or download installer from the link above"
    exit 1
fi

echo "✅ Azure CLI found"
echo ""

# Login to Azure
echo "🔐 Logging in to Azure..."
az login

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo "📋 Subscription ID: $SUBSCRIPTION_ID"
echo ""

# Prompt for resource group name
read -p "Enter your Resource Group name (default: mpt-warrior-rg): " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-mpt-warrior-rg}

# Prompt for email for alerts
read -p "Enter your email for alerts: " ALERT_EMAIL

if [ -z "$ALERT_EMAIL" ]; then
    echo "❌ Email is required for alerts"
    exit 1
fi

echo ""
echo "🎯 Creating monitoring alerts for:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Alert Email: $ALERT_EMAIL"
echo ""

# Create action group for alerts
echo "📧 Creating action group..."
az monitor action-group create \
  --name "mpt-warrior-alerts" \
  --resource-group "$RESOURCE_GROUP" \
  --short-name "MPTAlerts" \
  --email-receiver name="Admin" email-address="$ALERT_EMAIL"

echo "✅ Action group created"
echo ""

# Get Cosmos DB account name
COSMOS_ACCOUNT=$(az cosmosdb list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)

if [ -z "$COSMOS_ACCOUNT" ]; then
    echo "⚠️  No Cosmos DB account found in this resource group"
    echo "Skipping Cosmos DB alerts..."
else
    echo "📊 Found Cosmos DB account: $COSMOS_ACCOUNT"
    
    # Get Cosmos DB resource ID
    COSMOS_ID=$(az cosmosdb show --name "$COSMOS_ACCOUNT" --resource-group "$RESOURCE_GROUP" --query id -o tsv)
    
    # Alert 1: High RU consumption (800 RU/s - near free tier limit)
    echo "🔔 Creating alert: High RU consumption..."
    az monitor metrics alert create \
      --name "cosmos-high-ru-consumption" \
      --resource-group "$RESOURCE_GROUP" \
      --scopes "$COSMOS_ID" \
      --condition "avg TotalRequestUnits > 800" \
      --window-size 5m \
      --evaluation-frequency 1m \
      --action "mpt-warrior-alerts" \
      --description "Alert when RU consumption exceeds 800 RU/s (approaching free tier limit of 1000)"
    
    echo "✅ High RU alert created"
    
    # Alert 2: Storage approaching limit (20 GB)
    echo "🔔 Creating alert: Storage approaching limit..."
    az monitor metrics alert create \
      --name "cosmos-storage-limit" \
      --resource-group "$RESOURCE_GROUP" \
      --scopes "$COSMOS_ID" \
      --condition "avg DataUsage > 21474836480" \
      --window-size 1h \
      --evaluation-frequency 30m \
      --action "mpt-warrior-alerts" \
      --description "Alert when storage exceeds 20 GB (80% of free tier 25 GB limit)"
    
    echo "✅ Storage alert created"
fi

echo ""

# Get Static Web App name
SWA_NAME=$(az staticwebapp list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)

if [ -z "$SWA_NAME" ]; then
    echo "⚠️  No Static Web App found in this resource group"
    echo "Deploy to Azure first, then run this script again for SWA alerts"
else
    echo "🌐 Found Static Web App: $SWA_NAME"
    
    # Get SWA resource ID
    SWA_ID=$(az staticwebapp show --name "$SWA_NAME" --resource-group "$RESOURCE_GROUP" --query id -o tsv)
    
    # Alert 3: High bandwidth usage (80 GB - near free tier limit)
    echo "🔔 Creating alert: High bandwidth usage..."
    az monitor metrics alert create \
      --name "swa-high-bandwidth" \
      --resource-group "$RESOURCE_GROUP" \
      --scopes "$SWA_ID" \
      --condition "total BytesSent > 85899345920" \
      --window-size 24h \
      --evaluation-frequency 1h \
      --action "mpt-warrior-alerts" \
      --description "Alert when bandwidth exceeds 80 GB (80% of free tier 100 GB limit)"
    
    echo "✅ Bandwidth alert created"
fi

echo ""
echo "=================================================="
echo "✅ Monitoring setup complete!"
echo ""
echo "📊 Alerts configured:"
echo "   1. Cosmos DB RU > 800/s (approaching 1000 free limit)"
echo "   2. Cosmos DB Storage > 20 GB (approaching 25 GB limit)"
echo "   3. Static Web App Bandwidth > 80 GB (approaching 100 GB limit)"
echo ""
echo "📧 Alerts will be sent to: $ALERT_EMAIL"
echo ""
echo "🔍 View alerts in Azure Portal:"
echo "   https://portal.azure.com → Monitor → Alerts"
echo ""
echo "💡 Next steps:"
echo "   1. Test alerts by triggering a test condition"
echo "   2. Check your email for alert confirmations"
echo "   3. Monitor usage weekly in Azure Portal"
echo ""
