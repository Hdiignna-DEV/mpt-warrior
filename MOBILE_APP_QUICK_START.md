# 🚀 MPT Warrior - Quick Start Guide untuk Mobile App

## ✅ Apa yang Sudah Siap

### Phase 1: Azure Static Web Apps ✅
- ✅ Configuration files dibuat
- ✅ GitHub Actions workflow ready
- ✅ Cosmos DB optimization scripts
- ✅ Monitoring alerts scripts
- ✅ PWA push notifications enhanced
- ✅ Deployment documentation lengkap

### Yang Perlu Anda Lakukan Sekarang:

---

## 📋 Step 1: Deploy ke Azure Static Web Apps (30 menit)

### A. Buat Azure Static Web App

1. Login ke [Azure Portal](https://portal.azure.com)
2. Klik **"Create a resource"** → Search **"Static Web App"**
3. Fill in:
   - **Subscription**: Azure for Students
   - **Resource Group**: `mpt-warrior-rg` (create new)
   - **Name**: `mpt-warrior-app`
   - **Region**: East Asia
   - **Plan**: Free (F0)
   - **Deployment**: GitHub
   - **Repository**: Your mpt-warrior repo
   - **Branch**: main
   - **Build Preset**: Next.js
   - **App location**: `/`
   - **Output location**: `.next`
4. Click **Create**

### B. Configure Environment Variables

In Azure Portal → Static Web App → Configuration:

```env
AZURE_COSMOS_ENDPOINT=https://your-cosmos.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key
AZURE_COSMOS_DATABASE=mpt-warrior
GOOGLE_GEMINI_API_KEY=your-api-key
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.azurestaticapps.net
```

### C. Add GitHub Secrets

GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

```
AZURE_STATIC_WEB_APPS_API_TOKEN (from Azure Portal)
AZURE_COSMOS_ENDPOINT
AZURE_COSMOS_KEY
AZURE_COSMOS_DATABASE
GOOGLE_GEMINI_API_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL
```

### D. Deploy

```bash
git add .
git commit -m "Setup Azure Static Web Apps"
git push origin main
```

GitHub Actions will automatically build and deploy!

---

## 📊 Step 2: Optimize Cosmos DB (5 menit)

Run optimization script:

```bash
npm run db:optimize
```

This will:
- ✅ Check current RU/s usage
- ✅ Recommend optimizations
- ✅ Show cost savings
- ✅ Check storage usage

**Target**: Keep RU/s at 400 (free tier)

---

## 🔔 Step 3: Setup Monitoring (10 menit)

Run monitoring setup:

```bash
npm run azure:monitor
```

Follow prompts:
1. Login to Azure CLI
2. Enter Resource Group: `mpt-warrior-rg`
3. Enter your email for alerts

This creates alerts for:
- Cosmos DB RU > 800/s
- Storage > 20 GB
- Bandwidth > 80 GB

---

## 🎉 Step 4: Test PWA Enhancements

1. Visit your deployed app
2. After 10 seconds, you'll see push notification prompt
3. Click **"Enable Notifications"**
4. Test notification by:
   - Adding a trade in Journal
   - Unlocking an achievement

---

## 📱 Step 5: Build React Native App (Optional - Week 2+)

If you want native mobile app:

```bash
# Create new directory (outside current project)
cd ..
npx create-expo-app mpt-warrior-mobile --template blank-typescript
cd mpt-warrior-mobile

# Install dependencies (see REACT_NATIVE_MIGRATION_PLAN.md)
npm install expo-router react-native-safe-area-context ...

# Start development
npx expo start
```

See [REACT_NATIVE_MIGRATION_PLAN.md](REACT_NATIVE_MIGRATION_PLAN.md) for full guide.

---

## 💰 Free Tier Limits

### Azure for Students - What You Get FREE:

✅ **Cosmos DB**
- 1000 RU/s throughput FREE forever
- 25 GB storage FREE forever
- Support: ~5,000-10,000 active users

✅ **Static Web Apps**
- 100 GB bandwidth/month
- 2 custom domains
- Unlimited API calls
- Support: ~10,000-20,000 visitors/month

✅ **Azure Functions**
- 1 million executions/month
- 400,000 GB-s compute

**Total: $0/month for your community!** 🎉

---

## 🚨 Important Notes

### 1. Monitor Weekly
- Check RU/s consumption in Azure Portal
- Review bandwidth usage
- Set up email alerts (done in Step 3)

### 2. Optimize Queries
```typescript
// ❌ BAD - High RU cost
const all = await container.items.readAll().fetchAll();

// ✅ GOOD - Low RU cost
const user = await container.item(userId, userId).read();
```

### 3. Enable Caching
- React Query already setup ✅
- Service Worker caching enabled ✅
- Use CDN for static assets ✅

### 4. If Traffic Grows
Options:
1. **React Native** (no bandwidth cost!)
2. **Premium membership** ($5-10/month)
3. **Upgrade Azure** (pay-as-you-go)

---

## 📚 Documentation Reference

- **Deployment**: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)
- **React Native**: [REACT_NATIVE_MIGRATION_PLAN.md](REACT_NATIVE_MIGRATION_PLAN.md)
- **PWA Setup**: [PWA_SETUP.md](PWA_SETUP.md)

---

## ✅ Checklist

### Immediate (Today):
- [ ] Create Azure Static Web App
- [ ] Configure environment variables
- [ ] Add GitHub secrets
- [ ] Push code to deploy
- [ ] Run db:optimize script
- [ ] Setup monitoring alerts
- [ ] Test PWA on mobile device

### Week 2 (Optional):
- [ ] Review React Native plan
- [ ] Create Expo project
- [ ] Start migrating features

### Ongoing:
- [ ] Monitor usage weekly
- [ ] Review costs monthly
- [ ] Optimize queries as needed

---

## 🆘 Need Help?

### Common Issues:

**Build Failed?**
- Check GitHub Actions logs
- Verify environment variables
- Test build locally: `npm run build`

**Cosmos DB Error?**
- Check connection string
- Verify RU/s settings
- Run `npm run db:check`

**Push Notifications Not Working?**
- Check browser permissions
- Clear cache and retry
- Check service worker registration

---

## 🎯 What You Get

### Current (PWA):
✅ Install from browser
✅ Offline support
✅ Push notifications (web)
✅ Works on all devices
✅ Instant updates
✅ **FREE hosting on Azure**

### Future (React Native):
✅ App Store & Play Store
✅ Native push notifications
✅ Better performance
✅ Biometric login
✅ Haptic feedback
✅ **Still FREE backend (Azure)**

---

## 🚀 You're Ready!

Your MPT Warrior app is now:
1. ✅ Ready to deploy to Azure (FREE)
2. ✅ Optimized for free tier
3. ✅ Monitored with alerts
4. ✅ PWA-enhanced for mobile
5. ✅ Planned for React Native

**Start with Step 1 above and you'll be live in 30 minutes!** 🎉

---

## 📝 Commands Quick Reference

```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production

# Database
npm run db:check            # Check Cosmos DB health
npm run db:optimize         # Optimize for free tier
npm run db:init             # Initialize database

# Azure
npm run azure:deploy        # Build & remind to push
npm run azure:monitor       # Setup monitoring alerts

# Testing
npm run lint               # Check code quality
```

**Selamat coding, Warrior! ⚔️**
