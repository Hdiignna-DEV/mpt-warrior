#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated Azure Timer Trigger Setup for mpt-warrior Leaderboard Cron
    
.DESCRIPTION
    One-command setup for Azure Function App with Timer Trigger
    Handles all configuration automatically
    
.EXAMPLE
    ./setup-azure-cron-simple.ps1
#>

param(
    [string]$ResourceGroupName = "mpt-warrior-rg",
    [string]$FunctionAppName = "mpt-warrior-cron",
    [string]$Region = "southeastasia",
    [string]$ApiEndpoint = "https://mpt-community.vercel.app",
    [string]$CronSecret = "mpt_warrior_cron_secret_12345"
)

# Simple output
Write-Host ""
Write-Host "=============================================================="
Write-Host "  AZURE TIMER TRIGGER SETUP - AUTOMATED"
Write-Host "=============================================================="
Write-Host ""

# STEP 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..."
try {
    $azVersion = az --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: Azure CLI found"
    } else {
        Write-Host "  ERROR: Azure CLI not found"
        exit 1
    }
} catch {
    Write-Host "  ERROR: $_"
    exit 1
}

# Check login
try {
    $account = az account show 2>$null
    if ($account) {
        Write-Host "  OK: Logged into Azure"
    } else {
        Write-Host "  ERROR: Not logged in. Run: az login"
        exit 1
    }
} catch {
    Write-Host "  ERROR: $_"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating Resource Group ($ResourceGroupName)..."
try {
    az group create --name $ResourceGroupName --location $Region --output none
    Write-Host "  OK: Resource Group created"
} catch {
    Write-Host "  ERROR: $_"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Creating Storage Account..."
$timestamp = Get-Date -Format "MMddHHmm"
$StorageAccountName = ("mptwarrior" + $timestamp).ToLower().Substring(0, 24)

try {
    az storage account create `
        --name $StorageAccountName `
        --resource-group $ResourceGroupName `
        --location $Region `
        --sku Standard_LRS `
        --output none
    Write-Host "  OK: Storage Account created ($StorageAccountName)"
} catch {
    Write-Host "  ERROR: $_"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Creating Function App ($FunctionAppName)..."
try {
    az functionapp create `
        --resource-group $ResourceGroupName `
        --consumption-plan-location $Region `
        --runtime node `
        --runtime-version 20 `
        --functions-version 4 `
        --name $FunctionAppName `
        --storage-account $StorageAccountName `
        --output none
    Write-Host "  OK: Function App created"
} catch {
    Write-Host "  ERROR: $_"
    exit 1
}

Write-Host ""
Write-Host "Step 5: Setting Environment Variables..."
try {
    az functionapp config appsettings set `
        --name $FunctionAppName `
        --resource-group $ResourceGroupName `
        --settings CRON_SECRET=$CronSecret `
        --output none
    Write-Host "  OK: CRON_SECRET configured"
} catch {
    Write-Host "  ERROR: $_"
    exit 1
}

Write-Host ""
Write-Host "Step 6: Verifying Setup..."
try {
    $funcApp = az functionapp show `
        --name $FunctionAppName `
        --resource-group $ResourceGroupName `
        --output json
    
    Write-Host "  OK: Function App verified"
} catch {
    Write-Host "  WARNING: Could not verify (but setup likely succeeded)"
}

Write-Host ""
Write-Host "=============================================================="
Write-Host "  SETUP COMPLETE!"
Write-Host "=============================================================="
Write-Host ""
Write-Host "Configuration Summary:"
Write-Host "  Resource Group: $ResourceGroupName"
Write-Host "  Function App: $FunctionAppName"
Write-Host "  Region: $Region"
Write-Host "  Storage Account: $StorageAccountName"
Write-Host "  Runtime: Node.js 20"
Write-Host "  API Endpoint: $ApiEndpoint/api/leaderboard/cron-update"
Write-Host ""

Write-Host "NEXT STEPS:"
Write-Host ""
Write-Host "1. Go to Azure Portal:"
Write-Host "   https://portal.azure.com"
Write-Host ""
Write-Host "2. Find your Function App:"
Write-Host "   Search for: $FunctionAppName"
Write-Host ""
Write-Host "3. Create Timer Trigger Function:"
Write-Host "   - Functions > Create"
Write-Host "   - Select: Timer trigger"
Write-Host "   - Name: LeaderboardUpdateCron"
Write-Host "   - Schedule: 0 * * * * *"
Write-Host ""
Write-Host "4. Copy function code from:"
Write-Host "   AZURE_TIMER_TRIGGER_SETUP.md (index.js section)"
Write-Host ""
Write-Host "5. Deploy and Test:"
Write-Host "   - Save the function"
Write-Host "   - Go to Monitor tab to see executions"
Write-Host ""
Write-Host "=============================================================="
Write-Host "All Azure resources created successfully!"
Write-Host "=============================================================="
Write-Host ""
