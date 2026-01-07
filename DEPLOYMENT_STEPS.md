# 🚀 MPT Warrior - Deployment Step-by-Step Guide

## ✅ Status Saat Ini

- ✅ Dependencies installed
- ✅ Environment variables configured
- ✅ Cosmos DB connected (1000 RU/s FREE tier)
- ✅ Application builds successfully
- ✅ Ready to deploy!

---

## 📋 STEP 1: Create Azure Static Web App (10 menit)

### A. Login ke Azure Portal

1. Buka [Azure Portal](https://portal.azure.com)
2. Login dengan akun Azure for Students Anda

### B. Create Static Web App

1. Click **"+ Create a resource"** (tombol biru di kiri atas)
2. Search: **"Static Web App"**
3. Click **"Static Web Apps"** → Click **"Create"**

### C. Fill Configuration

**Project Details:**
```
Subscription: Azure for Students
Resource Group: mpt-warrior-rg (click "Create new")
```

**Static Web App Details:**
```
Name: mpt-warrior-app
Hosting Plan: Free
Region: East Asia (atau region terdekat dengan Indonesia)
```

**Deployment Details:**
```
Source: GitHub
```

4. Click **"Sign in with GitHub"** → Authorize

```
GitHub Account: [Your GitHub account]
Organization: [Your GitHub username]
Repository: mpt-warrior (pilih repo Anda)
Branch: main
```

**Build Details:**
```
Build Presets: Next.js
App location: /
Api location: (leave empty)
Output location: .next
```

5. Click **"Review + create"**
6. Click **"Create"**

⏱️ **Wait 2-3 menit** untuk deployment selesai

---

## 📋 STEP 2: Get Deployment Token (2 menit)

1. Setelah deployment selesai, click **"Go to resource"**
2. Di left menu, click **"Manage deployment token"**
3. Click **"Copy"** untuk copy token
4. **SAVE TOKEN INI** - Anda akan butuh untuk GitHub Secrets

---

## 📋 STEP 3: Configure Environment Variables in Azure (5 menit)

1. Di Azure Static Web App → Left menu → **"Configuration"**
2. Click **"+ Add"** untuk setiap environment variable:

### Add These Variables:

```env
Name: AZURE_COSMOS_ENDPOINT
Value: https://your-cosmos-account.documents.azure.com:443/

Name: AZURE_COSMOS_KEY
Value: [Get from Azure Portal > Cosmos DB > Keys]

Name: AZURE_COSMOS_DATABASE
Value: mpt-warrior

Name: NEXT_PUBLIC_GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo

Name: GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo

Name: JWT_SECRET
Value: 33bd8a08f87cbebc4c4d39cbf23de954420f59374d024eda9cf574db20fab4b0

Name: NEXT_PUBLIC_ADMIN_EMAIL
Value: dedenhadigun@gmail.com

Name: NEXT_PUBLIC_APP_URL
Value: https://[your-app-name].azurestaticapps.net
(ganti dengan URL app Anda dari Azure Portal)
```

3. Click **"Save"** di atas setelah add semua

---

## 📋 STEP 4: Setup GitHub Secrets (5 menit)

1. Buka repository GitHub Anda: https://github.com/[username]/mpt-warrior
2. Click **"Settings"** tab
3. Left menu → **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

### Add These Secrets:

**Secret 1:**
```
Name: AZURE_STATIC_WEB_APPS_API_TOKEN
Value: [paste token dari Step 2]
```

**Secret 2:**
```
Name: AZURE_COSMOS_ENDPOINT
Value: https://mpt-warrior-db.documents.azure.com:443/
```

**Secret 3:**
```
Name: AZURE_COSMOS_KEY
Value: [Get from Azure Portal > Cosmos DB > Keys]
```

**Secret 4:**
```
Name: AZURE_COSMOS_DATABASE
Value: mpt-warrior
```

**Secret 5:**
```
Name: GOOGLE_GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

**Secret 6:**
```
Name: NEXTAUTH_SECRET
Value: 33bd8a08f87cbebc4c4d39cbf23de954420f59374d024eda9cf574db20fab4b0
```

**Secret 7:**
```
Name: NEXTAUTH_URL
Value: https://[your-app-name].azurestaticapps.net
(ganti dengan URL app Anda)
```

---

## 📋 STEP 5: Deploy! (1 menit)

Di terminal/command prompt Anda:

```bash
git add .
git commit -m "Setup Azure Static Web Apps deployment"
git push origin main
```

**GitHub Actions akan automatically:**
1. Build aplikasi Anda
2. Deploy ke Azure Static Web Apps
3. Update live site

---

## 📋 STEP 6: Monitor Deployment (2 menit)

### Check GitHub Actions:

1. Buka GitHub repo → **"Actions"** tab
2. Lihat workflow yang running
3. Wait sampai ✅ green checkmark (sekitar 3-5 menit)

### Check Azure Portal:

1. Azure Portal → Static Web App → **"Environments"**
2. Lihat deployment status
3. Click URL untuk buka app!

---

## 🌐 STEP 7: Access Your App!

Your app akan available di:
```
https://[your-app-name].azurestaticapps.net
```

Ganti `[your-app-name]` dengan nama yang Anda pilih di Step 1.

**Copy URL ini** dan:
1. Update di Azure Configuration → NEXT_PUBLIC_APP_URL
2. Update di GitHub Secrets → NEXTAUTH_URL
3. Share ke komunitas Anda! 🎉

---

## 📊 STEP 8: Setup Monitoring (Optional - 5 menit)

Untuk monitor free tier limits:

```bash
npm run azure:monitor
```

Ikuti prompts:
1. Login to Azure
2. Enter Resource Group: mpt-warrior-rg
3. Enter your email

Ini akan setup alerts untuk:
- Cosmos DB RU > 800/s
- Storage > 20 GB
- Bandwidth > 80 GB

---

## ✅ Checklist - What's Done

- ✅ Azure Static Web App created
- ✅ Environment variables configured
- ✅ GitHub secrets added
- ✅ Code pushed & deployed
- ✅ App is LIVE!

---

## 🎯 What You Have Now

✅ **Web App**: Accessible dari browser
✅ **PWA**: Bisa install ke home screen
✅ **Push Notifications**: Trading alerts
✅ **Offline Support**: Works tanpa internet
✅ **FREE Hosting**: Azure for Students
✅ **Auto Deploy**: Push code = auto update

---

## 🐛 Troubleshooting

### Build Failed?
1. Check GitHub Actions logs
2. Verify all secrets are added
3. Run `npm run build` locally first

### App Shows Error?
1. Check Azure Configuration variables
2. Wait 5 minutes setelah deployment
3. Hard refresh browser (Ctrl+Shift+R)

### Can't Access App?
1. Check deployment status di Azure Portal
2. Verify DNS propagation (might take few minutes)
3. Try incognito/private mode

---

## 🚀 Next Steps

### Now:
1. ✅ Test all features
2. ✅ Create admin user
3. ✅ Invite komunitas Anda

### Later (Optional):
- Build React Native mobile app
- Custom domain setup
- Advanced analytics

---

## 💰 Cost Monitor

**Current Setup: $0/month** 🎉

- Cosmos DB: FREE (1000 RU/s)
- Static Web Apps: FREE (100 GB bandwidth)
- Storage: 0.12 MB (25 GB FREE)

**Capacity:**
- ~5,000-10,000 active users
- ~10,000-20,000 visitors/month

---

## 🆘 Need Help?

### Common Commands:
```bash
npm run dev              # Test locally
npm run build            # Build for production
npm run db:check         # Check database
npm run db:optimize      # Optimize Cosmos DB
npm run azure:monitor    # Setup monitoring
```

### Resources:
- [Azure Portal](https://portal.azure.com)
- [GitHub Actions](https://github.com/[username]/mpt-warrior/actions)
- [Deployment Guide](AZURE_DEPLOYMENT_GUIDE.md)

---

**Selamat! Aplikasi Anda sudah LIVE! 🎉⚔️**
