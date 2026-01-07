# ✅ MPT Warrior - Deployment Checklist

Print atau bookmark halaman ini untuk guide cepat!

---

## PHASE 1: PRE-DEPLOYMENT ✅ DONE

- [x] Dependencies installed
- [x] Environment variables setup
- [x] Cosmos DB connected
- [x] Application builds successfully

---

## PHASE 2: AZURE SETUP (NOW)

### A. Create Azure Static Web App
- [ ] Login ke https://portal.azure.com
- [ ] Create Resource → Search "Static Web App"
- [ ] Fill form:
  - Resource Group: `mpt-warrior-rg`
  - Name: `mpt-warrior-app`
  - Plan: FREE
  - Region: East Asia
  - Source: GitHub
  - Repository: Your repo
  - Build Preset: Next.js
- [ ] Click Create
- [ ] Wait for deployment (2-3 min)

### B. Get Deployment Token
- [ ] Go to resource
- [ ] Manage deployment token → Copy
- [ ] SAVE token untuk step berikutnya

### C. Add Environment Variables in Azure
Di Azure Portal → Configuration → Add:

- [ ] AZURE_COSMOS_ENDPOINT
- [ ] AZURE_COSMOS_KEY
- [ ] AZURE_COSMOS_DATABASE
- [ ] NEXT_PUBLIC_GEMINI_API_KEY
- [ ] GEMINI_API_KEY
- [ ] JWT_SECRET
- [ ] NEXT_PUBLIC_ADMIN_EMAIL
- [ ] NEXT_PUBLIC_APP_URL (use your Azure URL)
- [ ] Click SAVE

---

## PHASE 3: GITHUB SETUP

### Add GitHub Secrets
GitHub repo → Settings → Secrets → Actions → New:

- [ ] AZURE_STATIC_WEB_APPS_API_TOKEN (from Step B)
- [ ] AZURE_COSMOS_ENDPOINT
- [ ] AZURE_COSMOS_KEY  
- [ ] AZURE_COSMOS_DATABASE
- [ ] GOOGLE_GEMINI_API_KEY
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL (your Azure URL)

---

## PHASE 4: DEPLOY

### Push Code
```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

- [ ] Code pushed
- [ ] GitHub Actions running (check Actions tab)
- [ ] Wait for green checkmark (3-5 min)
- [ ] Check Azure Portal → Environments

---

## PHASE 5: VERIFY

- [ ] Open your app URL
- [ ] Test login/register
- [ ] Test Dashboard
- [ ] Test Journal
- [ ] Test Calculator
- [ ] Test AI Mentor
- [ ] Install PWA (Add to Home Screen)
- [ ] Test push notifications

---

## PHASE 6: MONITORING (Optional)

```bash
npm run azure:monitor
```

- [ ] Setup alerts
- [ ] Configure email notifications
- [ ] Weekly usage checks

---

## 🎯 YOUR APP URL

Write it here:
```
https://_____________________.azurestaticapps.net
```

---

## 📞 QUICK COMMANDS

```bash
npm run dev              # Test locally
npm run build            # Build
npm run db:check         # Check DB
npm run db:optimize      # Optimize DB
npm run azure:monitor    # Monitoring
```

---

## 🐛 QUICK FIXES

**Build Failed?**
→ Check GitHub Actions logs

**App Error?**
→ Verify all env vars in Azure Configuration

**Can't Login?**
→ Check NEXTAUTH_URL matches your actual URL

**Slow/Down?**
→ Check RU/s in Cosmos DB (keep < 1000)

---

## ✅ SUCCESS CRITERIA

Your app is LIVE when:
- ✅ URL accessible
- ✅ Can register user
- ✅ Can login
- ✅ Dashboard loads
- ✅ All features work

---

**Total Time: ~30 minutes**
**Total Cost: $0/month (FREE!)** 🎉

**Share dengan komunitas Anda! ⚔️**
