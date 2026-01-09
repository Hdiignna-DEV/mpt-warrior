# VERCEL DEPLOYMENT SETUP HELPER
# This script helps you identify which environment variables to add to Vercel

Write-Host "MPT-WARRIOR VERCEL SETUP HELPER" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$envFile = "c:\Users\deden\mpt-warrior\.env.local"

if (Test-Path $envFile) {
    Write-Host "Environment file found. Extracting variables..." -ForegroundColor Cyan
    $envContent = Get-Content $envFile | Where-Object { $_ -match "^[A-Z_]+=.*" }
    
    Write-Host ""
    Write-Host "Variables to add to Vercel Settings:" -ForegroundColor Yellow
    Write-Host "===================================" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($line in $envContent) {
        $varName = $line.Split("=")[0]
        $varValue = $line.Split("=", 2)[1]
        
        # Hide sensitive values
        if ($varValue.Length -gt 20) {
            $display = $varValue.Substring(0, 10) + "..." + $varValue.Substring($varValue.Length - 5)
        } else {
            $display = $varValue
        }
        
        Write-Host "  Variable: $varName" -ForegroundColor Cyan
        Write-Host "  Value: $display" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "INSTRUCTIONS:" -ForegroundColor Yellow
    Write-Host "============" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Select mpt-warrior project" -ForegroundColor White
    Write-Host "3. Settings > Environment Variables" -ForegroundColor White
    Write-Host "4. For each variable above, click 'Add New'" -ForegroundColor White
    Write-Host "5. Paste Name and Value" -ForegroundColor White
    Write-Host "6. Select: Production, Preview, Development" -ForegroundColor White
    Write-Host "7. Click Save" -ForegroundColor White
    Write-Host "8. Then click 'Redeploy' on failed deployment" -ForegroundColor White
    
} else {
    Write-Host "ERROR: .env.local not found!" -ForegroundColor Red
}
