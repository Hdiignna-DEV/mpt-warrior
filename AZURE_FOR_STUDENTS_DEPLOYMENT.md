# 🚀 MPT Warrior - Panduan Lengkap Deployment ke Azure untuk Students

**Target**: Deploy aplikasi Next.js dengan Azure Cosmos DB ke Azure Static Web Apps menggunakan akun **Azure for Students**.

---

## 📋 Prerequisites

✅ **Azure for Students Account** (sudah aktif)
✅ **Azure Cosmos DB** sudah setup
✅ **GitHub Account** dengan repository ini
✅ **Node.js 20+** terinstall di local

---

## 🎯 LANGKAH 1: Persiapan Azure Portal (5 menit)

### 1.1 Login ke Azure Portal
1. Buka [portal.azure.com](https://portal.azure.com)
2. Login dengan akun Azure for Students Anda
3. Verify kredit: cek sisa kredit di dashboard (seharusnya $100)

### 1.2 Create Resource Group (jika belum ada)
1. Search "Resource groups" di top search bar
2. Klik **+ Create**
3. Isi detail:
   - **Subscription**: Azure for Students
   - **Resource group**: `mpt-warrior-rg`
   - **Region**: `East Asia` (paling dekat dengan Indonesia)
4. Klik **Review + create** → **Create**

---

## 🌐 LANGKAH 2: Create Azure Static Web App (10 menit)

### 2.1 Create Static Web App
1. Di Azure Portal, klik **+ Create a resource**
2. Search: **"Static Web App"**
3. Klik **Create**

### 2.2 Konfigurasi Basic
```yaml
Project Details:
  Subscription: Azure for Students
  Resource Group: mpt-warrior-rg

Instance Details:
  Name: mpt-warrior-app
  Plan type: Free
  Region for Azure Functions API: East Asia

Deployment Details:
  Source: GitHub
  Organization: [your-github-username]
  Repository: mpt-warrior
  Branch: main

Build Details:
  Build Presets: Next.js
  App location: /
  Api location: (leave empty)
  Output location: .next
```

### 2.3 Authorize GitHub
- Klik **Sign in with GitHub**
- Authorize Azure Static Web Apps
- Select repository: `mpt-warrior`

### 2.4 Create
1. Klik **Review + create**
2. Review settings
3. Klik **Create**
4. **Wait 2-3 minutes** untuk deployment

### 2.5 Get Deployment Token
1. Setelah resource created, klik **Go to resource**
2. Di left menu, klik **Configuration**
3. Copy **Deployment token** (save ini untuk GitHub Secrets)

---

## 🔐 LANGKAH 3: Setup GitHub Secrets (10 menit)

### 3.1 Buka GitHub Repository Settings
1. Buka: `https://github.com/[your-username]/mpt-warrior`
2. Klik **Settings** tab
3. Di left sidebar, klik **Secrets and variables** → **Actions**
4. Klik **New repository secret**

### 3.2 Add Secrets Satu Per Satu

#### Secret 1: Azure Deployment Token
```
Name: AZURE_STATIC_WEB_APPS_API_TOKEN
Value: [paste deployment token dari step 2.5]
```

#### Secret 2: Azure Cosmos DB Endpoint
```
Name: AZURE_COSMOS_ENDPOINT
Value: https://mpt-warrior-db.documents.azure.com:443/
```

#### Secret 3: Azure Cosmos DB Key
```
Name: AZURE_COSMOS_KEY
Value: [your cosmos db key dari .env.local]
```

#### Secret 4: Azure Cosmos DB Database
```
Name: AZURE_COSMOS_DATABASE
Value: mpt-warrior
```

#### Secret 5: Connection String
```
Name: AZURE_COSMOS_CONNECTION_STRING
Value: [full connection string dari .env.local]
```

#### Secret 6: Gemini API Key
```
Name: NEXT_PUBLIC_GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

#### Secret 7: Gemini API Key (server)
```
Name: GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

#### Secret 8: JWT Secret
```
Name: JWT_SECRET
Value: [your JWT secret dari .env.local]
```

#### Secret 9: Admin Email
```
Name: NEXT_PUBLIC_ADMIN_EMAIL
Value: dedenhadigun@gmail.com
```

#### Secret 10: GROQ API (optional)
```
Name: GROQ_API_KEY
Value: [your groq key jika ada]
```

```
Name: NEXT_PUBLIC_GROQ_API_KEY
Value: [your groq key jika ada]
```

**Total: 11 secrets minimum**

---

## 🚀 LANGKAH 4: Deploy ke Azure (5 menit)

### 4.1 Commit & Push Changes
```bash
# Pastikan semua perubahan sudah di commit
git add .
git commit -m "Setup Azure Static Web Apps deployment"
git push origin main
```

### 4.2 Monitor Deployment
1. Buka: `https://github.com/[your-username]/mpt-warrior/actions`
2. Lihat workflow: **Azure Static Web Apps CI/CD**
3. Klik workflow yang sedang running
4. Monitor progress (biasanya 3-5 menit)

### 4.3 Check Build Logs
- Expand setiap step untuk lihat details
- Pastikan **Build Next.js App** success ✅
- Pastikan **Deploy to Azure Static Web Apps** success ✅

---

## ✅ LANGKAH 5: Verify Deployment (5 menit)

### 5.1 Get Your App URL
1. Kembali ke Azure Portal
2. Go to your Static Web App: `mpt-warrior-app`
3. Di **Overview** page, copy **URL**
4. Format: `https://mpt-warrior-app.azurestaticapps.net`

### 5.2 Test Website
1. Buka URL di browser
2. Test features:
   - ✅ Homepage loads
   - ✅ Login works
   - ✅ Academy modules accessible
   - ✅ Database connection works

### 5.3 Update Environment Variable (jika perlu)
Jika URL berbeda, update `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://your-actual-url.azurestaticapps.net
```

---

## 📱 LANGKAH 6: Optimize untuk Mobile (Bonus)

### 6.1 Test PWA di Mobile
1. Buka website di mobile browser (Chrome/Safari)
2. Tap **Add to Home Screen**
3. Test offline functionality

### 6.2 Configure PWA Settings
File sudah ready:
- ✅ `public/manifest.json`
- ✅ `public/service-worker.js`
- ✅ `public/offline.html`

---

## 🔧 LANGKAH 7: Post-Deployment Configuration

### 7.1 Setup Custom Domain (Optional)
1. Di Azure Portal → Static Web App → **Custom domains**
2. Klik **+ Add**
3. Enter your domain
4. Follow DNS configuration steps

### 7.2 Enable HTTPS
- Azure Static Web Apps automatically provides HTTPS ✅
- No additional configuration needed

### 7.3 Configure CORS (if needed)
Already configured in `staticwebapp.config.json` ✅

---

## 📊 LANGKAH 8: Monitor & Optimize

### 8.1 Check Cosmos DB Usage
```bash
npm run db:optimize
```

This will show:
- Current RU/s usage
- Storage usage
- Cost estimates
- Optimization recommendations

### 8.2 Setup Monitoring
```bash
npm run azure:monitor
```

### 8.3 View Analytics
1. Azure Portal → Static Web App → **Metrics**
2. Monitor:
   - Requests per day
   - Response times
   - Error rates

---

## 🎯 CHECKLIST Deployment

### Pre-Deployment
- [ ] Azure for Students account active
- [ ] GitHub repository accessible
- [ ] All environment variables ready
- [ ] Cosmos DB running

### Deployment
- [ ] Resource Group created
- [ ] Static Web App created
- [ ] GitHub Secrets configured (11+ secrets)
- [ ] GitHub Actions workflow success
- [ ] Website accessible via Azure URL

### Post-Deployment
- [ ] Test login/signup
- [ ] Test database operations
- [ ] Test AI features (Gemini)
- [ ] PWA installable on mobile
- [ ] Check Cosmos DB Free Tier (400 RU/s)

---

## 🆘 Troubleshooting

### Build Failed di GitHub Actions
```bash
# Check build logs untuk specific error
# Common issues:
1. Missing secrets → Re-add di GitHub Secrets
2. Node version → Workflow uses Node 20
3. Dependencies → Run npm ci locally first
```

### Website 404 Error
```bash
# Solution:
1. Check output_location in workflow: .next
2. Verify build completed successfully
3. Check staticwebapp.config.json routing
```

### Database Connection Error
```bash
# Verify:
1. AZURE_COSMOS_CONNECTION_STRING is correct
2. Cosmos DB firewall allows Azure services
3. Check secret names match exactly
```

### PWA Not Installing
```bash
# Check:
1. HTTPS enabled (should be automatic)
2. manifest.json accessible
3. Service worker registered
```

---

## 💰 Cost Management (Azure for Students)

### Free Tier Limits
- **Azure Static Web Apps**: Free tier (100 GB bandwidth/month)
- **Azure Cosmos DB**: 400 RU/s free forever
- **GitHub Actions**: 2000 minutes/month free

### Monitor Spending
```bash
# Check Azure Portal → Cost Management
# Set budget alerts:
1. Go to Subscriptions
2. Click Cost Management → Budgets
3. Create alert at $10, $20, $50
```

### Optimize Cosmos DB
```bash
# Run monthly:
npm run db:optimize

# Keep RU/s at 400 (free tier)
# Archive old data if needed
```

---

## 🎉 Selesai!

Your MPT Warrior app is now live on Azure! 

**Live URL**: `https://mpt-warrior-app.azurestaticapps.net`

### Next Steps:
1. ✅ Share link dengan users
2. ✅ Monitor usage di Azure Portal
3. ✅ Setup custom domain (optional)
4. ✅ Configure email notifications
5. ✅ Build mobile version (lanjut ke MOBILE_DEPLOYMENT_GUIDE.md)

---

## 📞 Support

Jika ada masalah:
1. Check GitHub Actions logs
2. Check Azure Portal → Diagnostics
3. Review this guide
4. Check project documentation

**Happy Deployment! 🚀**
