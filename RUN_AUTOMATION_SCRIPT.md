# 🚀 AZURE AUTOMATION SETUP - QUICK START

**Time:** 10 minutes  
**Difficulty:** Easy (just run 3 commands!)  
**Result:** Complete Azure Timer Trigger setup

---

## ⚡ QUICK START (3 COMMANDS)

### Command 1: Check Prerequisites
```powershell
az --version
```
Should show: `azure-cli 2.x.x`

If not installed: https://learn.microsoft.com/cli/azure/install-azure-cli-windows

---

### Command 2: Login to Azure
```powershell
az login
```
Will open browser to login with your Azure Student account.

---

### Command 3: Run Automation Script
```powershell
cd c:\Users\deden\mpt-warrior
.\setup-azure-cron.ps1
```

**That's it!** ✨

The script will:
- ✅ Create Resource Group
- ✅ Create Storage Account
- ✅ Create Function App
- ✅ Configure environment variables
- ✅ Setup Timer Trigger
- ✅ Display summary

---

## 📊 WHAT HAPPENS

```
You run: .\setup-azure-cron.ps1
           ↓
Script checks: Azure CLI, login status
           ↓
Creates: Resource Group, Storage, Function App
           ↓
Configures: CRON_SECRET environment variable
           ↓
Result: Ready to use!
           ↓
Display: Summary & next steps
```

---

## ✅ EXPECTED OUTPUT

When script runs successfully, you'll see:

```
═══════════════════════════════════════════════════════════════
  🚀 AZURE TIMER TRIGGER SETUP - AUTOMATED
═══════════════════════════════════════════════════════════════

Step 1: Checking Prerequisites...
✅ Azure CLI found
✅ Logged into Azure
   Account: Your Name
   Subscription: your-sub-id

Step 2: Creating Resource Group...
  Creating: mpt-warrior-rg in southeastasia...
✅ Resource Group created

Step 3: Creating Storage Account...
  Creating: mptwarrior0110... 
✅ Storage Account created

Step 4: Creating Function App...
  Creating: mpt-warrior-cron...
✅ Function App created

Step 5: Configuring Environment Variables...
  Setting: CRON_SECRET...
✅ Environment variables configured

Step 6: Creating Timer Trigger Function...
✅ Function created

Step 7: Verifying Setup...
  Getting Function App details...
✅ Function App verified

📊 Configuration Summary:
  Resource Group: mpt-warrior-rg
  Function App: mpt-warrior-cron
  Region: southeastasia
  Runtime: Node.js 20
  Schedule: Every hour (0 * * * * *)
  API Endpoint: https://mpt-community.vercel.app/api/leaderboard/cron-update

═══════════════════════════════════════════════════════════════
  ✅ AZURE SETUP COMPLETE!
═══════════════════════════════════════════════════════════════

📝 NEXT STEPS:
1. Go to Azure Portal...
2. Navigate to Function App...
3. Create Timer Trigger Function...
4. Monitor Execution...
5. Verify Success...
```

---

## 🔧 AFTER SCRIPT COMPLETES

You still need to:

**In Azure Portal (10 minutes):**
1. Go to your Function App: `mpt-warrior-cron`
2. Create the Timer Trigger function (copy code from AZURE_TIMER_TRIGGER_SETUP.md)
3. Test it manually
4. Watch Monitor tab for hourly executions

---

## ❓ FAQ

**Q: What if I get permission error?**
A: Make sure you have Contributor role on the subscription. Student accounts usually have this.

**Q: Can I run the script multiple times?**
A: Yes! It's idempotent (safe to run multiple times).

**Q: Can I customize the settings?**
A: Yes! You can pass parameters:
```powershell
.\setup-azure-cron.ps1 `
  -ResourceGroupName "my-group" `
  -FunctionAppName "my-function" `
  -Region "westus2"
```

**Q: What if script fails halfway?**
A: Check the error message and rerun. Azure will skip already-created resources.

**Q: How do I verify it worked?**
A: Check Azure Portal → Function App → Monitor tab

---

## 📋 CHECKLIST

Before running script:
- [ ] Azure CLI installed
- [ ] Logged into Azure (`az login`)
- [ ] Azure Student account active
- [ ] $100/month credit available

Running script:
- [ ] Open PowerShell as Admin
- [ ] Navigate to project folder
- [ ] Run: `.\setup-azure-cron.ps1`
- [ ] Wait for completion (2-5 minutes)

After script:
- [ ] Check Azure Portal
- [ ] Create Timer Trigger function
- [ ] Test the function
- [ ] Monitor executions

---

## 🚀 COMMAND TO RUN NOW

Copy & paste this into PowerShell:

```powershell
cd c:\Users\deden\mpt-warrior
.\setup-azure-cron.ps1
```

That's it! 🎉

---

**Status:** Script ready  
**Time:** ~10 minutes to complete  
**Cost:** Free (student credit)  
**Next:** Run script, then follow NEXT STEPS in output
